import "dotenv/config";
import express from "express";
import cors from "cors";
import pkg from "pg";
import OpenAI from "openai";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//const openai = new OpenAI({
//  apiKey: process.env.OPENAI_KEY,
//});

let openai = null;
if (process.env.OPENAI_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });
}

// create job
app.post("/jobs", async (req, res) => {
  const { title, description } = req.body;

  let summary = "AI disabled";

  if (process.env.OPENAI_KEY) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Summarize this job in one short paragraph",
        },
        {
          role: "user",
          content: description,
        },
      ],
    });

    summary = completion.choices[0].message.content;
  }

  const result = await pool.query(
    "INSERT INTO jobs(title, description, ai_summary) VALUES($1,$2,$3) RETURNING *",
    [title, description, summary]
  );

  res.json(result.rows[0]);
});

// list jobs
app.get("/jobs", async (req, res) => {
  const result = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
  res.json(result.rows);
});

app.listen(4000, () => console.log("Backend running on 4000"));
