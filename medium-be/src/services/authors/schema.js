const { Schema, model } = require("mongoose");

const AuthorSchema = new Schema(
  {
    name: String,
    surname: String,
    articles: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
  },
  { timestamps: true }
);

AuthorSchema.static("addArticleToAuthor", async function (articleId, authorId) {
  await authorModel.findByIdAndUpdate(authorId, {
    $push: { articles: articleId },
  });
});

const authorModel = model("author", AuthorSchema);

module.exports = authorModel;
