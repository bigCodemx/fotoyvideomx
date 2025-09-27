const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const adminRouter = require('./admin');
const clientesRouter = require('./clientes');

router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/clientes', clientesRouter);

module.exports = router;
