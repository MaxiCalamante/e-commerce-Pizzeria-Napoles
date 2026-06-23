const express = require('express');

const VALID_ID = /^[a-zA-Z0-9_-]{2,64}$/;

const isValidId = (value) => {
    return typeof value === 'string' && VALID_ID.test(value);
};

const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: 'error',
        error: message
    });
};

const handleError = (res, error) => {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    const message = statusCode === 500 ? 'Error interno del servidor' : error.message;
    return sendError(res, statusCode, message);
};

const createAdoptionRouter = (service = require('../services/adoption.service')) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const adoptions = await service.getAllAdoptions();
            return res.status(200).json({
                status: 'success',
                payload: adoptions
            });
        } catch (error) {
            return handleError(res, error);
        }
    });

    router.get('/:aid', async (req, res) => {
        try {
            const { aid } = req.params;

            if (!isValidId(aid)) {
                return sendError(res, 400, 'El id de adopcion no es valido');
            }

            const adoption = await service.getAdoptionById(aid);
            if (!adoption) {
                return sendError(res, 404, 'Adopcion no encontrada');
            }

            return res.status(200).json({
                status: 'success',
                payload: adoption
            });
        } catch (error) {
            return handleError(res, error);
        }
    });

    router.post('/:uid/:pid', async (req, res) => {
        try {
            const { uid, pid } = req.params;

            if (!isValidId(uid) || !isValidId(pid)) {
                return sendError(res, 400, 'Los ids de usuario y mascota deben ser validos');
            }

            const adoption = await service.createAdoption(uid, pid, req.body);
            return res.status(201).json({
                status: 'success',
                payload: adoption
            });
        } catch (error) {
            return handleError(res, error);
        }
    });

    return router;
};

module.exports = createAdoptionRouter;
