const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configuración de la conexión MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'S3rv3r', // Cambia a tu contraseña
  database: 'productos' // Cambia a tu base de datos
});

// Conexión a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Crear un nuevo producto
app.post('/productos', (req, res) => {
  const newProduct = req.body;
  const sql = 'INSERT INTO productos SET ?';
  db.query(sql, newProduct, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Producto agregado', id: result.insertId });
  });
});

// Obtener todos los productos
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json(results);
    });
  });

// Actualizar un producto
app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  const sql = 'UPDATE productos SET ? WHERE id = ?';
  db.query(sql, [updatedProduct, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Producto actualizado' });
  });
});

// Borrar un producto
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM productos WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: 'Producto eliminado' });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
