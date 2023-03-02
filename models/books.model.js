const mongoose = require("mongoose");
// Create a schema for books documents
let BookSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  author: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  saleability: {
    type: String,
  },
  review: [
    {
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      added: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  added: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
