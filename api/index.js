const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.SECRET_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const prompt = req.body.prompt;
        
        try {
            const result = await model.generateContent(prompt);
            const response = { text: result.response.text() };
            console.log(response.text);
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
