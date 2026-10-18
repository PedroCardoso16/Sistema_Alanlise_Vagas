require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// ROTA DE TESTE INICIAL 
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'API está funcionando corretamente!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});