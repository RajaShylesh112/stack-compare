require('dotenv').config();
const TechFrameworkDB = require('../src/index');
const seedData = require('../data/frameworks-seed.json');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...\n');
  
  const db = new TechFrameworkDB();
  await db.initialize();

  // Process seed data
  const results = await db.bulkProcessFrameworks(seedData);

  console.log('\n📊 Seeding Summary:');
  console.log(`Total frameworks: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);

  // Show sample results
  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    console.log('\n✅ Sample processed frameworks:');
    successful.slice(0, 3).forEach(result => {
      const f = result.framework;
      console.log(`- ${f.name} (${f.category}): Performance=${f.performanceScore}, Community=${f.communityScore}`);
    });
  }

  console.log('\n🎉 Database seeding completed!');
}

seedDatabase().catch(console.error);