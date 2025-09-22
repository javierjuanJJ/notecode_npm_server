// server.js
import express from "express";

const app = express();
const PORT = 3000;

// Ruta de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
