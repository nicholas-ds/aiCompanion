
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAI } = require('openai');
const express = require('express');
const { connectToDb, saveConversation, getDailyConversationHistory, moveConversations } = require('./dbOperations');
const { handleMusicCommand, handleNormalCommand, analyzeMessage } = require('./conversationController');


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new MongoClient(mongoUri);


let db;
app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`)
    db = await connectToDb();
});


app.post('/move-conversations', async (req, res) => {
    await moveConversations(db);
    res.sendStatus(200);
});


// In server.js
let conversationState = {
  context: 'normal',
  history: [],
};

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  const usermessageTimestamp = new Date().toISOString();

  console.log('User Message:', userMessage);

  try {
    // Update the conversation state
    conversationState.history.push({ role: 'user', content: userMessage });
    const analysis = await analyzeMessage(userMessage);
    if (analysis === 'music') {
      conversationState.context = 'music';
    } else {
      conversationState.context = 'normal';
    }

    // Generate the AI's response
    let aiResponse;
    if (conversationState.context === 'music') {
      aiResponse = await handleMusicCommand(userMessage);
    } else {
      // Retrieve conversation history from the database
      const conversationHistory = await getDailyConversationHistory(db);

      // Prepare the messages array for the OpenAI API
      const messages = conversationHistory;

      // Add the current user message to the messages array
      messages.push({ role: "user", content: userMessage });

      // Send the message to OpenAI API
      const completion = await openai.chat.completions.create({
          model: "gpt-4-1106-preview",
          messages: messages,
      });

      aiResponse = completion.choices[0].message.content;
    }
    conversationState.history.push({ role: 'assistant', content: aiResponse });

    const aiResponseTimestamp = new Date().toISOString();

    await saveConversation(db, userMessage, usermessageTimestamp, aiResponse, aiResponseTimestamp);

    // Send back the completion as the response
    res.json({ 
        reply: aiResponse,
        usermessageTimestamp,
        aiResponseTimestamp
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({error: 'Error'});
  } finally {
    await client.close();
  }
});