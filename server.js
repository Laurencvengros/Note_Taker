// https://rocky-garden-53452.herokuapp.com/ --> heroku deployed site url

const express = require('express');
const path = require("path");
const fs = require("fs");

var PORT = process.env.PORT || 3001;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
        if (error) {
            return console.log("cound not get note")
        }

        res.json(JSON.parse(notes))
    })
});

app.post("/api/notes", (req, res) => {

    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    if(notes.length === 0){
        newNotes.id = 1
    }else{
        newNotes.id = notes.length + 1;
    }
    
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});


app.delete('/api/notes/:id', function(req, res) {
    
    const deleteNote = req.params.id;

    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;

      
      noteData = JSON.parse(data);
      
      for (let i = 0; i < noteData.length; i++) {
        if (noteData[i].id === Number(deleteNote)) {
          noteData.splice([i], 2);
        }
      }
      
      stringData = JSON.stringify(noteData);

      fs.writeFile('./db/db.json', stringData, (err, data) => {
        if (err) {
            console.log("err deleting note")
        }else{
            res.json(data)
            console.log("note deleted!")
        }
      });
      
    });
});
  


//route for notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});



//route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});




app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`));