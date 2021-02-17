const { Schema, model } = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const ArticleSchema = new Schema(
  {
    headLine: {
      type: String,
      required: true,
    },
    subHead: String,
    content: {
      type: String,
      required: true,
    },
    category: {
      name: String,
      img: String,
    },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    reviews: Array,
    cover: String,
  },
  { timestamps: true }
);

ArticleSchema.plugin(mongoosePaginate);

const articleModel = model("article", ArticleSchema);

module.exports = articleModel;
