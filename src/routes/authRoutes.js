const express = require("express");
const bcrypt = require("bcryptjs"); // Agora usando bcryptjs
const jwt = require("jsonwebtoken");
const pool = require("../db/db");

const router = express.Router();

// 📌 Rota de Registro de Usuário
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 🔹 Gerando o hash da senha com bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Rota de Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Email not found. Please register." });
    }

    // 🔹 Comparando senha com bcryptjs
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: "Incorrect password. Try again." });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
