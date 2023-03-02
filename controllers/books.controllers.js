const { isObjectIdOrHexString } = require("mongoose");
const Book = require("../models/books.model");

// This middleware will pull the books from the database
async function getBooks(req, res) {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Invalid user" });
    console.log(error);
  }
}

// Add book middleware that will find the book in the database if the book doesn't exist it will create one
async function addBook(req, res) {
  const {
    title,
    subtitle,
    author,
    description,
    pageCount,
    image,
    price,
    _id,
    saleability,
  } = req.body;
  const book = await Book.findOne({ title: title, author: author });
  if (!book) {
    const newBook = new Book({
      _id: _id,
      title,
      subtitle,
      author,
      description,
      pageCount,
      image,
      price,
      saleability,
      review: [],
    });
    try {
      await newBook.save();
      res.json({ message: "Book successfully added!" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.json({ message: "Book already exists" });
  }
}

// Delete middleware
// It will find the book that matches the the id, and remove it from the list
async function deleteBook(req, res) {
  try {
    const { id } = req.body;
    await Book.deleteOne({ _id: id });
    res.send({ message: "Success" });
  } catch (error) {
    console.error(error);
  }
}

// Add review middleware will find the book in the database and add the review
async function addReview(req, res) {
  try {
    const {
      name,
      comment,
      title,
      subtitle,
      author,
      description,
      pageCount,
      image,
      price,
      _id,
      saleability,
    } = req.body;
    const book = await Book.findOne({ _id: _id });
    if (book) {
      await Book.updateOne(
        { _id: _id },
        { $push: { review: { name, comment } } }
      );
    } else {
      const newBook = new Book({
        _id: _id,
        title,
        subtitle,
        author,
        description,
        pageCount,
        image,
        price,
        saleability,
        review: [{ name, comment }],
      });
      await newBook.save();
    }
    res.send({ message: "Success" });
  } catch (error) {
    console.error(error);
  }
}

// Edit middleware
// It will find the book that matches the title and authors and the id, and update the content
async function editBook(req, res) {
  try {
    const { title, authors, pageCount, image, price } = req.body;
    await Book.updateOne(
      { title, authors },
      {
        $set: {
          pageCount: pageCount,
          image: image,
          price: price,
        },
      }
    );
    res.send({ message: "Success" });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addBook,
  editBook,
  deleteBook,
  getBooks,
  addReview,
};
