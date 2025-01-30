const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const rateLimit = require('express-rate-limit');
app.use(bodyParser.json());
app.use(cors({
    origin: "https://imran-gemini.vercel.app/", 
    methods: ["GET", "POST"],
    
  }))

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 25, // Max 25 requests per IP
    message: { error: "Request limit reached. Try again later." },
    keyGenerator: (req) => req.ip, // Track users by IP
    standardHeaders: true,
    legacyHeaders: false,
});


if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.SECRET_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/chat" , limiter, async (req,res)=>{
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const result = await model.generateContent(prompt);
        
       
        const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

        console.log("Response:", text);
        return res.status(200).json({ text });
    } catch (error) {
        console.error("Error generating content:", error);
        return res.status(500).json({ error: "An error occurred while generating content" });
    }
})

const port = 6000 || process.env.PORT

app.listen(port,()=>{
    console.log("server is running");
    
})

