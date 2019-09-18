const bodyParser = require('body-parser');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const port = process.env.PORT || 8080;



//Open database for read and write
var db = new sqlite3.Database('database.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the database SQLite3 database');
});

//Close database
// db.close((err) => {
//   if (err) {
//     return console.error((err.message));
//   }
//   console.log('Close the databse connection');
// });

app.use('/',
  express.static(
    "./",{
      dotfiles: 'ignore',
      etag: true,
      extensions: false,
      index: "index.html",
      redirect: true
    }
  )
);

app.get('/Model', function(req, res, next){
  var query = 'SELECT *, rowid as id FROM task';
  db.all(query, [], (err, rows) => {
    if(err) {
      throw err;
    };
    var aEntryCollections = new Object();
    aEntryCollections.EntryCollection=rows;
    res.json(aEntryCollections);
  });
});


app.post('/Model/deletePost', function (req, res, next){
  var id = req.body.id;
  db.run("DELETE FROM task WHERE rowid = $id", {$id:  id}, (err) => {
    if(err){
      throw err;
    }
  });
});

app.post('/Model/changeStatus', function (req, res, next){
  var item = req.body;
  db.run("UPDATE task SET status = $status WHERE rowid = $id",
  {
    $id: item.id,
    $status: item.status
  }, (err) => {
          if(err){
            throw err;
          }
  })
});

app.post('/Model/changeTask', function (req, res, next){
  var task = req.body.task;
  var id = req.body.id;

  db.run("UPDATE task SET task = $task WHERE rowid = $id",
    {
      $id: id,
      $task: task
    }, (err) => {
          if (err){
            throw err;
          }
  })
})


app.post('/Model/newPost', function(req, res, next){
  var rows = req.body;

  db.run("INSERT INTO task (DateCreation,task,status,rowid) VALUES ($Date,$task,$status,$id)",{
    $Date: rows['DateCreation'],
    $task: rows['task'],
    $status: rows['status']
  }, (err) => {
    if(err){
      throw err;
    }
  });
  var id = db.run("SELECT MAX(rowid) FROM task");
  res.send(id);
});



app.listen(port);
console.log('Client app is serving locally on port '+port);
