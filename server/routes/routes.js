const routes = require('express').Router();
const dataCtrl = require('../controller/dataCtrl');

routes.get('/getData', dataCtrl.getData);



module.exports = routes;

