const auth = require('../middlewares/auth')
const indexController = require('../controllers/index.controller')
const authController = require('../controllers/auth.controller')
const registerController = require('../controllers/register.controller')
const itemController = require('../controllers/item.controller')
const balanceController = require('../controllers/balance.controller')
const router = require('express').Router()
const multer = require('multer')
const storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null,Date.now() + ".png");
    }
});
var upload = multer({ storage : storage})

router.get('/',indexController.index)

router.get('/login',auth,authController.index)
router.post('/login', authController.login)
router.get('/logout',authController.logout)

router.get('/register',auth,registerController.index)
router.post('/register',registerController.register)

router.get('/item',itemController.getItem)
router.get('/item/detail/:id',itemController.detail)
router.post('/item/buy/:id',itemController.buy)
router.get('/item/create', itemController.create)
router.post('/item/store',upload.single('image'),itemController.store)

router.get('/balance/getBalance',balanceController.getBalance)
router.get('/balance/:id',balanceController.index)
router.post('/balance/withdraw/:id',balanceController.withdraw)

 
module.exports = router;