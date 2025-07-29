require('dotenv').config();
const fs = require('fs');
const path = require('path');
const TechFrameworkDB = require('../src/index');

async function backupData() {
  const db = new TechFrameworkDB();
  
  try {
    console.log('📦 Creating backup...');
    
    // Get all frameworks from Appwrite
    const frameworks = await db.appwrite.getFrameworks({});
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      count: frameworks.length,
      data: frameworks
    };
    
    // Save to file
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const filename = `frameworks-backup-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(backupDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup created: ${filepath}`);
    console.log(`📊 Backed up ${frameworks.length} frameworks`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

backupData();