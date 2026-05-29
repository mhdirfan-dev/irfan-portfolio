import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { readFileSync } from 'fs';

dotenv.config();

const app = Express();
app.use(cors());
app.use(Express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Load your personal data file
const irfanProfile = JSON.parse(readFileSync('./irfan_data.json', 'utf-8'));

app.post('/api/virtual-irfan', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    const systemPrompt = `
      You are the "Virtual AI Twin" of Mohammed Irfan A, interacting with visitors on his portfolio website.
      Answer questions concisely, confidently, and naturally as if you are him. Do not sound like a generic assistant.
      
      Here is your official background data:
      ${JSON.stringify(irfanProfile)}

      CRITICAL INSTRUCTIONS FOR LANGUAGE:
      1. Start speaking in English by default.
      2. If the user addresses you or asks a question in Malayalam (using Malayalam script or Manglish/Malayalam written in English text like "enthoke und vishesham" or "nattil evideya"), instantly switch your entire output to natural, conversational Malayalam.
      3. Always respond in the language the user chose to speak to you.
      
      Keep answers relatively brief (2-3 sentences) so they sound natural when read aloud by text-to-speech tools.
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Fast, accurate, outstanding multilingual capabilities
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory, // Pass preceding conversational logs to retain memory context
        { role: "user", content: message }
      ],
      temperature: 0.6,
      max_tokens: 300
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("AI Twin System Error:", error);
    res.status(500).json({ error: "Failed to fetch response from AI clone." });
  }
});

app.listen(5000, () => console.log('Virtual Twin API active on port 5000'));