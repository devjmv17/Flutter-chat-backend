const { response } = require('express');
const { validationResult } = require('express-validator');
const Usuario= require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req,res = response)=>{
   
   const { email,password } = req.body;

   try {
    const existeEmail = await Usuario.findOne({ email : email });
    if (existeEmail) {
        return res.status(400).json({
            ok:false,
            msg:'El correo ya esta registrado'
        });
    }

    const usuario= new Usuario(req.body);
    
    // Encriptar contraseña
    const salt= bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password,salt);

    // Generar json web token
    const token  = await generarJWT(usuario.id);
    await usuario.save()
         res.json({
             ok:true,
             usuario,
             token
             //body: req.body,
 //            msg:'Crear Usuario !!'
         });

   } catch (error) {
       console.log(error);
       res.status(500).json({
           ok:false,
           msg: 'Hable con el administrador'
       });
   }
}

const loginUsuario =  async (req,res = response) => {

    const { email,password } = req.body; 

try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
        return res.status(400).json({
            ok: false,
            msg: 'Email no encontrado'
        });
    }

    const validPassword = bcrypt.compareSync( password, usuarioDB.password );
    if (!validPassword) {
        return res.status(400).json({
            ok: false,
            msg: 'Contraseña no valida'
        });
    }
    
    // Generar JWT
    const token  = await generarJWT(usuarioDB.id);
        res.json({
             ok:true,
             usuario: usuarioDB,
             token
         });

} catch (error) {
    console.log(error);
       return res.status(500).json({
           ok:false,
           msg: 'Hable con el administrador'
       });
}

    return res.json({
        ok:true,
        msg:'login'
    })
} 

const renewToken = async ( req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById( uid );
    
    res.json({
        ok:true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}