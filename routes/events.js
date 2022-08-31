/* 
    Rutas de Eventos / Events
    host + /api/events    
*/

const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt');

const { validarCampos } = require('../middlewares/validar-campos')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas tienen que pasar por el JWT
// todo lo que esté debajo de este use, debe validar jwt. Si tengo alguna ruta publica, solo debo escribirla encima de use
router.use( validarJWT );


router.get('/', getEventos);

router.post('/',
                [
                    check('title', 'El titulo es obligatorio').not().isEmpty(),
                    check('start', 'Fecha de inicio debe ser obligatoria').custom( isDate ),
                    check('end', 'Fecha de termino es obligatoria').custom( isDate ),
                    validarCampos
                ], 
                crearEvento);

router.put('/:id',
                [
                    check('title', 'El titulo es obligatorio').not().isEmpty(),
                    check('start', 'Fecha de inicio debe ser obligatoria').custom( isDate ),
                    check('end', 'Fecha de termino es obligatoria').custom( isDate ),
                    validarCampos
                ],
                actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;


