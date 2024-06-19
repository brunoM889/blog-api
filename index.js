import express from "express";
import cors from "cors";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const sql = postgres({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${process.env.ENDPOINT_ID}`,
  },
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/views", async (req, res) => {
  try {
    const posts = await sql`SELECT * FROM posts`;

    res.send({
      dbPosts: posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al obtener los datos");
  }
});

app.post("/views", async (req, res) => {
  try {
    const { postId } = req.body;
    const [view] = await sql`SELECT views FROM posts WHERE id = ${postId}`;

    await sql`UPDATE posts SET views = ${view.views + 1} WHERE id = ${postId}`;

    res.send({
      views: view.views + 1,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al actualizar los datos");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
