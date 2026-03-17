const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// API route
app.post("/create-table", async (req, res) => {
  const { connectionString, prompt } = req.body;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Simple logic (demo)
    let query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
      );
    `;

    await client.query(query);
    await client.end();

    res.json({ success: true, message: "Table created!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// fallback route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
