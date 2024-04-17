const { GoogleGenerativeAI } = require('@google/generative-ai')
const express = require('express')

const app = express()
require('dotenv').config()

const genAi = new GoogleGenerativeAI(process.env.APIKEY)
const run = async (input) => {
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });
    const prompt = input
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text
}

app.get('/gemini', async (req, res) => {
    const input = req.query.t
    const response = await run(input)
    res.json({
        response,
        prompt: input
    })

})

app.get('/', (req, res) => res.json('ok'))


app.listen(process.env.PORT || 3000)
