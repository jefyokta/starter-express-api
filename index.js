const { GoogleGenerativeAI } = require('@google/generative-ai')
const express = require('express')
const bodyparser = require('body-parser')
const { default: axios } = require('axios')
const fs = require('fs')

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
app.use(bodyparser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://oktaax.wuaze.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.get('/gemini', async (req, res) => {
    const input = req.query.t
    if (!input) res.status(400).json({ statusmsg: 'badrequest', msg: ' t query params di perlukan untuk request response ai' })
    else {
        const response = await run(input)
        res.json({
            response,
            prompt: input,
        })
    }

})

app.post('/gemini', async (req, res) => {
    const data = req.body
    if (!data) {
        res.status(400).json('request body nya mana')

    }
    else {
        console.log(data);
        const input = req.body.text
        const user = req.body.user
        const response = await run(input)
        res.json({
            response,
            prompt: input,
            user
        })
    }

})

app.get('/', (req, res) => res.json('ok'))

const fetch = require('node-fetch');

app.post('/payment', async (req, res) => {
    const data = JSON.stringify({
        orderid: req.body.order_id,
        status: req.body.status_code
    });

    try {
        fs.writeFileSync('data.json', data, 'utf8');
        res.status(200).json('test');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json('Internal Server Error');
    }
});


app.listen(process.env.PORT || 3000)
