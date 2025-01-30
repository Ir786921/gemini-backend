const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true,
  }))


if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.SECRET_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/chat" , async (req,res)=>{
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

