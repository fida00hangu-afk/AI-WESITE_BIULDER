import express from 'express'
import checkTokenAuth from '../middleware/checkToken.js'
import { changes, genrateWebsite, getAll, getWebsites, website } from '../controller/website.controller.js'
const WebRouter = express.Router()

WebRouter.post('/Website', checkTokenAuth, genrateWebsite)
WebRouter.post('/getWebsite/:id', checkTokenAuth, website)
WebRouter.post('/update/:id', checkTokenAuth, changes)
WebRouter.get('/getWebsites', checkTokenAuth, getWebsites)
WebRouter.get('/getAll', checkTokenAuth, getAll)

export default WebRouter