const express = require('express');
const app = express();
const PORT = 3000;

// Definice hlavní stránky
app.get('/', (req, res) => {
  res.send('Vítejte na Express serveru!');
});

// Definice API endpointu
app.get('/api/info', (req, res) => {
  res.json({ zprava: "Node.js je super!", verze: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`Express server běží na http://localhost:${PORT}`);
});