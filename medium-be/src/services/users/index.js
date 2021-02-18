const express = require("express");
const UserModel = require("./schema");

//*from auth Tools
const { authenticate } = require("../auth/tools");
//*from auth Middlewares
const { authorize } = require("../auth/middlewares");

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    console.log("successfully registered!");
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    //CHECK CREDENTIALS
    const { username, password } = req.body;
    const user = await UserModel.findByCredentials(username, password);
    //GENERATE TOKEN
    const tokens = await authenticate(user);
    //SEND BACK TOKEN

    await res.status(200).send({ tokens });
    console.log("good boy ;)");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/", authorize, async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(err);
  }
});

usersRouter.put("/me", async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    console.log("Updates ", updates);

    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);

    res.send(updates);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me", async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.status(204).send("Deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
