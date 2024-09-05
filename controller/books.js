import Joi from "joi";
import Book from "../models/books.js";
import Author from "../models/authors.js";
import Comment from "../models/comments.js";
import { cloudinaryDelete } from "../lib/cloudinary/index.js";
export const create = async (req, res) => {
  let { error } = validate(req.body);
  if (error) return res.status(400).json(error.message);
  try {
    const authorData = await Author.findById(req.user._id);
    if (!authorData) {
      return res.status(400).json({
        success: false,
        msg: "You don't have a permission to create a book",
      });
    }
    let data = { ...req.body, author: req.user._id };
    let book = new Book(data)
    Object.assign(book, { newImage: req.file })
    await book.save()
    // let book = await Book.create({ ...data, image: { url: 'nimadur', publicId: "shu" }, newImage: req.file });
    // book = await book.populate("author", "-createdAt").execPopulate();
    book = await book.populate({ path: "author", select: "-createdAt", strictPopulate: false })
    const { user, ...docs } = book._doc;
    res.status(201).json({ success: true, payload: docs });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
  // #swagger.tags = ['Book']
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'create your own book',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong / author id is invalid',
            error: 'error.message'
        }
  } */
};

export const createComment = async (req, res) => {
  try {
    const { _id } = req.user;
    const { book, text } = req.body;
    const isExists = await Book.findById(book);
    if (!isExists) {
      return res
        .status(400)
        .json({ success: false, msg: "book id is invalid" });
    }
    const comment = await Comment.create({ text, book, user: _id });
    res.status(200).json({ success: true, payload: comment });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Something went wrong", error });
  }
  // #swagger.tags = ['Book Comments']
  // #swagger.description = 'Registerd users can proced this action'
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Post comment',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/COMMENT' }
} */
  /* #swagger.responses[200] = {
           description: 'Response body',
           schema: {$ref: '#/definitions/COMMENT_RESPONSE'}
   } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong / author id is invalid',
            error: 'error.message'
        }
  } */
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: id });
    res.status(200).json({ success: true, payload: comment });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Something went wrong", error });
  }
  // #swagger.tags = ['Book Comments']
  // #swagger.description = 'Registerd users can proced this action'
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.responses[200] = {
           description: 'Response body',
           schema: {$ref: '#/definitions/COMMENT_RESPONSE'}
   } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong / book id is invalid',
            error: 'error.message'
        }
  } */
  /* #swagger.responses[401] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong  you are not authorization',
            error: 'error.message'
        }
  } */
};

export const fetchBooks = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const book = await Book.paginate(
      {},
      {
        sort: { name: 1 },
        page,
        limit: pageSize,
        populate: [
          {
            path: "author",
            select: " -createdAt -updatedAt",
          }
        ],
      }
    );

    res.status(200).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Someting went wrong",
      error: error.message,
    });
  }
  // #swagger.tags = ['Book']
  // #swagger.description = 'Fetch all books'
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Someting went wrong',
         schema: {
            success: false,
            msg: 'Someting went wrong',
            error: 'error.message'
        }
  } */
};

export const searchBooks = async (req, res) => {
  const { title } = req.query;
  try {
    const book = await Book.find({
      title: { $regex: `^${title}`, $options: "i" },
    }).populate([
      { path: "author", select: "-createdAt -updatedAt" },
    ]);

    res.status(200).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Someting went wrong",
      error: error.message,
    });
  }

  // #swagger.tags = ['Book']
  // #swagger.description = 'Search book'
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Book errors page',
         schema: {
            success: false,
            error: 'title can not be empty',
            msg: 'Something went wrong'
        }
  } */
};

export const fetchCurrentUserBooks = async (req, res) => {
  const { page = 1, pageSize = 10, name = 1 } = req.query;
  try {
    const book = await Book.paginate(
      {
        author: req.user._id,
      },
      {
        sort: { name: name },
        page,
        limit: pageSize,
        populate: [
          {
            path: "author",
            select: " -createdAt -updatedAt",
          },
        ],
      }
    );

    res.status(200).json({ success: true, payload: book });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Someting went wrong",
      error: error.message,
    });
  }
  // #swagger.tags = ['Book']
  // #swagger.description = 'Get your own created book'
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Someting went wrong',
         schema: {
            success: false,
            msg: 'Someting went wrong',
            error: 'error.message'
        }
  } */
};

export const fetchBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate([
      {
        path: "author",
        model: "User",
        select:
          "firstName lastName image email phone date_of_birth date_of_death",
      },
    ]);
    if (!updatedBook) {
      res.status(400).json({
        success: false,
        msg: "Book id is invalid",
      });
    }
    const comments = await Comment.find({ book: id }).populate({
      path: "user",
      model: "User",
      select: "firstName lastName image",
    });
    res.status(200).json({
      success: true,
      payload: { book: { ...updatedBook._doc, comments } },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
  // #swagger.tags = ['Book']
  // #swagger.description = 'fetch book by id'
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOKID_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Someting went wrong',
         schema: {
            success: false,
            error: 'error.message'
        }
  } */
};

export const updateBook = async (req, res) => {
  let { error } = validateUpdate(req.body);
  if (error) return res.status(404).json(error.message);
  const { id } = req.params;
  try {
    console.log(req.body, "=======");
    // let book = new Book(data)
    // Object.assign(book, { newImage: req.file })
    // await book.save()
    const book = await Book.findById(id).select("-author");
    Object.assign(book, { ...req.body, newImage: req.file })
    // const book = await Book.findByIdAndUpdate(
    //   id,
    //   { ...req.body },
    //   { new: true }
    // ).select("-author");
    await book.save()
    res.status(201).json({ success: true, payload: book });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: err.message,
    });
  }
  // #swagger.tags = ['Book']
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['id'] = {
        description: 'book id',
        required: true,
        type: 'string',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'update your own book',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.responses[200] = {
           description: 'Response body',
           schema: {$ref: '#/definitions/BOOK_RESPONSE'}
   } */
  /* #swagger.responses[400] = {
            description: 'Something went wrong',
           schema: {
              success: false,
              msg: 'Something went wrong',
              error: 'err.message'  
          }
    } */
};
export const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndDelete(id);
    const result = !book.imageId || await cloudinaryDelete(book.imageId)
    res.status(201).json({ success: true, payload: book });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: "Something went wrong",
      error: err.message,
    });
  }
  // #swagger.tags = ['Book']
  /* #swagger.security = [{
            "apiKeyAuth": []
     }] */
  /* #swagger.parameters['id'] = {
        description: 'book id',
        required: true,
        type: 'string',
        schema: { $ref: '#/definitions/BOOK' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/BOOK_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong',
         schema: {
            success: false,
            msg: 'Something went wrong'
        }
  } */
};

export const fetchBookByAuthorId = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name = 1 } = req.query;
    const { id } = req.params;
    const authorBooks = await Book.paginate(
      { author: id },
      {
        sort: { name: name },
        page,
        limit: pageSize,
        populate: [
          {
            path: "author",
            select: " -createdAt -updatedAt",
          },
        ],
      }
    );

    res.status(200).json({ success: true, payload: authorBooks });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
  // #swagger.tags = ['Book']
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {
            success: true,
            payload: [{$ref: '#/definitions/AUTHOR__BOOKS'}]
          }
  } */
  /* #swagger.responses[400] = {
          description: 'Book errors page',
         schema: {
            success: false,
            error: 'title can not be empty',
            msg: 'Author not found'
        }
  } */
};

function validate(formData) {
  const bookSchema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string(),
    country: Joi.string(),
    language: Joi.string(),
    link: Joi.string(),
    image: Joi.string(),
    pages: Joi.number(),
    year: Joi.date(),
    rate: Joi.number().min(0).max(5),
    price: Joi.number(),
    category: Joi.string().regex(/^(classic|biography|science)$/i),
    isPublished: Joi.boolean(),
    isFeatured: Joi.boolean(),
  });

  return bookSchema.validate(formData);
}

function validateUpdate(formData) {
  const bookSchema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string(),
    country: Joi.string(),
    language: Joi.string(),
    link: Joi.string(),
    image: Joi.string(),
    oldImg: Joi.string(),
    pages: Joi.number(),
    year: Joi.date(),
    rate: Joi.number().min(0).max(5),
    price: Joi.number(),
    category: Joi.string().regex(/^(classic|biography|science)$/i),
    isPublished: Joi.boolean(),
  });

  return bookSchema.validate(formData);
}
