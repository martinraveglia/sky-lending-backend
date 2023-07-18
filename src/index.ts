import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()

const PORT = process.env.PORT ?? 4000

app.use(cors())

app.get('/', (_, res) => {
  res.send('Sky Lending Server')
})

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}!`)
})
