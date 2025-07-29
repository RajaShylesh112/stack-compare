require('dotenv').config();
const TechFrameworkDB = require('../src/index');

async function healthCheck() {
  const db = new TechFrameworkDB();
  
  try {
    console.log('🔍 Running health check...');
    
    // Test Qdrant connection
    const vectorResults = await db.qdrant.searchSimilarFrameworks('test', 1);
    console.log('✅ Qdrant connection: OK');
    
    // Test Appwrite connection
    const dbResults = await db.appwrite.getFrameworks({});
    console.log('✅ Appwrite connection: OK');
    
    // Test external APIs
    const githubTest = await db.github.getRepositoryData('expressjs', 'express');
    console.log('✅ GitHub API: OK');
    
    console.log('\n📊 System Status:');
    console.log(`- Frameworks in database: ${dbResults.length}`);
    console.log(`- Vector search working: ${vectorResults.length >= 0}`);
    console.log(`- Last check: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();