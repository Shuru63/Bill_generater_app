const express=require('express')
const router = express.Router();

const createInvoice=require('../Controller/invoiceController')
const {  GetUser,GetSingleUser} = require('../Controller/AllDatafech')
router.post('/generate-bill',createInvoice);
router.get('/getuser-bill',GetUser);
router.get('/getSingleuser-bill/:id',GetSingleUser);

module.exports=router;