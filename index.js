const { GoogleGenerativeAI } = require('@google/generative-ai')
const express = require('express')

const app = express()
require('dotenv').config()

const genAi = new GoogleGenerativeAI(process.env.APIKEY)

app.get('/gemini', (req, res) => {
    const input = req.query.t
    const run = async () => {
        const model = genAi.getGenerativeModel({ model: "gemini-pro" });
        const prompt = 'what is yuor name?'
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        res.json(text)
    }
})


app.listen(process.env.PORT || 3000)
