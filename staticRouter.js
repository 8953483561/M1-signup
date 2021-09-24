const staticRouter = require('express').Router();

const staticController = require('../controllers/staticController');
const userController=  require('../controllers/userControllers');

staticRouter.get('/staticList',staticController.staticList);
staticRouter.get('/staticView',staticController.staticView);
staticRouter.put('/editStatic',staticController.editStatic);



module.exports = staticRouter;