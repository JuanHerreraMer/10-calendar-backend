const { response } = require('express');
// require necesario para mantener el intelligence
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

const crearUsuario = async(req, res = response) => {
    
    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email: email }); 
        
        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }


        usuario = new Usuario( req.body );

        // Encriptar contrseña
        const salt = bcrypt.genSaltSync(); // Cantidad de vueltas o repeticiones para encryptar dato, default 10
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(`authController: [crearUsuario]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adminsitrador'            
        })    
    }

}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email: email }); 
        
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto'
            })
        }

        // confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Pass incorrecto'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        console.log(`authController: [loginUsuario]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el adminsitrador'
        })  
    }
}

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req;

    // generar un nuevo JWT y retornarlo en esta petición
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        uid, name,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}