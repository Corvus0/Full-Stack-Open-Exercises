const { PubSub } = require("graphql-subscriptions");
const { UserInputError, AuthenticationError } = require("apollo-server");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const pubsub = new PubSub();

const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";

const resolvers = {
  Query: {
    bookCount: async () => Book.collection().countDocuments(),
    authorCount: async () => Author.collection().countDocuments(),
    allBooks: async (root, args) => {
      let books = await Book.find({}).populate("author");
      if (args.author) {
        books = books.filter((b) => b.author.name === args.author);
      }
      if (args.genre) {
        books = books.filter((b) => b.genres.includes(args.genre));
        // return Book.find({ genre: { $in: [args.genre] } });
      }
      return books;
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: (root) => root.books.length,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args });
        }
      }
      let book = new Book({ ...args, author: author._id });

      try {
        book = await book.save();
        author.books = author.books.concat(book._id);
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      book = book.populate("author");

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated");
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      const updatedAuthor = { name: args.name, born: args.setBornTo };

      return Author.findByIdAndUpdate(author._id, updatedAuthor, {
        new: true,
      });
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
