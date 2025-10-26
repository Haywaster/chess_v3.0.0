import { Router } from 'express'
import { userController } from '../controllers/userController.ts'
import { gameController } from '../controllers/gameController.ts'
import authMiddleware from '../middlewares/auth-middleware.ts'
//const {body} = require('express-validator')
//const userController = require('../controllers/user-controller')
//const authMiddleware = require('../middlewares/auth-middleware')

// TODO: Убрал new
const router = new Router()

//router.post('/registration',
//	body('email').isEmail(),
//	body('password').isLength({min: 3, max: 32}),
//	userController.registration)
//router.post('/logout', userController.logout)
//router.get('/activate/:link', userController.activate)
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getAllUsers)
router.post('/createGame', authMiddleware, gameController.createGame)

export default router;