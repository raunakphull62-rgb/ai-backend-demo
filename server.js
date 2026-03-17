const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// TEST ROUTE (very important)
app.get("/test", (req, res) => {
  res.json({ message: "Server is working ✅" });
});

// MAIN API
app.post("/create-table", async (req, res) => {
  const { connectionString, prompt } = req.body;

  if (!connectionString) {
    return res.status(400).json({ error: "Connection string required" });
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Demo SQL (can upgrade later with AI)
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
      );
    `;

    await client.query(query);
    await client.end();

    res.json({ success: true, message: "✅ Table created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// FRONTEND
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
