# Mohammed Irfan A — Interactive AI Portfolio 🚀

A highly interactive, 3D-physics-enabled personal portfolio built with React and Three.js. It features a custom "Virtual AI Twin" (powered by LLaMA 3.3 via Groq) that can hold conversations with visitors in both English and Malayalam.

🌐 **Live Demo:** [irfan.dev](https://irfan-portfolio.vercel.app/) *(Replace with your actual Vercel link)*

## ✨ Key Features
* **Interactive 3D Physics:** A draggable, physics-based ID card lanyard built using `@react-three/fiber` and `@react-three/rapier`.
* **Virtual AI Assistant:** An integrated chatbot powered by Groq (LLaMA 3.3 70B) acting as a digital twin. It uses a local RAG approach to answer questions about my experience, projects, and skills.
* **Multilingual Voice Capabilities:** The bot supports speech-to-text (listening) and text-to-speech (speaking) and automatically switches to Malayalam if spoken to in Manglish/Malayalam.
* **Single-Page Architecture:** Smooth scrolling, dynamic `framer-motion` animations, and glassmorphism UI components.

## 🛠️ Tech Stack
* **Frontend:** React 18, Framer Motion, Lucide React
* **3D Rendering:** Three.js, React Three Fiber, React Three Drei, Rapier Physics
* **AI & Backend:** Groq API (LLaMA 3.3), Vercel Serverless Functions (`/api` routing)
* **Styling:** Inline dynamic styling with injected global CSS variables.

## ⚙️ Running the Project Locally

Because this project uses Vercel Serverless Functions for the AI backend, you need the Vercel CLI to run it locally.

### 1. Install Dependencies
```bash
npm install

2. Environment Variables

Create a .env file in the root directory and add your Groq API key:
Code snippet

GROQ_API_KEY=gsk_your_api_key_here

3. Start the Development Server

Use npx vercel dev to start both the React frontend and the Serverless API simultaneously:
Bash

npx vercel dev

The app will be available at http://localhost:3000.
📂 Project Structure
Plaintext

irfan-portfolio/
 ├── api/
 │    ├── virtual-irfan.js   # Serverless function for the AI bot
 │    └── irfan_data.json    # Knowledge base for the AI twin
 ├── public/                 # Static assets and project screenshots
 ├── src/
 │    ├── App.jsx            # The core Single-Page Application
 │    └── index.js           # React entry point
 ├── .env                    # Local API keys (Gitignored)
 └── package.json

📬 Contact

    Email: mohammedirfan.a02@gmail.com

    LinkedIn: linkedin.com/in/mohammed-irfan-a-7ba342368


### Step 5: Push the Cleaned Project to GitHub
Once you have deleted the extra files, updated `index.js`, and saved the `README.md`, push it all to GitHub so your repo looks incredibly professional:

```bash
git add .
git commit -m "Cleaned up unused boilerplate files and updated README documentation"
git push