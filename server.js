const express = require("express");

//any other required goes here
// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3000;

var notes = require('./routes/htmlRoutes');
var apis = require('./routes/apiRoutes');
var apinotes = require('./db/db.json');
var bodyParser = require('body-parser');
var fs = require('fs')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use('/notes', notes);
app.get('/api/notes', function(req, res){
     res.sendfile('./db/db.json');
});
//app.('/apinotes', apis);
app.get('/list' , function(req, res){
  fs.readFile('./db/db.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      var respond = '';
      obj = JSON.parse(data);
      console.log("data length is " + obj.length);
      for(var i = 0; i < obj.length; i++) {
        respond = respond + "key " + i + " " + obj[i].title + " " + obj[i].text + "<\p>";
        console.log(obj[i]);
      }
      res.send(respond);
    }
  });
});

app.delete('/api/notes/:id' , function (req, res) {
  var id = req.params.id;
  fs.readFile('./db/db.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
      obj = JSON.parse(data);
      if (id in obj) {
        var oldtitle = obj[id].title;
        var oldtext = obj[id].text;
        obj.splice(id, 1);
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('./db/db.json' , json, 'utf8', function(err){
          if(err) return res.send("unable to delete json record");
          res.send("deleted " + oldtitle + " " + oldtext);
        });

      } else {
        res.send("key does not exist " + id);
      }
    }
  });
});

app.post('/apinotes',function(req,res){
  var title=req.body.title;
  var text=req.body.text;
  console.log("Title = "+title+", Text is "+text);
  fs.readFile('./db/db.json', 'utf8', function readFileCallback(err, data){
    if (err){
        return res.send(err);
    } else {
      obj = JSON.parse(data); //now it an object
      console.log("object is " + obj);
      obj.push({title: title, text: text}); //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile('./db/db.json' , json, 'utf8', function(err){
        if(err) console.log("error in writing");
        res.send("Note has been added");
      });
  }});
});

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
