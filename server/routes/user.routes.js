import express from 'express'
import { getData, google, logout } from '../controller/user.controller.js'
import checkTokenAuth from '../middleware/checkToken.js'
import { genrateDemo } from '../controller/website.controller.js'

const router = express.Router()

router.post('/google', google)
router.get('/logout', logout)
router.get('/getData', checkTokenAuth, getData)
router.get('/gen', checkTokenAuth, genrateDemo)

export default router
