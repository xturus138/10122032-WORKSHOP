const auth = require('../middlewares/auth')
const indexController = require('../controllers/index.controller')
const authController = require('../controllers/auth.controller')
const registerController = require('../controllers/register.controller')
const itemController = require('../controllers/item.controller')
const balanceController = require('../controllers/balance.controller')
const cartController = require('../controllers/cart.controller')
const router = require('express').Router()
const upload = require('../storage')

router.get('/',indexController.index)

router.get('/login',authController.index)
router.post('/login', authController.login)
router.get('/logout',authController.logout)

router.get('/register',registerController.index)
router.post('/register',registerController.register)

router.get('/item',itemController.getItem)
router.get('/itemFilter',itemController.getItemFilter)
router.get('/item/detail/:id',itemController.detail)
router.post('/item/buy/:id',itemController.buy)
router.get('/item/create', itemController.create)
router.post('/item/store',upload.single('image'),itemController.store)

router.get('/cart/:id',auth,cartController.index)
router.get('/cart/delete/:id',auth,cartController.delete)
router.post('/cart/checkout',cartController.checkout)
router.post('/cart/addToCart',cartController.addToCart)

router.get('/balance/getBalance',balanceController.getBalance)
router.get('/balance/:id',balanceController.index)
router.post('/balance/withdraw/:id',balanceController.withdraw)
router.post('/balance/deposit/:id',balanceController.deposit)

 
module.exports = router;