import { Client, Account, Databases } from 'appwrite';

// Load Appwrite connection details from environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID;
// const apiKey = process.env.NEXT_PUBLIC_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY; // Not used in web SDK

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project);

// Do NOT use setKey in the web SDK

export const account = new Account(client);
export const databases = new Databases(client);
export const APPWRITE_DATABASE_ID = databaseId;
export const APPWRITE_PROJECT_ID = project;
export const APPWRITE_ENDPOINT = endpoint;
// export const APPWRITE_API_KEY = apiKey; // Not used in web SDK
// See https://appwrite.io/docs/quick-starts/nextjs for usage examples