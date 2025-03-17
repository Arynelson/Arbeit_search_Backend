// src/routes/jobsRoutes.js
const express = require('express');
const pool = require('../db/db'); 
const axios = require('axios');

const router = express.Router();

//  Rota para buscar vagas da API Arbeitnow e enviar ao frontend
router.get('/external', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.arbeitnow.com/api/job-board-api');
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs from Arbeitnow API' });
  }
});

//  Rota para salvar uma vaga no PostgreSQL
router.post('/save', async (req, res) => {
  const { slug, company_name, title, description, remote, url, tags, job_types, location, created_at, notes } = req.body;

  try {
    const savedJob = await pool.query(
      `INSERT INTO jobs 
      (slug, company_name, title, description, remote, url, tags, job_types, location, created_at, notes) 
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9, to_timestamp($10), $11) RETURNING *`,
      [slug, company_name, title, description, remote, url, tags, job_types, location, created_at, notes]
    );

    res.json(savedJob.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("❌ Error saving job");
  }
});

//  Rota para obter todas as vagas salvas no banco
router.get('/saved', async (req, res) => {
  try {
    const jobs = await pool.query("SELECT * FROM jobs ORDER BY saved_at DESC");
    res.json(jobs.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("❌ Error fetching saved jobs");
  }
});

//  Rota para deletar uma vaga salva
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM jobs WHERE id = $1", [id]);
    res.json({ message: "✅ Job deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("❌ Error deleting job");
  }
});
router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      await pool.query("UPDATE jobs SET status = $1 WHERE id = $2", [status, id]);
      res.json({ message: "✅ Job status updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("❌ Error updating job status");
    }
  });
  

// 📌 Rota para buscar vagas externas com filtros
router.get("/external", async (req, res) => {
  try {
    const { query, location, job_type, tag, sort } = req.query;

    const { data } = await axios.get("https://www.arbeitnow.com/api/job-board-api");
    let jobs = data.data;

    // 🔍 Filtrar por título ou descrição
    if (query) {
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // 📍 Filtrar por localização
    if (location) {
      jobs = jobs.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 💼 Filtrar por tipo de trabalho (Full-time, Internship, etc.)
    if (job_type) {
      jobs = jobs.filter(job => job.job_types.includes(job_type));
    }

    // 🏷️ Filtrar por tags (React, Backend, etc.)
    if (tag) {
      jobs = jobs.filter(job => job.tags.includes(tag));
    }

    // 📅 Ordenar por data de criação (mais recentes primeiro)
    if (sort === "latest") {
      jobs = jobs.sort((a, b) => b.created_at - a.created_at);
    }

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

module.exports = router;