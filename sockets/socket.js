const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('> Cliente conectado');
    console.log('>----------------x-token-----------------------------');
    console.log(client.handshake.headers['x-token']);
    console.log('>----------------------------------------------------<');

    const [valido,uid]= comprobarJWT(client.handshake.headers['x-token'])

    if (!valido) {return client.disconnect();}

    // Usuario autenticado
    usuarioConectado( uid );
    console.log(valido,uid);
    console.log('Cliente autenticado');

    // Ingresar usuario a una sala
    // sala global todos los usuarios
    client.join(uid);
    //ClientRect.to(uidPara).emit;

    // escuchar del cliente el mansaje-personal
    client.on('mensaje-personal',async (payload) => {
        console.log('>----------------------------------------------------<');
        console.log(payload);
        await grabarMensaje(payload);
    io.to(payload.para).emit('mensaje-personal',payload);
    })


    client.on('disconnect', () => {
        usuarioDesconectado( uid );
        console.log('Cliente desconectado');
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});
