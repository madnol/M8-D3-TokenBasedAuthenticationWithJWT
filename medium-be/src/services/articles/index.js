const express = require("express");
const mongoose = require("mongoose");
const articleSchema = require("./schema");
const reviewSchema = require("../reviews/schema");
const authorModel = require("./schema");
const articlesRouter = express.Router();

articlesRouter.get("/", async (req, res, next) => {
  try {
    //to find Articles
    const articles = await articleSchema.find();
    res.send(articles);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await articleSchema.findArticleWithAuthors(id);

    if (article) {
      res.send(article);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("I'm Sorry, seems this element doesn't exist! :(");
  }
});

articlesRouter.post("/", async (req, res, next) => {
  try {
    console.log("here");
    const newArticle = new articleSchema(req.body);
    const { _id } = await newArticle.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//you should link articles to their corresponding author

articlesRouter.post("/:id/add-to-author/:authorID", async (req, res) => {
  try {
    await authorModel.addArticleIdToAuthor(req.params.id, req.params.authorID);
    res.send("added");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

articlesRouter.put("/", async (req, res, next) => {
  try {
    const article = await articleSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (article) {
      res.send(article);
    } else {
      const error = new Error(`Article with id${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const article = await articleSchema.findByIdAndDelete(req.params.id);
    if (article) {
      res.send("Deleted");
    } else {
      const error = new Error(`Article with id${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//REVIEWS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

articlesRouter.post("/:id/reviews", async (req, res, next) => {
  try {
    //I take the article by ID
    const updateArticles = await articleSchema.findByIdAndUpdate(
      req.params.id,
      // I push the review inside the reviews array
      {
        $push: {
          reviews: req.body,
        },
      },
      //Validator
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(201).send(updateArticles);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:id/reviews/", async (req, res, next) => {
  try {
    const { reviews } = await articleSchema.findById(req.params.id, {
      reviews: 1,
      _id: 0,
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

articlesRouter.get("/:id/reviews/:revId", async (req, res, next) => {
  try {
    //Retrieve a specific review from the reviews array o a specified article
    const { reviews } = await articleSchema.findOne(
      //Convert id as a string into id as an objectId
      { _id: mongoose.Types.ObjectId(req.params.id) },

      //projection
      {
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.revId) },
        },
      }
    );

    if (reviews) {
      res.send(reviews);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

articlesRouter.delete("/:id/reviews/:revId", async (req, res, next) => {
  try {
    const modifiedRev = await articleSchema.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          reviews: { _id: mongoose.Types.ObjectId(req.params.revId) },
        },
      },
      {
        new: true,
      }
    );
    res.status(200).send(modifiedRev);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

articlesRouter.put("/:id/reviews/:revId", async (req, res, next) => {
  try {
    //FIND THE REVIEW
    //-I'm destructuring the article template to extrapolate from there the reviews array
    const { reviews } = await articleSchema.findOne(
      //-I'm finding the object/document of the review that I want to change from ID
      { _id: mongoose.Types.ObjectId(req.params.id) }, //Converts id as a string into id as an objectId
      {
        //Projection
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.revId) }, //Returns just an element
          //of the array that matches this _id conditions
        },
      }
    );

    if (reviews && reviews.length > 0) {
      const reviewToReplace = { ...reviews[0].toObject(), ...req.body };

      const modifiedReview = await articleSchema.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "reviews._id": mongoose.Types.ObjectId(req.params.revId),
        },
        { $set: { "reviews.$": reviewToReplace } },
        {
          runValidators: true,
          new: true,
        }
      );
      res.send(modifiedReview);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = articlesRouter;
