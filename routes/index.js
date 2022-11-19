const { application } = require('express');
var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select blog_id, blog_txt from blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Express', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_txt text NOT NULL,
                     blog_content TEXT);

                      insert into blog (blog_txt)
                      values ('This is a great blog'),
                             ('Oh my goodness blogging is fun');`,
              () => {
                db.all(` select blog_id, blog_txt from blog`, (err, rows) => {
                  res.render('index', { title: 'Express', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting " + req.body.blog);
      let stmt = db.prepare("INSERT INTO blog (blog_txt, blog_content) VALUES (?, 'test_content');");
      stmt.run(req.body.blog);
      stmt.finalize();
      res.redirect('/');
    }
  );
})


router.post('/update', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("updating " + req.body.blog[0]);
      //let stmt = db.prepare("UPDATE blog SET ? WHERE blog_id = ?;");
      //stmt.run(req.body.blog[0], req.body.blog[1]);
      db.run("UPDATE blog SET blog_txt = $txt WHERE blog_id = $id", {
          $txt: req.body.blog[1],
          $id: req.body.blog[0]
      });
      //stmt.finalize();
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting " + req.body.blog);
      let stmt = db.prepare("DELETE FROM blog WHERE blog_id = ?;");
      stmt.run(req.body.blog);
      stmt.finalize();
      res.redirect('/');
    }
  );
})

router.post('/delete_all', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      db.run("DROP TABLE IF EXISTS blog;");
      db.exec(`create table blog (
        blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_txt text NOT NULL,
        blog_content text);`);
      res.redirect('/');
    }
  );
})
router.get('/goto/:id', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      let stmt = `SELECT blog_content FROM blog WHERE blog_id = ?`;
      db.get(stmt, [req.params.id], (err, row) => {
        if(err){
          console.log("Getting error " + err);
        }
        res.send(row.blog_content);
      });

    }
  );
})

router.post('/add_blog', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("updating " + req.body.blog[0]);
      db.run("UPDATE blog SET blog_content = $txt WHERE blog_id = $id", {
          $txt: req.body.blog[1],
          $id: req.body.blog[0]
      });
      res.redirect('/');
    }
  );
})


module.exports = router;
      cexports = router;