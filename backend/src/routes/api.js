const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const vagasController = require('../controllers/vagasController');
const dashboardController = require('../controllers/dashboardController');
const coletaController = require('../controllers/coletaController');

// --- Autenticação (UC01, UC02) ---
router.post('/auth/registrar', authController.registrar);
router.post('/auth/login', authController.login);

// --- Consultas e Filtros de Vagas (UC03, UC04, UC09-UC14, UC15, UC19) ---
router.get('/vagas', vagasController.listarVagas);
router.get('/vagas/recentes', vagasController.listarVagasRecentes);
router.get('/vagas/comparar', vagasController.compararVagas);
router.get('/vagas/:id', vagasController.obterVagaPorId);

// --- Dashboard e Métricas (UC05, UC06, UC07, UC08, UC17, UC18) ---
router.get('/dashboard/metricas', dashboardController.obterMetricasDashboard);
router.get('/dashboard/tecnologias-demandadas', dashboardController.obterTecnologiasDemandadas);
router.get('/dashboard/tendencias', dashboardController.obterTendenciasMercado);
router.get('/dashboard/estatisticas-salariais', dashboardController.obterEstatisticasSalariais);

// --- Ingestão do Coletor Externo (UC20) ---
router.post('/coleta/vagas', coletaController.receberDadosColetados);

module.exports = router;