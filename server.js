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

//route for index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//route for notes page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (error,notes) => {
        if (error) {
            return console.log("cound not get note")
        }
        
        res.json(JSON.parse(notes))
    })
  });
  
app.post("/api/notes", (req, res) =>{
    fs.readFile(path.join(__dirname, "./db/db.json"),function(error, response) {
        if (error) {
            console.log("failed to add note");
        }

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
})