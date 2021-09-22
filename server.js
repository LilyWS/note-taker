const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
var db = './db/db.json';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {res.json(JSON.parse(data));});
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    console.log(title + text);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status('500').json(err);
      } else {
        const parsedDB = JSON.parse(data);
        parsedDB.push({title, text, id: uuidv4()});
        fs.writeFile('./db/db.json', JSON.stringify(parsedDB, null, 4), (err) => err? console.log(err) : console.log('added note'));
        res.json(db);
      }
    });

    
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);