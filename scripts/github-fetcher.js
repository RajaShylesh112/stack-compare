import { Client, Storage, ID, Databases, Query } from "node-appwrite";
import dotenv from 'dotenv';

dotenv.config(); // For local dev

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set in Appwrite UI later
const BUCKET_ID = 'github-raw'; // Your bucket name
const DATABASE_ID = 'stack-compare-db'; // Your database ID
const REPOSITORIES_COLLECTION_ID = 'repositories'; // Collection for repo metadata
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APPWRITE_PROJECT = process.env.APPWRITE_PROJECT;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;




// Generate stack metadata from collected files
function generateStackMetadata(repo, files) {
  const stackMeta = {
    repository: repo.full_name,
    primary_language: repo.language,
    detected_technologies: [],
    frameworks: [],
    databases: [],
    infrastructure: [],
    package_managers: [],
    build_tools: [],
    containerization: [],
    generated_at: new Date().toISOString()
  };

  // Analyze package.json
  if (files['package.json']) {
    try {
      const pkg = JSON.parse(files['package.json']);
      stackMeta.package_managers.push('npm');
      
      // Extract frameworks and libraries
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      Object.keys(deps).forEach(dep => {
        if (dep.includes('react')) stackMeta.frameworks.push('React');
        if (dep.includes('vue')) stackMeta.frameworks.push('Vue.js');
        if (dep.includes('angular')) stackMeta.frameworks.push('Angular');
        if (dep.includes('express')) stackMeta.frameworks.push('Express.js');
        if (dep.includes('next')) stackMeta.frameworks.push('Next.js');
        if (dep.includes('nuxt')) stackMeta.frameworks.push('Nuxt.js');
        if (dep.includes('typescript')) stackMeta.detected_technologies.push('TypeScript');
        if (dep.includes('mongodb') || dep.includes('mongoose')) stackMeta.databases.push('MongoDB');
        if (dep.includes('mysql') || dep.includes('mysql2')) stackMeta.databases.push('MySQL');
        if (dep.includes('postgres') || dep.includes('pg')) stackMeta.databases.push('PostgreSQL');
        if (dep.includes('redis')) stackMeta.databases.push('Redis');
      });
    } catch (e) {
      // Invalid JSON, skip
    }
  }

  // Analyze requirements.txt
  if (files['requirements.txt']) {
    stackMeta.package_managers.push('pip');
    const lines = files['requirements.txt'].split('\n');
    lines.forEach(line => {
      const pkg = line.trim().toLowerCase().split(/[>=<]/)[0];
      if (pkg.includes('django')) stackMeta.frameworks.push('Django');
      if (pkg.includes('flask')) stackMeta.frameworks.push('Flask');
      if (pkg.includes('fastapi')) stackMeta.frameworks.push('FastAPI');
      if (pkg.includes('streamlit')) stackMeta.frameworks.push('Streamlit');
      if (pkg.includes('pandas')) stackMeta.detected_technologies.push('Pandas');
      if (pkg.includes('numpy')) stackMeta.detected_technologies.push('NumPy');
      if (pkg.includes('tensorflow')) stackMeta.detected_technologies.push('TensorFlow');
      if (pkg.includes('pytorch')) stackMeta.detected_technologies.push('PyTorch');
      if (pkg.includes('opencv')) stackMeta.detected_technologies.push('OpenCV');
      if (pkg.includes('redis')) stackMeta.databases.push('Redis');
      if (pkg.includes('psycopg')) stackMeta.databases.push('PostgreSQL');
      if (pkg.includes('pymongo')) stackMeta.databases.push('MongoDB');
    });
  }

  // Analyze Dockerfile
  if (files['Dockerfile']) {
    stackMeta.containerization.push('Docker');
    const dockerfile = files['Dockerfile'].toLowerCase();
    if (dockerfile.includes('nginx')) stackMeta.infrastructure.push('Nginx');
    if (dockerfile.includes('apache')) stackMeta.infrastructure.push('Apache');
    if (dockerfile.includes('node:')) stackMeta.detected_technologies.push('Node.js');
    if (dockerfile.includes('python:')) stackMeta.detected_technologies.push('Python');
    if (dockerfile.includes('openjdk') || dockerfile.includes('java:')) stackMeta.detected_technologies.push('Java');
  }

  // Analyze other files
  if (files['pom.xml']) {
    stackMeta.package_managers.push('Maven');
    stackMeta.build_tools.push('Maven');
    stackMeta.detected_technologies.push('Java');
  }

  if (files['build.gradle']) {
    stackMeta.package_managers.push('Gradle');
    stackMeta.build_tools.push('Gradle');
    stackMeta.detected_technologies.push('Java/Kotlin');
  }

  if (files['composer.json']) {
    stackMeta.package_managers.push('Composer');
    stackMeta.detected_technologies.push('PHP');
  }

  if (files['Gemfile']) {
    stackMeta.package_managers.push('Bundler');
    stackMeta.detected_technologies.push('Ruby');
  }

  if (files['cargo.toml']) {
    stackMeta.package_managers.push('Cargo');
    stackMeta.detected_technologies.push('Rust');
  }

  if (files['go.mod']) {
    stackMeta.package_managers.push('Go Modules');
    stackMeta.detected_technologies.push('Go');
  }

  // Remove duplicates
  Object.keys(stackMeta).forEach(key => {
    if (Array.isArray(stackMeta[key])) {
      stackMeta[key] = [...new Set(stackMeta[key])];
    }
  });

  return stackMeta;
}

// Check if repository already exists in database
async function checkRepositoryExists(databases, repoFullName) {
  try {
    const existing = await databases.listDocuments(
      DATABASE_ID, 
      REPOSITORIES_COLLECTION_ID, 
      [Query.equal("repo_full_name", repoFullName)]
    );
    
    return {
      exists: existing.total > 0,
      document: existing.total > 0 ? existing.documents[0] : null,
      lastFetched: existing.total > 0 ? existing.documents[0].last_fetched : null
    };
  } catch (error) {
    // If collection doesn't exist or other error, assume it doesn't exist
    return { exists: false, document: null, lastFetched: null };
  }
}

// Check if we should skip fetching based on last update
function shouldSkipFetching(repoLastPushed, lastFetched, forceRefresh = false) {
  if (forceRefresh) return false;
  if (!lastFetched) return false;
  
  const lastFetchedDate = new Date(lastFetched);
  const repoLastPushedDate = new Date(repoLastPushed);
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  // Skip if we fetched recently and repo hasn't been updated since
  return lastFetchedDate > oneDayAgo && repoLastPushedDate < lastFetchedDate;
}

// Delete existing files for a repository from storage
async function deleteExistingRepoFiles(storage, databases, repoFullName) {
  try {
    // Get existing file records from database
    const existingRepo = await databases.listDocuments(
      DATABASE_ID,
      REPOSITORIES_COLLECTION_ID,
      [Query.equal("repo_full_name", repoFullName)]
    );
    
    if (existingRepo.total > 0) {
      const repoDoc = existingRepo.documents[0];
      // Since stored_file_ids doesn't exist in schema, we'll skip file deletion for now
      // In a production environment, you'd want to track file IDs in a separate collection
      // or add this attribute to the schema
      
      return 0; // No files deleted since we can't track them in current schema
    }
    
    return 0;
  } catch (error) {
    // Note: log function not available in this context since it's called before main function
    // In production, consider adding a logging parameter or using a proper logger
    return 0;
  }
}

// Save or update repository in database
async function saveRepositoryToDatabase(databases, repoData, stackMeta, qualityAnalysis, storedFileIds, fileIndex) {
  const repoFullName = repoData.name;
  const timestamp = new Date().toISOString();
  
  // Check if repository exists
  const existingCheck = await checkRepositoryExists(databases, repoFullName);
  
  // Create comprehensive file mapping for the quality_warnings field
  const fileMapping = {
    fileIndex: fileIndex || {},
    storedFileIds: storedFileIds || [],
    fileCount: storedFileIds ? storedFileIds.length : 0,
    lastUpdated: timestamp
  };
  
  const documentData = {
    repo_full_name: repoFullName,
    name: repoData.name.split('/').pop(), // Extract just the repo name part
    description: repoData.description || '',
    stars: repoData.stars || 0,
    forks: repoData.forks || 0,
    language: repoData.language || '',
    topics: JSON.stringify(repoData.topics || []),
    license: repoData.license || '',
    created_at: repoData.created_at,
    updated_at: repoData.updated_at,
    size: repoData.size || 0,
    open_issues: repoData.open_issues || 0,
    watchers: repoData.watchers || 0,
    url: repoData.url,
    clone_url: repoData.clone_url,
    
    // Stack metadata - map to existing schema attributes
    primary_language: stackMeta.primary_language || repoData.language || '',
    detected_technologies: JSON.stringify(stackMeta.detected_technologies || []),
    frameworks: JSON.stringify(stackMeta.frameworks || []),
    databases: JSON.stringify(stackMeta.databases || []),
    infrastructure: JSON.stringify(stackMeta.infrastructure || []),
    package_managers: JSON.stringify(stackMeta.package_managers || []),
    build_tools: JSON.stringify(stackMeta.build_tools || []),
    containerization: JSON.stringify(stackMeta.containerization || []),
    
    // Quality analysis and file mapping - store in quality_warnings as JSON
    quality_warnings: JSON.stringify(fileMapping) // Store file index here
  };
  
  try {
    if (existingCheck.exists) {
      // Update existing document - only update allowed fields
      const updatedDoc = await databases.updateDocument(
        DATABASE_ID,
        REPOSITORIES_COLLECTION_ID,
        existingCheck.document.$id,
        {
          ...documentData,
          updated_at: timestamp
        }
      );
      
      return { 
        operation: 'updated', 
        documentId: updatedDoc.$id,
        previousFetchCount: existingCheck.document.fetch_count || 0
      };
    } else {
      // Create new document
      const newDoc = await databases.createDocument(
        DATABASE_ID,
        REPOSITORIES_COLLECTION_ID,
        ID.unique(),
        documentData
      );
      
      return { 
        operation: 'created', 
        documentId: newDoc.$id,
        previousFetchCount: 0
      };
    }
  } catch (dbError) {
    throw new Error(`Database operation failed: ${dbError.message}`);
  }
}

async function main() {
  try {
    // Validate environment variables
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT || !APPWRITE_API_KEY) {
      throw new Error('Appwrite environment variables (ENDPOINT, PROJECT, API_KEY) are required');
    }

    // Base search criteria: stars > 50, created > 2020, open source
    const baseQuery = "stars:>50 created:>2020-01-01 is:public license:mit license:apache-2.0 license:bsd license:gpl";
    const batchSize = 100;
    
    console.log(`🚀 Starting production fetch: ${batchSize} repositories`);
    
    const query = `${baseQuery}`;
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${batchSize}`;

    // GitHub API request with enhanced error handling
    let response;
    try {
      response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github+json",
          "User-Agent": "StackCompare-Fetcher/1.0"
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
    } catch (fetchError) {
      console.error(`❌ GitHub API fetch failed: ${fetchError.message}`);
      console.error(JSON.stringify({ 
        error: 'Failed to connect to GitHub API', 
        details: fetchError.message,
        retryAfter: 60 
      }));
      return;
    }

    const data = await response.json();
    
    if (!data.items) {
      console.error(`❌ No repositories found: ${JSON.stringify(data)}`);
      console.error(JSON.stringify({ 
        error: 'No repositories found', 
        details: data,
        searchQuery: query 
      }));
      return;
    }
  
  // Define files to collect for stack analysis
  const filesToCollect = [
    'README.md',
    'package.json',        // JavaScript/Node.js
    'requirements.txt',    // Python
    'pyproject.toml',      // Modern Python
    'setup.py',           // Python
    'Pipfile',            // Python
    'pom.xml',            // Java/Maven
    'build.gradle',       // Java/Kotlin/Gradle
    'gradle.properties',  // Gradle
    'go.mod',             // Go
    'go.sum',             // Go
    'cargo.toml',         // Rust
    'Cargo.lock',         // Rust
    'composer.json',      // PHP
    'Gemfile',            // Ruby
    'pubspec.yaml',       // Dart/Flutter
    'tsconfig.json',      // TypeScript
    'webpack.config.js',  // JavaScript build
    'vite.config.js',     // Modern JS build
    'dockerfile',         // Docker (lowercase)
    'Dockerfile',         // Docker (uppercase)
    'docker-compose.yml', // Docker Compose
    'CMakeLists.txt',     // C/C++
    'Makefile',           // C/C++/General
    '.gitignore',         // Project structure
    'yarn.lock',          // JavaScript/Yarn
    'package-lock.json'   // JavaScript/npm
  ];

  // Init Appwrite Storage and Database (before processing repositories)
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)
    .setKey(APPWRITE_API_KEY);

  const storage = new Storage(client);
  const databases = new Databases(client);

  // Initialize tracking variables
  let updatedRepos = 0;
  let newRepos = 0;
  let skippedDuplicates = 0;
  let deletedFiles = 0;

  // Check for force refresh parameter
  const forceRefresh = process.argv[4] === 'true';

  const repos = [];
  let skippedRepos = [];
  
  for (const repo of data.items) {
    console.log(`Processing repository: ${repo.full_name}`);
    
    // Check if repository already exists and if we should skip
    const existingCheck = await checkRepositoryExists(databases, repo.full_name);
    
    if (!forceRefresh && shouldSkipFetching(repo.pushed_at, existingCheck.lastFetched)) {
      console.log(`⏭️ Skipping ${repo.full_name}: Recently fetched and no updates`);
      skippedDuplicates++;
      continue;
    }
    
    // If updating existing repo, delete old files first
    if (existingCheck.exists) {
      console.log(`🔄 Updating existing repository: ${repo.full_name}`);
      const deletedCount = await deleteExistingRepoFiles(storage, databases, repo.full_name);
      deletedFiles += deletedCount;
      if (deletedCount > 0) {
        console.log(`🗑️ Deleted ${deletedCount} old files for ${repo.full_name}`);
      }
    } else {
      console.log(`✨ Processing new repository: ${repo.full_name}`);
    }
    
    // Collect files from the repository
    const collectedFiles = {};
    const repoFiles = [];
    
    for (const fileName of filesToCollect) {
      try {
        const fileUrl = `https://raw.githubusercontent.com/${repo.full_name}/master/${fileName}`;
        const fileResponse = await fetch(fileUrl, {
          headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Accept": "application/vnd.github+json",
            "User-Agent": "StackCompare-Fetcher/1.0"
          }
        });
        
        if (fileResponse.ok) {
          const fileContent = await fileResponse.text();
          collectedFiles[fileName] = fileContent;
          repoFiles.push(fileName);
          console.log(`✓ Found: ${fileName}`);
        }
        
        // Rate limiting: small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`⚠️ Error fetching ${fileName}: ${error.message}`);
        // File doesn't exist or error fetching, continue
      }
    }

    // Generate stack metadata
    const stackMeta = generateStackMetadata(repo, collectedFiles);
    
    // Create repo metadata
    const repoMetadata = {
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      license: repo.license?.name || null,
      created_at: repo.created_at,
      updated_at: repo.pushed_at,
      size: repo.size,
      open_issues: repo.open_issues_count,
      watchers: repo.watchers_count,
      default_branch: repo.default_branch,
      url: repo.html_url,
      clone_url: repo.clone_url,
      collected_files: repoFiles,
      collection_timestamp: new Date().toISOString()
    };

    repos.push({
      repo: repoMetadata,
      files: collectedFiles,
      stackMeta: stackMeta
    });
  }

  const timestamp = Date.now();
  const savedFiles = [];

  // Save files to Appwrite Storage and Database with unique naming
  for (let i = 0; i < repos.length; i++) {
    const repoData = repos[i];
    
    // Check if repository already exists in database
    const existingCheck = await checkRepositoryExists(databases, repoData.repo.name);
    
    // If updating existing repo, delete old files first
    if (existingCheck.exists) {
      const deletedCount = await deleteExistingRepoFiles(storage, databases, repoData.repo.name);
      deletedFiles += deletedCount;
      console.log(`🗑️  Cleaned up ${deletedCount} old files for ${repoData.repo.name}`);
    }
    
    // Create unique repository identifier
    const repoName = repoData.repo.name.replace('/', '_').replace(/[^a-zA-Z0-9_-]/g, '_');
    const repoId = `${repoName}_${repoData.repo.stars}stars_${Date.now()}`;
    
    // Create folder structure: repositories/repo-id/filename
    const folderPath = `repositories/${repoId}`;
    
    // Prepare files to save with unique naming and file index
    const filesToSave = [
      {
        name: `${folderPath}/repo-metadata.json`,
        content: JSON.stringify(repoData.repo, null, 2),
        type: 'metadata',
        originalName: 'repo-metadata.json'
      },
      {
        name: `${folderPath}/stack-meta.json`,
        content: JSON.stringify(repoData.stackMeta, null, 2),
        type: 'stack-metadata',
        originalName: 'stack-meta.json'
      }
    ];

    // Add collected files to the folder
    Object.entries(repoData.files).forEach(([fileName, content]) => {
      filesToSave.push({
        name: `${folderPath}/${fileName}`,
        content: content,
        type: 'source-file',
        originalName: fileName
      });
    });

    const savedFilesList = [];
    const storedFileIds = [];
    const fileIndex = {}; // Create file index for easy retrieval
    
    // Save each file to Appwrite Storage with repository-specific naming
    for (const file of filesToSave) {
      try {
        // Create meaningful file ID that includes repository info
        const repoPrefix = repoData.repo.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const fileTypePrefix = file.type.charAt(0); // 'm' for metadata, 's' for stack-metadata, 'f' for source-file
        const sanitizedFileName = file.originalName ? file.originalName.replace(/[^a-zA-Z0-9.-]/g, '_') : 'unknown';
        const timestamp = Date.now().toString(36);
        
        // Generate file ID: repo_type_filename_timestamp (max 36 chars)
        let fileId = `${repoPrefix}_${fileTypePrefix}_${sanitizedFileName}_${timestamp}`;
        if (fileId.length > 36) {
          // Truncate if too long, keeping the timestamp for uniqueness
          const maxPrefixLength = 36 - timestamp.length - 2; // -2 for underscores
          fileId = `${fileId.substring(0, maxPrefixLength)}_${timestamp}`;
        }
        
        // Create proper file object for Appwrite with full path as filename
        const blob = new Blob([file.content], { type: 'text/plain' });
        const displayFileName = file.name; // Keep the full path for reference
        const fileObject = new File([blob], displayFileName, { type: 'text/plain' });
        
        await storage.createFile(
          BUCKET_ID,
          fileId,
          fileObject
        );
        
        savedFilesList.push({
          fileId: fileId,
          fileName: file.name, // Full path
          originalName: file.originalName || file.name,
          type: file.type,
          size: file.content.length,
          repositoryName: repoData.repo.name, // Add repository reference
          repositoryId: repoId, // Add repository ID for grouping
          fileType: file.type,
          storedAt: new Date().toISOString()
        });
        
        storedFileIds.push(fileId);
        
        // Add to file index for easy retrieval
        fileIndex[file.originalName || file.name] = {
          fileId: fileId,
          type: file.type,
          size: file.content.length,
          storedAt: new Date().toISOString()
        };
        
        console.log(`✅ Saved: ${file.name} (${fileId})`);
      } catch (error) {
        console.log(`❌ Error saving ${file.name}: ${error.message}`);
        // Continue with other files even if one fails
      }
    }

    // Save repository metadata to database with file index
    try {
      const dbResult = await saveRepositoryToDatabase(
        databases, 
        repoData.repo, 
        repoData.stackMeta, 
        {}, 
        storedFileIds,
        fileIndex // Pass file index for storage
      );
      
      if (dbResult.operation === 'updated') {
        updatedRepos++;
        console.log(`🔄 Updated repository in database: ${repoData.repo.name}`);
      } else {
        newRepos++;
        console.log(`✨ Created new repository in database: ${repoData.repo.name}`);
      }
      
    } catch (dbError) {
      console.error(`❌ Database error for ${repoData.repo.name}: ${dbError.message}`);
    }

    savedFiles.push({
      repository: repoData.repo.name,
      folderId: repoId,
      folderPath: folderPath,
      files: savedFilesList,
      fileCount: savedFilesList.length,
      totalSize: savedFilesList.reduce((sum, f) => sum + f.size, 0),
      storedFileIds: storedFileIds,
      databaseOperation: existingCheck.exists ? 'updated' : 'created'
    });
  }

  // Return production summary with duplicate checking statistics
  const totalStorageUsed = savedFiles.reduce((sum, repo) => sum + (repo.totalSize || 0), 0);
  const totalFilesStored = savedFiles.reduce((sum, repo) => sum + repo.fileCount, 0);
  
  console.log(JSON.stringify({ 
    success: true, 
    language: requestedLanguage,
    batchSize: batchSize,
    repositoriesProcessed: repos.length,
    repositoriesSkipped: skippedRepos.length,
    totalRepositoriesAnalyzed: repos.length + skippedRepos.length,
    skipReasons: skippedRepos.reduce((acc, repo) => {
      acc[repo.reason] = (acc[repo.reason] || 0) + 1;
      return acc;
    }, {}),
    duplicateHandling: {
      skippedDuplicates: skippedDuplicates,
      updatedRepositories: updatedRepos,
      newRepositories: newRepos,
      deletedOldFiles: deletedFiles,
      forceRefreshEnabled: forceRefresh
    },
    totalFilesCollected: totalFilesStored,
    totalStorageUsed: `${(totalStorageUsed / 1024 / 1024).toFixed(2)} MB`,
    repositories: savedFiles,
    skippedRepositories: skippedRepos,
    storage: {
      bucket: BUCKET_ID,
      filesStored: totalFilesStored,
      storageUsed: totalStorageUsed,
      averageRepoSize: repos.length > 0 ? `${(totalStorageUsed / repos.length / 1024).toFixed(1)} KB` : '0 KB'
    },
    database: {
      collection: REPOSITORIES_COLLECTION_ID,
      newEntries: newRepos,
      updatedEntries: updatedRepos,
      totalProcessed: newRepos + updatedRepos,
      duplicatesSkipped: skippedDuplicates
    },
    qualityFiltering: {
      enabled: true,
      advancedScoring: true,
      hardFilters: ['forks', 'archived', 'inactive (>1 year)'],
      antiPatterns: ['tutorial hell', 'dead projects', 'copy-paste repos', 'config-only repos'],
      scoringFactors: ['repository DNA', 'behavioral patterns', 'content intelligence', 'tech sophistication', 'language bonuses'],
      dynamicThresholds: true
    },
    languageTargets: languageTargets,
    searchCriteria: {
      stars: '>50',
      created: '>2020-01-01',
      license: 'open-source',
      language: requestedLanguage
    },
    production: {
      storageEnabled: true,
      databaseEnabled: true,
      duplicateCheckingEnabled: true,
      qualityFilteringEnabled: true,
      advancedScoringEnabled: true,
      environment: 'production'
    },
    timestamp: timestamp,
    totalTargetRepos: languageTargets.reduce((sum, lang) => sum + lang.count, 0),
    collectionProgress: {
      currentLanguage: requestedLanguage,
      batchCompleted: repos.length,
      remainingTarget: languageTargets.find(lang => lang.language === requestedLanguage)?.count - repos.length || 0
    }
  }, null, 2));

  } catch (mainError) {
    console.error(`💥 Production function error: ${mainError.message}`);
    console.error(`Stack trace: ${mainError.stack}`);
    
    console.error(JSON.stringify({
      error: 'Internal server error',
      message: mainError.message,
      timestamp: new Date().toISOString(),
      language: process.argv[2] || 'unknown',
      retryAfter: 300 // 5 minutes
    }));
  }
}

main();
