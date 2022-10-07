const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');
const Article = mongoose.model("Article", {
  title: String,
  content: String
});

/////////////////////////////////////////////////////////////////////////////// Requests targetting a specific article
app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.")
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Successfully deleted all article.")
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////////////////////////////////////////////////////////// Requests targetting a specific article
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
      // if(!err){
      //   res.send(foundArticles);
      // } else {
      //   res.send(err);
      // }
    });
  })

  .put(function(req, res) {
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err) {
          res.send("Successfully updated the article.");
        }
      }
    );
  })

  .patch(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if (!err) {
          res.send("Successfully updated the article.");
        } else {
          res.send(err);
        }
    });
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if (!err) {
          res.send("Successfully deleted the article.");
        } else {
          res.send(err);
        }
      });
  });

app.listen(3000, function() {
  console.log("Server started succesfully");
});




// {
//     "_id" : "63402fa123073c2b87228149",
//     "title" : "REST",
//     "content" : "REST is short for REpresentational State Transfer. It's an architectural style for designing APIs"
// }
// {
//     "_id" : "634030c923073c2b8722814a",
//     "title" : "API",
//     "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
// }
// {
//     "_id" : "634030d623073c2b8722814b",
//     "title" : "Bootstrap",
//     "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
// }
// {
//     "_id" : "634030e023073c2b8722814c",
//     "title" : "DOM",
//     "content" : "The Document Object Model is like an API for interacting with our HTML"
// }
// {
//     "_id" : "63403dc5bed948eec93fb5d0",
//     "title" : "Jack Bauer",
//     "content" : "Jack Bauer is able to build a snowman out of water.",
// }
