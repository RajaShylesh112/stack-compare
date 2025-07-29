const { Client, Databases } = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    // Sync logic here
    const frameworks = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
    );
  }