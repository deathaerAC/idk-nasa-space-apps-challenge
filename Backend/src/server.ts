const websiteRoot = join(import.meta.dirname, '../../Website/dist')
import express from 'express'
import { join } from 'node:path'
const app = express()

app.use((req, res, next) => {
  console.info("[Server] Fulfilling request for", req.url + "...")
  next()
})
app.get('/ranking', (req, res) => {
  res.status(200).sendFile(join(websiteRoot, "index.html"))
})
app.get('/challenge', (req, res) => {
  res.status(200).sendFile(join(websiteRoot, "index.html"))
})
app.use(express.static(websiteRoot, {
  extensions: ['html', 'htm']
}))
app.use((req, res) => {
  res.status(404).sendFile(join(websiteRoot, "index.html"))
})

const port = Number.isNaN(Number(process.argv[3])) ? 3000 : Number(process.argv[3])
app.listen(port, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.info(`Now listening on localhost:${port}`)
  }
})