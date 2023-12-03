var express = require('express');
var userRouter = express.Router();

const { readWritePrimary } = require("../keys/keys.js");
const { MongoClient } = require("mongodb");
const client = new MongoClient(readWritePrimary);
client.connect(); // Has to connect before selecting db
const db = client.db("dnddb");
const users = db.collection('users');
const ObjectId = require('mongodb').ObjectId;

userRouter.get('/', async (req, res) => {
  res.send('User route reached');
});

userRouter.get("/id?", async (req, res) => {
  try {
    var result = await users.findOne(
        {username: req.query.username}
      );
    res.send(result._id);
  }
  catch (err) {
    res.send({message: err});
  }
});

userRouter.get("/password?", async (req, res) => {
  try {
    var result = await users.findOne(
        {username: req.query.username}
      );
    if (result == null) {
      res.send({message: false});
    }
    else {
      if (req.query.password == result.password) {
        res.send({message: "true", _id: result._id});
      }
      else {
        res.send({message: "false"});
      }
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

userRouter.post("/signup/", async (req, res) => {
  try {
    var result = await users.findOne(
        {username: req.body.username}
      );
    if (result != null) {
      res.send({ message: "false" });
    }
    else {
      var user = {
        _id: new ObjectId(),
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        usersShard: 0
      };
      users.insertOne(user);
      res.send({ message: "true", _id: user._id });
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

module.exports = userRouter;