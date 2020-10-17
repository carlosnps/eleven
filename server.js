const express = require("express");

//any other required goes here
// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3000;

var notes = require('./routes/htmlRoutes');
var apis = require('./routes/apiRoutes');
var apinotes = require('./db/db.json');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use('/notes', notes);
app.get('/api/notes', function(req, res){
     res.send(apinotes);
});
//app.use('/apinotes', apis);

app.post('/apinotes',function(req,res){
  var title=req.body.title;
  var text=req.body.text;
//  var title = 'carlos';
//  var text = 'coto';
  console.log("Title = "+title+", Text is "+text);
  res.end("yes");
});

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
