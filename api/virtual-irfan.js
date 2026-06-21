import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

// Vercel automatically reads process.env.GROQ_API_KEY from your project settings
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatHistory } = req.body;

    // Safely read the JSON file in the Vercel cloud environment
    const dataPath = path.join(process.cwd(), 'api', 'irfan_data.json');
    const irfanProfile = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

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
      model: "llama-3.3-70b-versatile", 
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory, 
        { role: "user", content: message }
      ],
      temperature: 0.6,
      max_tokens: 300
    });

    // Send the response back to the frontend
    res.status(200).json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.error("AI Twin System Error:", error);
    res.status(500).json({ error: "Failed to fetch response from AI clone." });
  }
}