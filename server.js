require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err);
        return;
    }
    console.log('Veritabanına başarıyla bağlanıldı.');
});

app.post('/', (req, res) => {
    const sql = "SELECT * FROM users WHERE name = ? AND password = ?";
    const values = [
        req.body.email,
        req.body.password
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Database query error" });
        }

        if (data.length > 0) {
            return res.json({ success: true, message: "Login successful"});
        } else {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    });
});

app.post('/addnote', (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents) {
        return res.status(400).json({ message: "Both title and contents are required." });
    }

    const query = "INSERT INTO notes (title, contents) VALUES (?, ?)";
    db.query(query, [title, contents], (err, result) => {
        if (err) {
            console.error('Error inserting note:', err);
            res.status(500).json({ message: "Error adding note." });
        } else {
            res.status(201).json({ message: "Note added successfully!" });
        }
    });
});

app.get('/notes', (req, res) => {
    const query = "SELECT * FROM notes ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching notes:', err);
            res.status(500).json({ message: "Error fetching notes." });
        } else {
            res.status(200).json({ notes: results });
        }
    });
});

app.get('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    db.query('SELECT * FROM notes WHERE id = ?', [noteId], (err, result) => {
      if (err) {
        return res.status(500).send({ message: 'Error fetching note' });
      }
      if (result.length > 0) {
        return res.send({ note: result[0] }); // Notu döndür
      } else {
        return res.status(404).send({ message: 'Note not found' });
      }
    });
  });

  // Notu silmek için endpoint
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM notes WHERE id = ?', [id], (error, results) => {
      if (error) return res.status(500).json({ success: false, message: error.message });
      res.json({ success: true, message: 'Not silindi.' });
    });
  });

  // Notu güncellemek için endpoint
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    db.query('UPDATE notes SET title = ?, contents = ? WHERE id = ?', [title, contents, id], (error, results) => {
      if (error) return res.status(500).json({ success: false, message: error.message });
      res.json({ success: true, message: 'Not güncellendi.', note: { id, title, contents } });
    });
  });

app.listen(8081, () => {
    console.log("Sunucu 8081 portunda çalışıyor.");
});