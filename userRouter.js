const router = require('express').Router();
const userController=  require('../controllers/userControllers');

router.post('/signUp',userController.signUp)
router.put('/otpVerify',userController.otpVerify);
router.put('/otpResend',userController.otpResend);
router.get('/emailVerify/:id',userController.emailVerify);
router.put('/forgotPassword',userController.forgotPassword);
router.put('/resetpassword',userController.resetPassword);
router.post('/userLogin',userController.userLogin);
router.put('/editprofile',userController.editProfile);
router.get("/userList",userController.userList);
router.get('/userView',userController.userView);

module.exports = router;