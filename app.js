const express = require("express");
const ejs = require("ejs");
const path = require("path");
const MongoClient = require("mongodb").MongoClient;

// Init express
const app = express();
const port = process.env.PORT || 3000;

// Configure environment variables
require("dotenv").config();

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set("view engine", "ejs");

//Routes

// Render home page
app.get("/", (request, response) => {
  MongoClient.connect(process.env.DB_URL, (err, db) => {
    if (err) throw err;
    let dbo = db.db("as-how-blog");
    dbo
      .collection("posts")
      .find({})
      .toArray((err, res) => {
        if (err) throw err;
        response.render("index", { posts: res });
      });
  });
});

// Render blog page
app.get("/blog/:id", (request, response) => {
  MongoClient.connect(process.env.DB_URL, (err, db) => {
    if (err) throw err;
    let dbo = db.db("pain-tea-blog");
    let id = require("mongodb").ObjectId(request.params.id);
    dbo.collection("blogs").findOne({ _id: id }, (err, res) => {
      if (err) throw err;
      console.log(res);
      response.render("blog", { post: res });
      db.close();
    });
  });
});

// Render new blog form
app.get("/new", (req, res) => {
  res.render("new");
});

// Post data to mongodb
app.post("/add", (req, res) => {
  const { title, subtitle, author, article } = req.body;

  const obj = { title, subtitle, author, article, date: new Date() };

  MongoClient.connect(process.env.DB_URL, (err, db) => {
    if (err) throw err;
    let dbo = db.db("pain-tea-blog");
    dbo.collection("blogs").insertOne(obj, (err, res) => {
      if (err) throw err;
      console.log("Data inserted successfully.");
      db.close();
    });
  });

  console.log(req.body);

  res.send("Article uploaded successfully.");
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}.`));
