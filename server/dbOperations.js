const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

async function connectToDb() {
    await client.connect();
    return client.db('aiMemory');
}

async function saveConversation(db, userMessage, usermessageTimestamp, aiResponse, aiResponseTimestamp) {
    const dailyConversations = db.collection('dailyConversations');

    const conversation = {
        userMessage,
        usermessageTimestamp,
        aiResponse,
        aiResponseTimestamp
    };

    await dailyConversations.insertOne(conversation);
}

async function getDailyConversationHistory(db) {
    const dailyConversations = db.collection('dailyConversations');

    // Query the database for the conversation history
    // This example retrieves the last 10 conversations
    const conversations = await dailyConversations.find().sort({timestamp: -1}).toArray();

    // Format the conversations for the OpenAI API
    const formattedConversations = conversations.flatMap(conversation => ([
        {
            role: "user",
            content: conversation.userMessage
        },
        {
            role: "assistant",
            content: conversation.aiResponse
        }
    ]));
    return formattedConversations;
}

async function moveConversations(db) {
    const dailyConversations = db.collection('dailyConversations');
    const rawConversations = db.collection('rawConversations');

    // Copy all documents from dailyConversations to rawConversations
    await dailyConversations.aggregate([
        { $match: {} },
        { $merge: "rawConversations" }
    ]).toArray();

    // Delete all documents from dailyConversations
    await dailyConversations.deleteMany({});
}

module.exports = { connectToDb, saveConversation, getDailyConversationHistory, moveConversations };