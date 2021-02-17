const { Schema, model } = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const reviewSchema = new Schema({
  text: {
    type: String,
    required: false,
    lowercase: true,
  },
  user: {
    type: String,
    required: false,
    lowercase: true,
  },
});

reviewSchema.plugin(mongoosePaginate);

module.exports = model("Review", reviewSchema);
