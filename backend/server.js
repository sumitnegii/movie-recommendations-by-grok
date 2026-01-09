import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import Groq from "groq-sdk";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
});

// DB
const db = new Database("movies.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_input TEXT,
    recommended_movies TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

// Groq (FREE)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/recommend", async (req, reply) => {
  const { input } = req.body;

  if (!input) {
    return reply.code(400).send({ error: "Input required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a movie recommendation assistant.",
        },
        {
          role: "user",
          content: `Recommend 3 to 5 movies based on this preference: "${input}". 
Return ONLY movie names as a list.`,
        },
      ],
    });

    const text = completion.choices[0].message.content;

    const recommendations = text
      .split("\n")
      .map((m) => m.replace(/^\d+[\).\s-]*/, "").trim())
      .filter(Boolean);

    db.prepare(
      `INSERT INTO recommendations (user_input, recommended_movies)
       VALUES (?, ?)`
    ).run(input, JSON.stringify(recommendations));

    return { recommendations };
  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: "AI generation failed" });
  }
});


// to check data base 
app.get("/debug/db", async (req, reply) => {
  const rows = db
    .prepare("SELECT * FROM recommendations ORDER BY timestamp DESC")
    .all();

  return {
    count: rows.length,
    data: rows,
  };
});


app.listen(
  {
    port: PORT,
    host: "0.0.0.0", 
  },
  () => {
    console.log(` Server running on port ${PORT}`); // testing
  }
);



//  Googlr APi not worked 
//  OPen AI limit exeed
// finally grok worked