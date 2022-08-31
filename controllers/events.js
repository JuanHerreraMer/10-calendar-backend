const { response } = require('express')
const Evento = require('../models/Evento');


const getEventos = async( req, res = response ) => {

    const eventos = await Evento.find()
                                    .populate('user','name');

    res.json({
        ok: true,
        eventos: eventos
    })
}

const crearEvento = async( req, res = response ) => {

    const evento = new Evento( req.body );

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        return res.status(201).json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    res.json({
        ok: true,
        msg: 'crearEvento'
    })
}

const actualizarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        // fn() findByIdAndUpdate tercer parametro, define si retorna el valor antiguo al no enviarlo o si retorna
        // el nuevo valor actualizado, enviando el parametro new: true

        res.status(201).json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const eliminarEvento = async( req, res = response ) => {
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id'
            });
        }

        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventoId )

        res.json({ ok: true })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}