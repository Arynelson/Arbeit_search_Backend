// src/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db/db'); // 👈 conexão com banco PostgreSQL
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Teste simples para verificar a conexão ao banco
app.get('/dbtest', async (req, res) => {
  try {
    const response = await pool.query('SELECT NOW()');
    res.json(response.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});


// Rota exemplo - Buscar vagas externas da Arbeitnow API
const axios = require('axios');

app.get('/api/jobs', async (req, res) => {
  const { query, location } = req.query;

  try {
    const response = await axios.get('https://www.arbeitnow.com/api/job-board-api');
    let jobs = response.data.data;

    // Filtragem básica por termo e localização (opcional, simples exemplo)
    if (query) {
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (location) {
      jobs = jobs.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json(jobs);
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).send('Failed to fetch jobs');
  }
});

// Adicione em server.js ou em rotas específicas
// 📌 Importando as rotas de jobs
const jobRoutes = require('./routes/jobsRoutes.js'); // Caminho correto

app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.json({ message: '✅ API is running!' });
});

const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
