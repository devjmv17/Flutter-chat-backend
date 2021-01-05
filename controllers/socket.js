
const Usuario=require('../models/usuario');
const Mensaje=require('../models/mensaje');


const usuarioConectado = async ( uid = ' ') => {

    const usuario = await Usuario.findById( uid );
    usuario.onLine = true;
    await usuario.save();
    console.log('Usuario.online = true');
    return usuario;
}

const usuarioDesconectado = async ( uid = ' ') => {

    const usuario = await Usuario.findById( uid );
    usuario.onLine = false;
    await usuario.save();
    console.log('Usuario.online = false');
    return usuario;
}

const grabarMensaje = async(payload) => {
    /*
    {
        de: '',
        para:'',
        texto:''
    }
    */
    try {
        const mensaje = new Mensaje (payload)
        await mensaje.save();
        
    } catch (error) {
        return false;
        
    }
}


module.exports={
    usuarioConectado,
    usuarioDesconectado,
    grabarMensaje
}