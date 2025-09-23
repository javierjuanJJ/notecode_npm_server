// server.js
import express from "express";
import fs from "fs";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());           // habilitar CORS
app.use(express.json());   // parsear JSON en body

// "Base de datos" en memoria (opcional persistir en archivo)
let snippets = [];

// Cargar snippets desde archivo JSON si existe
const DATA_FILE = "snippets.json";
if (fs.existsSync(DATA_FILE)) {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  snippets = JSON.parse(data);
  console.log(snippets);
}

// Guardar en archivo JSON
function saveSnippets() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(snippets, null, 2));
}

// 📌 POST /api/snippets → crea snippet
app.post("/api/snippets", (req, res) => {
  const { code, language, theme } = req.body;

  if (!code || !language || !theme) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const newSnippet = {
    id: uuidv4(),
    code,
    language,
    theme,
    createdAt: new Date().toISOString(),
  };

  snippets.push(newSnippet);
  saveSnippets();

  res.status(201).json({ id: newSnippet.id });
});

// 📌 GET /api/snippets/:id → obtiene snippet por id
app.get("/api/snippets/:id", (req, res) => {
  const { id } = req.params;
  const snippet = snippets.find((s) => s.id === id);

  if (!snippet) {
    return res.status(404).json({ error: "Snippet no encontrado" });
  }

  res.json(snippet);
});


// Ruta de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
