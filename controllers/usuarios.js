const { response } = require("express");
const Usuario = require("../models/usuario");

const getUsuarios = async (req,res =response) => {
try {
        const desde =Number (req.query.desde) || 0
        const usuarios = await Usuario
        .find({_id: {$ne:req.uid}})
        .sort('-onLine')
        .skip(desde)
        .limit(20)
        
        
        res.json({
            ok:true,
            usuarios,
            desde
            // msg:'getUsuarios'
        })
     
} catch (error) {
    console.log(error);
}
}



module.exports={
    getUsuarios
}