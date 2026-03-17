import express from "express";
import cors from "cors";
import pg from "pg";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const { Client } = pg;

// 🔹 Replace with your OpenAI key
const OPENAI_API_KEY = "YOUR_OPENAI_KEY";

// 🧠 Convert prompt → SQL
app.post("/generate-sql", async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Convert user request into PostgreSQL CREATE TABLE SQL only."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();
  const sql = data.choices[0].message.content;

  res.json({ sql });
});

// 🔥 Execute SQL in Supabase
app.post("/execute", async (req, res) => {
  const { connectionString, sql } = req.body;

  try {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    await client.query(sql);
    await client.end();

    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on 3000"));
