import fetch from 'node-fetch';
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



// 🧠 CREATIVE ADVANCED FILTERING SYSTEM

// 1. Repository DNA Analysis - Analyze file patterns to detect repo "personality"
function analyzeRepositoryDNA(repo, files) {
  const dna = {
    codeToDocsRatio: 0,
    complexityScore: 0,
    maturityIndicators: 0,
    communitySignals: 0,
    maintenanceHealth: 0
  };

  const fileTypes = {
    code: 0,
    docs: 0,
    config: 0,
    tests: 0,
    assets: 0,
    generated: 0
  };

  // Categorize files by type and purpose
  Object.keys(files).forEach(filename => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const path = filename.toLowerCase();
    
    // Code files
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'go', 'rs', 'cpp', 'c', 'kt', 'php', 'rb'].includes(ext)) {
      fileTypes.code++;
    }
    // Documentation
    else if (['md', 'rst', 'txt', 'pdf'].includes(ext) || path.includes('doc')) {
      fileTypes.docs++;
    }
    // Configuration
    else if (['json', 'yml', 'yaml', 'toml', 'ini', 'cfg'].includes(ext) || path.includes('config')) {
      fileTypes.config++;
    }
    // Tests
    else if (path.includes('test') || path.includes('spec') || path.includes('__test__')) {
      fileTypes.tests++;
    }
    // Generated/build files
    else if (['lock', 'cache', 'log', 'tmp'].some(gen => path.includes(gen)) || 
             ['node_modules', 'build', 'dist', 'target'].some(dir => path.includes(dir))) {
      fileTypes.generated++;
    }
    // Assets
    else if (['png', 'jpg', 'gif', 'svg', 'ico', 'mp4', 'pdf'].includes(ext)) {
      fileTypes.assets++;
    }
  });

  // Calculate DNA scores
  const totalFiles = Object.values(fileTypes).reduce((a, b) => a + b, 0);
  if (totalFiles > 0) {
    dna.codeToDocsRatio = fileTypes.code / Math.max(fileTypes.docs, 1);
    dna.complexityScore = (fileTypes.code + fileTypes.tests) / totalFiles;
    dna.maturityIndicators = (fileTypes.tests + fileTypes.config) / totalFiles;
  }

  return { dna, fileTypes };
}

// 2. Behavioral Pattern Detection - Analyze commit patterns and activity
function analyzeBehavioralPatterns(repo) {
  const patterns = {
    isActiveProject: false,
    isMaintained: false,
    hasGrowthPotential: false,
    communityEngagement: 0
  };

  const now = new Date();
  const lastUpdate = new Date(repo.pushed_at);
  const created = new Date(repo.created_at);
  const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
  const projectAge = (now - created) / (1000 * 60 * 60 * 24);

  // Active project indicators
  patterns.isActiveProject = daysSinceUpdate < 30; // Updated in last month
  patterns.isMaintained = daysSinceUpdate < 90;    // Updated in last 3 months

  // Growth potential (young projects with good metrics)
  if (projectAge < 365 && repo.stargazers_count > 10) {
    patterns.hasGrowthPotential = true;
  }

  // Community engagement score
  const engagementScore = (
    (repo.stargazers_count * 1) +
    (repo.forks_count * 2) +
    (repo.watchers_count * 1.5) +
    (repo.open_issues_count * 0.5)
  ) / Math.max(projectAge / 30, 1); // Normalize by months

  patterns.communityEngagement = engagementScore;

  return patterns;
}

// 3. Content Intelligence - Advanced README and description analysis
function analyzeContentIntelligence(repo, files) {
  const intelligence = {
    readmeQuality: 0,
    professionalityScore: 0,
    technicalDepth: 0,
    usabilityIndicators: 0
  };

  const readme = files['README.md'] || '';
  const description = repo.description || '';
  
  // README Quality Analysis
  const readmeLength = readme.length;
  const readmeSections = [
    'installation', 'usage', 'api', 'example', 'documentation', 
    'contributing', 'license', 'changelog', 'features', 'getting started'
  ].filter(section => readme.toLowerCase().includes(section)).length;

  intelligence.readmeQuality = Math.min(100, (readmeLength / 100) + (readmeSections * 10));

  // Professionality indicators
  const professionalKeywords = [
    'enterprise', 'production', 'scalable', 'robust', 'secure',
    'api', 'framework', 'library', 'service', 'platform',
    'microservice', 'architecture', 'performance', 'monitoring'
  ];
  
  const amateurKeywords = [
    'my first', 'learning', 'practice', 'beginner', 'tutorial',
    'homework', 'assignment', 'test', 'try', 'experiment'
  ];

  const professionalCount = professionalKeywords.filter(kw => 
    description.toLowerCase().includes(kw) || readme.toLowerCase().includes(kw)
  ).length;

  const amateurCount = amateurKeywords.filter(kw => 
    description.toLowerCase().includes(kw) || readme.toLowerCase().includes(kw)
  ).length;

  intelligence.professionalityScore = Math.max(0, professionalCount * 10 - amateurCount * 15);

  // Technical depth indicators
  const technicalKeywords = [
    'algorithm', 'optimization', 'performance', 'benchmark', 'analysis',
    'machine learning', 'ai', 'neural network', 'deep learning',
    'blockchain', 'cryptography', 'distributed', 'concurrent',
    'real-time', 'streaming', 'database', 'cache', 'queue'
  ];

  intelligence.technicalDepth = technicalKeywords.filter(kw => 
    description.toLowerCase().includes(kw) || readme.toLowerCase().includes(kw)
  ).length * 5;

  // Usability indicators
  const usabilityKeywords = [
    'easy to use', 'simple', 'quick start', 'plug and play',
    'one-click', 'minimal setup', 'getting started', 'examples'
  ];

  intelligence.usabilityIndicators = usabilityKeywords.filter(kw => 
    readme.toLowerCase().includes(kw)
  ).length * 5;

  return intelligence;
}

// 4. Technology Stack Sophistication Analysis
function analyzeTechStackSophistication(repo, files) {
  const sophistication = {
    modernityScore: 0,
    architectureComplexity: 0,
    devOpsMaturity: 0,
    securityAwareness: 0
  };

  // Modern technology indicators
  const modernTech = {
    'package.json': (content) => {
      try {
        const pkg = JSON.parse(content);
        const deps = {...pkg.dependencies, ...pkg.devDependencies};
        return Object.keys(deps).filter(dep => 
          ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'vite', 'webpack'].includes(dep)
        ).length;
      } catch { return 0; }
    },
    'requirements.txt': (content) => {
      return content.toLowerCase().split('\n').filter(line => 
        ['fastapi', 'pydantic', 'sqlalchemy', 'celery', 'redis', 'kubernetes'].some(tech => 
          line.includes(tech)
        )
      ).length;
    },
    'go.mod': () => 1, // Go is inherently modern
    'cargo.toml': () => 1, // Rust is inherently modern
  };

  // Calculate modernity score
  Object.entries(modernTech).forEach(([file, analyzer]) => {
    if (files[file]) {
      sophistication.modernityScore += analyzer(files[file]);
    }
  });

  // Architecture complexity indicators
  const archFiles = [
    'docker-compose.yml', 'kubernetes/', 'terraform/', 'ansible/',
    'microservices/', 'services/', 'modules/', 'components/'
  ];
  sophistication.architectureComplexity = archFiles.filter(pattern => 
    Object.keys(files).some(file => file.includes(pattern))
  ).length;

  // DevOps maturity
  const devopsFiles = [
    '.github/workflows/', '.gitlab-ci.yml', '.travis.yml', 'jenkins',
    'dockerfile', 'docker-compose', 'makefile', 'gulpfile', 'webpack'
  ];
  sophistication.devOpsMaturity = devopsFiles.filter(pattern => 
    Object.keys(files).some(file => file.toLowerCase().includes(pattern))
  ).length;

  // Security awareness
  const securityFiles = [
    'security.md', '.github/security', 'dependabot', 'snyk',
    'codeql', 'security-policy', 'vulnerability'
  ];
  sophistication.securityAwareness = securityFiles.filter(pattern => 
    Object.keys(files).some(file => file.toLowerCase().includes(pattern))
  ).length;

  return sophistication;
}

// 5. Advanced Anti-Pattern Detection with ML-like Scoring
function detectAdvancedAntiPatterns(repo, files, dna, intelligence, fileTypes) {
  const antiPatterns = [];
  let totalPenalty = 0;

  // Pattern 1: Tutorial Hell Detection
  const tutorialSignals = [
    dna.codeToDocsRatio < 0.3,  // Too much docs, too little code
    intelligence.professionalityScore < 0,  // Amateur language
    repo.description?.toLowerCase().includes('tutorial'),
    repo.name.toLowerCase().includes('tutorial'),
    Object.keys(files).length < 5  // Too few files
  ];
  
  const tutorialScore = tutorialSignals.filter(Boolean).length;
  if (tutorialScore >= 3) {
    antiPatterns.push('Tutorial Hell: Multiple tutorial indicators detected');
    totalPenalty += 60;
  }

  // Pattern 2: Dead Project Necromancy
  const lastUpdate = new Date(repo.pushed_at);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const deadSignals = [
    lastUpdate < sixMonthsAgo,
    repo.open_issues_count > repo.stargazers_count,  // More issues than stars
    repo.forks_count < repo.stargazers_count * 0.05,  // Very low fork ratio
    intelligence.readmeQuality < 20  // Poor documentation
  ];
  
  const deadScore = deadSignals.filter(Boolean).length;
  if (deadScore >= 3) {
    antiPatterns.push('Dead Project: Multiple abandonment indicators');
    totalPenalty += 50;
  }

  // Pattern 3: Copy-Paste Paradise
  const copyPasteSignals = [
    repo.description?.toLowerCase().includes('clone'),
    repo.description?.toLowerCase().includes('copy'),
    repo.name.toLowerCase().includes('clone'),
    dna.complexityScore < 0.2,  // Very low code complexity
    repo.stargazers_count < 5 && repo.forks_count > repo.stargazers_count
  ];
  
  const copyPasteScore = copyPasteSignals.filter(Boolean).length;
  if (copyPasteScore >= 3) {
    antiPatterns.push('Copy-Paste Paradise: Likely derivative work');
    totalPenalty += 40;
  }

  // Pattern 4: Configuration Carnival
  const configSignals = [
    fileTypes.config > fileTypes.code,
    Object.keys(files).every(f => 
      f.endsWith('.json') || f.endsWith('.yml') || f.endsWith('.yaml') || 
      f.endsWith('.md') || f.includes('config')
    ),
    intelligence.technicalDepth < 5
  ];
  
  const configScore = configSignals.filter(Boolean).length;
  if (configScore >= 2) {
    antiPatterns.push('Configuration Carnival: Config-heavy, code-light');
    totalPenalty += 35;
  }

  return { antiPatterns, totalPenalty };
}

// 6. Quality Score Calculation with Weighted Factors
function calculateAdvancedQualityScore(repo, files, dna, patterns, intelligence, sophistication) {
  let score = 0;
  const factors = [];

  // Base repository metrics (25% weight)
  const starScore = Math.min(50, Math.log10(repo.stargazers_count + 1) * 10);
  score += starScore;
  factors.push(`Stars: +${starScore.toFixed(1)}`);

  // DNA Analysis (20% weight)
  const dnaScore = (dna.codeToDocsRatio * 10) + (dna.complexityScore * 20) + (dna.maturityIndicators * 15);
  score += dnaScore;
  factors.push(`DNA: +${dnaScore.toFixed(1)}`);

  // Behavioral Patterns (15% weight)
  let behaviorScore = 0;
  if (patterns.isActiveProject) behaviorScore += 20;
  if (patterns.isMaintained) behaviorScore += 10;
  if (patterns.hasGrowthPotential) behaviorScore += 15;
  behaviorScore += Math.min(25, patterns.communityEngagement / 10);
  score += behaviorScore;
  factors.push(`Behavior: +${behaviorScore.toFixed(1)}`);

  // Content Intelligence (20% weight)
  const contentScore = (intelligence.readmeQuality * 0.3) + 
                      (intelligence.professionalityScore * 0.4) + 
                      (intelligence.technicalDepth * 0.2) + 
                      (intelligence.usabilityIndicators * 0.1);
  score += contentScore;
  factors.push(`Content: +${contentScore.toFixed(1)}`);

  // Technology Sophistication (10% weight)
  const techScore = (sophistication.modernityScore * 5) + 
                   (sophistication.architectureComplexity * 3) + 
                   (sophistication.devOpsMaturity * 2) + 
                   (sophistication.securityAwareness * 4);
  score += techScore;
  factors.push(`Tech: +${techScore.toFixed(1)}`);

  // Language-specific adjustments (10% weight)
  const language = repo.language?.toLowerCase();
  let languageBonus = 0;
  
  // Bonus for production-ready languages in enterprise contexts
  if (['java', 'go', 'rust', 'typescript'].includes(language)) {
    languageBonus += 10;
  }
  // Bonus for modern web technologies
  if (['typescript', 'dart', 'kotlin'].includes(language)) {
    languageBonus += 5;
  }
  
  score += languageBonus;
  if (languageBonus > 0) factors.push(`Language: +${languageBonus}`);

  return { score: Math.round(score), factors };
}

// 7. Dynamic Threshold with Context Awareness
function getDynamicQualityThreshold(repo, dna, intelligence) {
  let threshold = 60; // Base threshold

  // Adjust for repository age and popularity
  const age = (new Date() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24 * 365);
  if (age < 1) threshold -= 10; // Newer projects get some leeway
  if (repo.stargazers_count > 1000) threshold += 15; // Popular projects held to higher standards

  // Adjust for language ecosystem maturity
  const language = repo.language?.toLowerCase();
  const matureLanguages = ['java', 'python', 'javascript', 'c++', 'php'];
  const emergingLanguages = ['rust', 'go', 'kotlin', 'dart'];
  
  if (matureLanguages.includes(language)) threshold += 5;
  if (emergingLanguages.includes(language)) threshold -= 10;

  // Adjust for repository type indicators
  if (intelligence.technicalDepth > 15) threshold -= 5; // Technical projects get leeway
  if (dna.maturityIndicators > 0.5) threshold -= 5; // Mature projects get recognition

  return threshold;
}

// MAIN ENHANCED QUALITY ANALYSIS FUNCTION
// MAIN ENHANCED QUALITY ANALYSIS FUNCTION
function analyzeRepositoryQuality(repo, files) {
  const analysis = {
    score: 0,
    threshold: 0,
    warnings: [],
    positiveIndicators: [],
    shouldSkip: false,
    skipReason: null,
    detailedAnalysis: {}
  };

  // Hard filters first
  if (repo.fork) {
    analysis.shouldSkip = true;
    analysis.skipReason = 'Fork repository';
    return analysis;
  }

  if (repo.archived) {
    analysis.shouldSkip = true;
    analysis.skipReason = 'Archived repository';
    return analysis;
  }

  const lastUpdate = new Date(repo.pushed_at);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  if (lastUpdate < oneYearAgo) {
    analysis.shouldSkip = true;
    analysis.skipReason = 'Inactive repository (>1 year)';
    return analysis;
  }

  // Run advanced analysis
  const { dna, fileTypes } = analyzeRepositoryDNA(repo, files);
  const patterns = analyzeBehavioralPatterns(repo);
  const intelligence = analyzeContentIntelligence(repo, files);
  const sophistication = analyzeTechStackSophistication(repo, files);
  
  // Detect anti-patterns
  const { antiPatterns, totalPenalty } = detectAdvancedAntiPatterns(repo, files, dna, intelligence, fileTypes);
  
  // Calculate quality score
  const { score, factors } = calculateAdvancedQualityScore(repo, files, dna, patterns, intelligence, sophistication);
  
  // Apply penalties
  const finalScore = score - totalPenalty;
  
  // Get dynamic threshold
  const threshold = getDynamicQualityThreshold(repo, dna, intelligence);
  
  // Store detailed analysis
  analysis.detailedAnalysis = {
    dna,
    fileTypes,
    patterns,
    intelligence,
    sophistication,
    scoringFactors: factors,
    antiPatterns,
    totalPenalty
  };

  analysis.score = finalScore;
  analysis.threshold = threshold;
  analysis.warnings = antiPatterns;
  analysis.positiveIndicators = factors;

  // Final decision
  if (finalScore < threshold) {
    analysis.shouldSkip = true;
    analysis.skipReason = `Quality score ${finalScore} below threshold ${threshold}`;
  }

  return analysis;
}

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
    warnings: qualityAnalysis.warnings || [],
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
    quality_score: qualityAnalysis.score || 0,
    quality_threshold: qualityAnalysis.threshold || 60,
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

export default async ({ req, res, log, error }) => {
  try {
    // Validate environment variables
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT || !APPWRITE_API_KEY) {
      throw new Error('Appwrite environment variables (ENDPOINT, PROJECT, API_KEY) are required');
    }

    // Language-based repo distribution for diverse collection
    const languageTargets = [
      { language: 'JavaScript', count: 500 },
      { language: 'Python', count: 500 },
      { language: 'Java', count: 300 },
      { language: 'TypeScript', count: 300 },
      { language: 'Go', count: 200 },
      { language: 'Rust', count: 150 },
      { language: 'C++', count: 150 },
      { language: 'Kotlin', count: 100 },
      { language: 'PHP', count: 100 },
      { language: 'Shell', count: 100 }
    ];

    // Base search criteria: stars > 50, created > 2020, open source
    const baseQuery = "stars:>50 created:>2020-01-01 is:public license:mit license:apache-2.0 license:bsd license:gpl";
    
    // Get language from request parameter or default to first batch
    const requestedLanguage = req.query?.language || req.body?.language || 'JavaScript';
    const batchSize = Math.min(parseInt(req.query?.batch_size || req.body?.batch_size || '10'), 100); // Cap at 100 for rate limiting
    
    // Validate language
    const validLanguages = languageTargets.map(lang => lang.language);
    if (!validLanguages.includes(requestedLanguage)) {
      return res.json({ 
        error: 'Invalid language requested', 
        validLanguages: validLanguages,
        requested: requestedLanguage 
      });
    }
    
    log(`🚀 Starting production fetch: ${batchSize} ${requestedLanguage} repositories`);
    
    const query = `${baseQuery} language:${requestedLanguage}`;
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
      log(`❌ GitHub API fetch failed: ${fetchError.message}`);
      return res.json({ 
        error: 'Failed to connect to GitHub API', 
        details: fetchError.message,
        retryAfter: 60 
      });
    }

    const data = await response.json();
    
    if (!data.items) {
      log(`❌ No repositories found: ${JSON.stringify(data)}`);
      return res.json({ 
        error: 'No repositories found', 
        details: data,
        searchQuery: query 
      });
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
  const forceRefresh = req.query?.force_refresh === 'true' || req.body?.force_refresh === true;

  const repos = [];
  let skippedRepos = [];
  
  for (const repo of data.items) {
    log(`Processing repository: ${repo.full_name}`);
    
    // Check if repository already exists and if we should skip
    const existingCheck = await checkRepositoryExists(databases, repo.full_name);
    
    if (!forceRefresh && shouldSkipFetching(repo.pushed_at, existingCheck.lastFetched)) {
      log(`⏭️ Skipping ${repo.full_name}: Recently fetched and no updates`);
      skippedDuplicates++;
      continue;
    }
    
    // If updating existing repo, delete old files first
    if (existingCheck.exists) {
      log(`🔄 Updating existing repository: ${repo.full_name}`);
      const deletedCount = await deleteExistingRepoFiles(storage, databases, repo.full_name);
      deletedFiles += deletedCount;
      if (deletedCount > 0) {
        log(`🗑️ Deleted ${deletedCount} old files for ${repo.full_name}`);
      }
    } else {
      log(`✨ Processing new repository: ${repo.full_name}`);
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
          log(`✓ Found: ${fileName}`);
        }
        
        // Rate limiting: small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        log(`⚠️ Error fetching ${fileName}: ${error.message}`);
        // File doesn't exist or error fetching, continue
      }
    }

    // Analyze repository quality
    const qualityAnalysis = analyzeRepositoryQuality(repo, collectedFiles);
    
    // Skip low-quality repositories
    if (qualityAnalysis.shouldSkip) {
      log(`❌ Skipping ${repo.full_name}: ${qualityAnalysis.skipReason}`);
      skippedRepos.push({
        repository: repo.full_name,
        reason: qualityAnalysis.skipReason,
        score: qualityAnalysis.score,
        warnings: qualityAnalysis.warnings
      });
      continue;
    }
    
    // Log quality analysis for accepted repos
    if (qualityAnalysis.warnings.length > 0) {
      log(`⚠️  ${repo.full_name} warnings: ${qualityAnalysis.warnings.join(', ')}`);
    }
    if (qualityAnalysis.positiveIndicators.length > 0) {
      log(`✅ ${repo.full_name} positives: ${qualityAnalysis.positiveIndicators.join(', ')}`);
    }
    log(`📊 Quality score: ${qualityAnalysis.score}`);

    // Generate stack metadata
    const stackMeta = generateStackMetadata(repo, collectedFiles);
    
    // Add quality analysis to stack metadata
    stackMeta.quality_analysis = qualityAnalysis;
    
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
      log(`🗑️  Cleaned up ${deletedCount} old files for ${repoData.repo.name}`);
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
        
        log(`✅ Saved: ${file.name} (${fileId})`);
      } catch (error) {
        log(`❌ Error saving ${file.name}: ${error.message}`);
        // Continue with other files even if one fails
      }
    }

    // Save repository metadata to database with file index
    try {
      const dbResult = await saveRepositoryToDatabase(
        databases, 
        repoData.repo, 
        repoData.stackMeta, 
        repoData.stackMeta.quality_analysis, 
        storedFileIds,
        fileIndex // Pass file index for storage
      );
      
      if (dbResult.operation === 'updated') {
        updatedRepos++;
        log(`🔄 Updated repository in database: ${repoData.repo.name}`);
      } else {
        newRepos++;
        log(`✨ Created new repository in database: ${repoData.repo.name}`);
      }
      
    } catch (dbError) {
      log(`❌ Database error for ${repoData.repo.name}: ${dbError.message}`);
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
  
  res.send({ 
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
  });

  } catch (mainError) {
    error(`💥 Production function error: ${mainError.message}`);
    log(`Stack trace: ${mainError.stack}`);
    
    return res.json({
      error: 'Internal server error',
      message: mainError.message,
      timestamp: new Date().toISOString(),
      language: req.query?.language || req.body?.language || 'unknown',
      retryAfter: 300 // 5 minutes
    });
  }
};
