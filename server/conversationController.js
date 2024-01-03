const { OpenAI } = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function analyzeMessage(userMessage) {
    // Call the GPT-4 model with the user's message
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'system',
          content: 'You are to analyze the message and determine whether it is related to music, a particular song, or a particular artist. If it is, return "music". Otherwise, return "normal".',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });
  
    // Parse the AI's response
    const aiResponse = completion.choices[0].message.content;
  
    // Determine whether the message is related to music or not
    if (aiResponse.includes('music') || aiResponse.includes('song') || aiResponse.includes('artist')) {
      return 'music';
    } else {
      return 'normal';
    }
  }


async function handleMusicCommand(userMessage) {
    // For now, just return a simple message
    return "You asked about music!";
  }
  
  async function handleNormalCommand(userMessage) {
    // Logic to handle non-music-related commands
  }
  
  
  module.exports = { handleMusicCommand, handleNormalCommand, analyzeMessage };