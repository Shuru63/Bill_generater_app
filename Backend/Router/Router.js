const express=require('express')
const router = express.Router();

const createInvoice=require('../Controller/invoiceController')

router.post('/generate-bill',createInvoice);

module.exports=router;