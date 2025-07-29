require('dotenv').config();
const TechFrameworkDB = require('../src/index');

async function testSearch() {
  const db = new TechFrameworkDB();
  await db.initialize();

  console.log('🔍 Testing search functionality...\n');

  // Test 1: Semantic search
  console.log('Test 1: Semantic search for "fast web framework"');
  const results1 = await db.searchFrameworks('fast web framework');
  console.log('Results:', results1.slice(0, 3).map(r => ({
    name: r.name,
    category: r.category,
    similarity: r.similarity
  })));

  // Test 2: Category filter
  console.log('\nTest 2: Frontend frameworks only');
  const results2 = await db.searchFrameworks('javascript', { category: 'frontend' });
  console.log('Results:', results2.slice(0, 3).map(r => ({
    name: r.name,
    category: r.category
  })));

  // Test 3: Score filter
  console.log('\nTest 3: High-scoring frameworks (>80)');
  const results3 = await db.searchFrameworks('popular framework', { minScore: 80 });
  console.log('Results:', results3.slice(0, 3).map(r => ({
    name: r.name,
    overallScore: r.overallScore
  })));

  // Test 4: Realtime support
  console.log('\nTest 4: Frameworks with realtime support');
  const results4 = await db.searchFrameworks('', { realtimeSupport: true });
  console.log('Results:', results4.slice(0, 3).map(r => ({
    name: r.name,
    realtimeSupport: r.realtimeSupport
  })));

  console.log('\n✅ All tests completed!');
}

testSearch().catch(console.error);