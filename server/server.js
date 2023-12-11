
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAI } = require('openai');
const express = require('express');


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new MongoClient(mongoUri);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});



app.post('/api/chat', async (req, res) => {
  // extract the text that the user sent from the request body

  const userMessage = req.body.message;
  const usermessageTimestamp = new Date().toISOString();

  console.log('User Message:', userMessage);

  try {
      // Send the message to OpenAI API
      const completion = await openai.chat.completions.create({
          model: "gpt-4-1106-preview",
           messages: [{ role: "user", content: userMessage }],
      });
      
      const aiResponse = completion.choices[0].message.content;
      const aiResponseTimestamp = new Date().toISOString();

      await client.connect();

      const db = client.db('aiMemory');

      const dailyConversations = db.collection('dailyConversations');

      const conversation = {
          userMessage,
          usermessageTimestamp,
          aiResponse,
          aiResponseTimestamp
      };

      await dailyConversations.insertOne(conversation);

      //Send back the completion as the response
      res.json({ 
          reply: aiResponse,
          usermessageTimestamp,
          aiResponseTimestamp
      });
  } catch (error) {
      console.error('Error connecting to OpenAI:', error.message);
      res.status(500).json({error: 'Error connecting to OpenAI'});
  } finally {
      await client.close();
  }

});