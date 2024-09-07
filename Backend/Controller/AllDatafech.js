const Invoice = require('../Modal/Invoicemodal.js');

const GetUser = async(req,res)=>{
 try{
    const getdata = await Invoice.find();
 if (!getdata) {
    return res.status(404).json({ success: false, message: "Order not found" });
}
res.status(200).json({
    success: true,
    getdata,
});
 }catch(err){
    return res.status(404).json({ err: "getdata function is not working." });
 }
}

const GetSingleUser = async(req,res)=>{
    try{
     
    const getSingledata=await Invoice.findById(req.params.id);
    
    if (!getSingledata) {
       return res.status(404).json({ success: false, message: "Order not found" });
   }
   res.status(200).json({
       success: true,
       getSingledata,
   });
    }catch(err){
       return res.status(404).json({ err: "getSingledata function is not working." });
    }
   }
   
module.exports={ GetUser ,GetSingleUser}