import { Client, Databases, ID, Permission, Role, RelationshipType } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env' });

// --- Environment Variable Validation ---
const {
    NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    NEXT_PUBLIC_APPWRITE_API_KEY,
    NEXT_PUBLIC_APPWRITE_DATABASE_ID,
} = process.env;

if (!NEXT_PUBLIC_APPWRITE_ENDPOINT || !NEXT_PUBLIC_APPWRITE_PROJECT_ID || !NEXT_PUBLIC_APPWRITE_API_KEY || !NEXT_PUBLIC_APPWRITE_DATABASE_ID) {
    console.error(
        'Missing one or more required environment variables. Please check your .env.local file for: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_DATABASE_ID'
    );
    process.exit(1);
}

// --- Appwrite Client Initialization ---
const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(NEXT_PUBLIC_APPWRITE_API_KEY);

const databases = new Databases(client);

// --- Constants ---
const DB_ID = NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const DB_NAME = 'Tech Advisor DB';
const USER_REQUIREMENTS_COLLECTION_ID = 'user_requirements';
const TECHNOLOGIES_COLLECTION_ID = 'technologies';
const STACK_RECOMMENDATIONS_COLLECTION_ID = 'stack_recommendations';

// --- Helper Functions for Idempotency ---

/**
 * Ensures a database exists, creating it if necessary.
 */
async function ensureDatabase(id: string, name: string) {
    try {
        await databases.get(id);
        console.log(`✔️  Database '${name}' (${id}) already exists.`);
    } catch (error: any) {
        if (error.code === 404) {
            console.log(`- Database '${name}' not found. Creating...`);
            await databases.create(id, name);
            console.log(`✅ Created database '${name}' (${id}).`);
        } else {
            console.error(`❌ Error checking database '${name}':`, error);
            throw error;
        }
    }
}

/**
 * Ensures a collection exists, creating it if necessary.
 */
async function ensureCollection(dbId: string, colId: string, name: string, permissions: string[]) {
    try {
        await databases.getCollection(dbId, colId);
        console.log(`✔️  Collection '${name}' (${colId}) already exists.`);
    } catch (error: any) {
        if (error.code === 404) {
            console.log(`- Collection '${name}' not found. Creating...`);
            await databases.createCollection(dbId, colId, name, permissions);
            console.log(`✅ Created collection '${name}' (${colId}).`);
        } else {
            console.error(`❌ Error checking collection '${name}':`, error);
            throw error;
        }
    }
}

/**
 * Ensures an attribute exists in a collection, handling conflicts gracefully.
 */
async function ensureAttribute(dbId: string, colId: string, attributeCreator: () => Promise<any>) {
    try {
        await attributeCreator();
    } catch (e: any) {
        // 409 = Conflict, which means attribute already exists. We can ignore this.
        if (e.code !== 409) {
            console.error(`❌ Error creating attribute for collection '${colId}':`, e.message);
            // We don't re-throw here to allow the script to continue with other attributes.
        }
    }
}

// --- Main Setup Logic ---
async function main() {
    try {
        console.log('🚀 Starting Appwrite schema setup...');
        await ensureDatabase(DB_ID, DB_NAME);

        // --- 1. User Requirements Collection ---
        console.log("\n--- Setting up 'User Requirements' collection ---");
        await ensureCollection(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'User Requirements', [
            Permission.create(Role.users()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]);

        const urAttributes = [
            () => databases.createEnumAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'projectType', ['web', 'mobile', 'ecommerce', 'dashboard', 'other'], true),
            () => databases.createStringAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'description', 1024, false),
            () => databases.createBooleanAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'needsRealtime', false),
            () => databases.createEnumAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'teamSize', ['solo', 'small', 'medium', 'large'], true),
            () => databases.createEnumAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'budgetLevel', ['low', 'medium', 'high'], true),
            () => databases.createIntegerAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'priorityPerformance', false, 1, 10),
            () => databases.createIntegerAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'priorityScalability', false, 1, 10),
            () => databases.createIntegerAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'priorityCommunity', false, 1, 10),
            () => databases.createStringAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'stackPreference', 100, false),
            () => databases.createDatetimeAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, 'createdAt', true),
        ];
        for (const attr of urAttributes) await ensureAttribute(DB_ID, USER_REQUIREMENTS_COLLECTION_ID, attr);
        console.log("✅ 'User Requirements' collection is set up.");


        // --- 2. Technologies Collection ---
        console.log("\n--- Setting up 'Technologies' collection ---");
        await ensureCollection(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'Technologies', [
            Permission.read(Role.any()),    // Publicly readable
            Permission.create(Role.team('admins')), // Only admins can create
            Permission.update(Role.team('admins')), // Only admins can update
            Permission.delete(Role.team('admins')), // Only admins can delete
        ]);

        const techAttributes = [
            () => databases.createStringAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'name', 100, true),
            () => databases.createEnumAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'category', ['frontend', 'backend', 'database', 'auth', 'infra'], true),
            () => databases.createStringAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'tags', 200, false, undefined, true), // Array of strings
            () => databases.createIntegerAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'performanceScore', false, 1, 10),
            () => databases.createIntegerAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'scalabilityScore', false, 1, 10),
            () => databases.createIntegerAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'communityScore', false, 1, 10),
            () => databases.createBooleanAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'realtimeSupport', false),
            () => databases.createDatetimeAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'createdAt', true),
            () => databases.createStringAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'embedding', 50000, false),
            () => databases.createStringAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, 'embeddingModel', 100, false),
        ];
        for (const attr of techAttributes) await ensureAttribute(DB_ID, TECHNOLOGIES_COLLECTION_ID, attr);
        console.log("✅ 'Technologies' collection is set up.");


        // --- 3. Stack Recommendations Collection ---
        console.log("\n--- Setting up 'Stack Recommendations' collection ---");
        await ensureCollection(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'Stack Recommendations', [
            Permission.create(Role.users()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]);

        const stackAttributes = [
            // Relationship to the user requirement that generated this recommendation
            () => databases.createRelationshipAttribute(
                DB_ID,
                STACK_RECOMMENDATIONS_COLLECTION_ID,
                USER_REQUIREMENTS_COLLECTION_ID,
                RelationshipType.OneToOne, // Correctly use the enum
                false,
                'userRequirement', // key
                'stackRecommendation' // twoWayKey
            ),
            () => databases.createStringAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'techIds', 500, true, undefined, true), // Array of strings
            () => databases.createStringAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'techNames', 500, true, undefined, true), // Array of strings
            () => databases.createFloatAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'overallScore', false, 0, 100),
            () => databases.createStringAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'explanation', 10000, false),
            () => databases.createStringAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'metrics', 2048, false),
            () => databases.createEnumAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'aiModel', ['mistral-7b', 'gpt-4o', 'gpt-3.5'], true),
            () => databases.createDatetimeAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, 'createdAt', true),
        ];
        for (const attr of stackAttributes) await ensureAttribute(DB_ID, STACK_RECOMMENDATIONS_COLLECTION_ID, attr);
        console.log("✅ 'Stack Recommendations' collection is set up.");


        console.log('\n🎉 All schemas set up successfully!');
    } catch (error) {
        console.error('\n❌ An unexpected error occurred during setup:', error);
        process.exit(1);
    }
}

main();
