const websiteRoot = join(import.meta.dirname, '../../Website/dist')
import express from 'express'
import { join } from 'node:path'
const app = express()

app.use((req, res, next) => {
  console.info("[Server] Fulfilling request for", req.url + "...")
  next()
})
// NASA POWER climate figures for one place. The website asks this server, and this server asks NASA,
// so the visitor's browser never has to call NASA itself.
// (This route was written with Claude, an AI tool.)
const NASA_PARAMS = 'T2M,T2M_MIN,T2M_MAX,WS2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN'
app.get('/api/nasa-climate', async (req, res) => {
  const lat = Number(req.query.lat)
  const lon = Number(req.query.lon)
  if (req.query.lat === undefined || req.query.lon === undefined || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    res.status(400).json({ error: 'lat and lon are required' })
    return
  }
  try {
    const url = 'https://power.larc.nasa.gov/api/temporal/climatology/point' +
      `?parameters=${NASA_PARAMS}&community=RE&longitude=${lon.toFixed(3)}&latitude=${lat.toFixed(3)}&format=JSON`
    const answer = await fetch(url)
    if (!answer.ok) {
      res.status(502).json({ error: 'NASA POWER did not answer' })
      return
    }
    res.status(200).json(await answer.json())
  } catch (error) {
    console.error('[Server] NASA POWER request failed:', error)
    res.status(502).json({ error: 'NASA POWER could not be reached' })
  }
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