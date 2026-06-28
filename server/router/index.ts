import { Router } from 'express'

import { gameController } from '../controllers/gameController'
import { userController } from '../controllers/userController'
import authMiddleware from '../middlewares/authMiddleware'
//const {body} = require('express-validator')
//const userController = require('../controllers/user-controller')
//const authMiddleware = require('../middlewares/auth-middleware')

const router = Router()

//router.post('/registration',
//	body('email').isEmail(),
//	body('password').isLength({min: 3, max: 32}),
//	userController.registration)
//router.post('/logout', userController.logout)
//router.get('/activate/:link', userController.activate)
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/refresh', userController.refresh)
router.post('/game', gameController.createGame)
router.get('/users', authMiddleware, userController.getAllUsers)
router.post('/logout', authMiddleware, userController.logout)

export default router
