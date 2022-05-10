require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const homeStartingContent = "Welcome to this blog website. Here, you can log the events which happened with you and after some time you can read them! It's like you are maintaining your online diary which can be accessed from anywhere and no need to carry that. It's in your phone and just a click away. This is just your technical diary which can be accessed from any device. So, start blogging your daily events now, so that you can remember your events and some days later you can enjoy those memories or you can at least remember them and be happy and at last WELCOME AGAIN!";

const db = require("./connections/config");
const schemas = require("./models/model");

const postSchema = schemas.post;

const Post = new mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
    Post.find({}, (err, posts) => {
        if(err) {
            throw err;
        } else {
            res.render("home", {startingContent: homeStartingContent, userPosts: posts});
        }
    });
});

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    post.save((err) => {
        if(err) {
            throw err;
        } else {
            res.redirect("/")
        }
    });
});

let requestedPostId;

app.get("/posts/:postId", function(req, res) {
    requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}, function(err, post) {
        if(err) {
            throw err;
        } else {
            res.render("post", {title: post.title, content: post.content});
        }
    });
});

app.get("/about", function(req, res) {
    res.render("about")
});

app.get("/contact", function(req, res) {
    res.render("contact")
});

app.get("/compose", function(req, res) {
    res.render("compose")
});

app.get("/delete", function(req, res) {
    Post.deleteOne({_id: requestedPostId}, function(err, post) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    })
});

app.get("/update", function(req, res) {
    Post.find({_id: requestedPostId}, function(err, post) {
        if(err) {
            console.log(err);
        } else {
            const element = post[0];
            res.render("update", {title: element.title, content: element.content});
        }
    });
});

app.post("/update", function(req, res) {
    const newTitle = req.body.updatedTitle;
    const newContent = req.body.updatedBody;
    Post.find({_id: requestedPostId}, function(err, post) {
        if(err) {
            console.log(err);
        } else {
            post[0].title = newTitle;
            post[0].content = newContent;
            post[0].save(function(err) {
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/");
                }
            });
        }
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}.`);
});