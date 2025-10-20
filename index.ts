import express from 'express'

const app = express()

app.use(express.json()) // Adding middleware to parse JSON bodies

const router = express.Router()
router.get('/', (req, res) => res.send('Hello World!'))

app.use('/api', router)

app.listen(8000) // Start the server on port 8000