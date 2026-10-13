const { rateStudent } = require('../../../src/controllers/tutor.controller');
const ratingModel = require('../../../src/models/rating');
const sessionModel = require('../../../src/models/session');

jest.mock('../../../src/models/session');
jest.mock('../../../src/models/rating');

describe('Pruebas Unitarias - Calificar Desempeño del Estudiante', () => {
    let req, res;

    beforeEach(() => { // Configuración inicial antes de cada prueba
        req = {
            params: { id: '74' },
            body: {},
            user: { id: 10 } // ID del Tutor autenticado
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    test('1. Debe retornar 400 si las estrellas son menores a 1 o mayores a 5', async () => {
        req.body = { estrellas: 6, comentario: 'Excelente desempeño' };
        await rateStudent(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ 
            status: 'error', 
            message: 'La calificación debe ser un número entero entre 1 y 5.' 
        });
    });

    test('2. Debe retornar 400 si el comentario no es enviado o está vacío', async () => {
        req.body = { estrellas: 5, comentario: '   ' };

        await rateStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            message: 'El comentario es obligatorio.'
        }));
    });

    test('3. Debe retornar 400 si el comentario supera los 500 caracteres', async () => {
        req.body = {
            estrellas: 5,
            comentario: 'A'.repeat(501)
        };

        await rateStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            message: 'El comentario no puede exceder los 500 caracteres.'
        }));
    });

    test('4. Debe retornar 400 si la sesión no está en estado "Atendida"', async () => {
        req.body = { estrellas: 5, comentario: 'Buena participación' };

        // Simular que la sesión existe pero está 'Activa'
        sessionModel.findSessionByIdAndTutorId.mockResolvedValueOnce({
            id: 74,
            id_estudiante: 23,
            id_tutor: 10,
            estado: 'Activa'
        });

        await rateStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            message: 'La sesión solo puede ser calificada cuando está atendida.'
        }));
    });

    test('5. Debe retornar 201 y guardar la calificación exitosamente cuando los datos son válidos', async () => {
        req.body = { estrellas: 5, comentario: 'Gran actitud durante la sesión.' };

        // 1. Simular sesión atendida
        sessionModel.findSessionByIdAndTutorId.mockResolvedValueOnce({
            id: 74,
            id_estudiante: 23,
            id_tutor: 10,
            estado: 'Atendida'
        });

        // 2. Simular respuesta del modelo rating
        ratingModel.upsertRating.mockResolvedValueOnce({
            id: 3,
            id_sesion: 74,
            id_estudiante: 23,
            id_tutor: 10,
            estrellas: 5,
            comentario: 'Gran actitud durante la sesión.',
            created: true
        });

        await rateStudent(req, res);

        expect(sessionModel.findSessionByIdAndTutorId).toHaveBeenCalledWith('74', 10);
        expect(ratingModel.upsertRating).toHaveBeenCalledWith(74, 23, 10, {
            estrellas: 5,
            comentario: 'Gran actitud durante la sesión.'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'success',
            message: 'Calificación guardada exitosamente.'
        }));
    });
});