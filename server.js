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

const writeToFile = (destination, noteContent) =>
fs.writeFile(destination, JSON.stringify(noteContent), (err) =>{
    if (err){
        console.error(err)
    } else {
        console.info(`\nData written to ${destination}`)
    }
})

const readAndAppend = (noteContent, file) =>{
    fs.readFile(file, 'utf8', (err, data) =>{
        if(err){
            console.error(err);
        } else{
            const noteData = JSON.parse(data);
            noteData.push(noteContent);
            writeToFile(file, noteData);
        }
    });
};

//route for index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

//route for notes page
app.get("/notes",(req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"),"utf8", (error,notes) => {
        if (error) {
            return console.log("cound not get note")
        }
        
        res.json(JSON.parse(notes))
    })
  });
  
app.post("/api/notes", (req, res) =>{
  
    const {date, title, text} = req.body

    if(req.body){
        const newNote = {
            date,
            title,
            text,
        };

        readAndAppend(newNote, "./db/db.json");
        res.json(newNote.title + " has beed added");
    } else {
        res.error("error adding note");
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);