import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import path from 'path'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const app = express()
app.use(cors())
app.use(express.json())

const __dirname = path.resolve()

app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'dist/index.html'))
)

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX',
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    })

    res.status(200).send({
      bot: response.data.choices[0].text,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error })
  }
})

app.listen(5007, () =>
  console.log('Server is running on port http://localhost:5007')
)
