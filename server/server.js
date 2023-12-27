
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAI } = require('openai');
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const { connectToDb, saveConversation, getDailyConversationHistory, moveConversations } = require('./dbOperations');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const client = new MongoClient(mongoUri);


passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, expires_in, profile, done) {
    // Here, you will save or use the accessToken and the profile information
    done(null, profile);
  }
));


let db;
app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`)
    db = await connectToDb();
});


app.post('/move-conversations', async (req, res) => {
    await moveConversations(db);
    res.sendStatus(200);
});


app.post('/api/chat', async (req, res) => {
  // extract the text that the user sent from the request body

  const userMessage = req.body.message;
  const usermessageTimestamp = new Date().toISOString();

  console.log('User Message:', userMessage);

  try {
    //Retrieve conversation history from the database
    const conversationHistory = await getDailyConversationHistory(db);

    // Prepare the messages array for the OpenAI API
    const messages = conversationHistory;

    console.log('Messages:', messages);
    // Add the current user message to the messages array
    messages.push({ role: "user", content: userMessage });

    // Send the message to OpenAI API
    const completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: messages,
    });
    
    const aiResponse = completion.choices[0].message.content;
    const aiResponseTimestamp = new Date().toISOString();


    await saveConversation(db, userMessage, usermessageTimestamp, aiResponse, aiResponseTimestamp);

    
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

app.get('/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'streaming', 'user-modify-playback-state'], // Define the scopes you need
    showDialog: true
  }),
  function(req, res){
    // The request will be redirected to Spotify for authentication, so this function will not be called.
  });

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('companionai://spotify-callback');
  });
