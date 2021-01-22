const Post = require('../../model/Post');
const User = require('../../model/User');
const { hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators');
const checkAuth = require('../../utils/check-auth');

function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '1d',
    },
  );
}

exports.resolvers = {
  Query: {
    getPosts: async (parent, args, ctx, info) => {
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    },
    getPost: async (parent, { postId }, ctx, info) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createPost: async (parent, { body }, ctx, info) => {
      const user = checkAuth(ctx);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
      });

      const post = await newPost.save();

      return post;
    },
    deletePost: async (parent, { postId }, ctx, info) => {
      const user = checkAuth(ctx);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted  Successfully';
        } else {
          throw new AuthenticationError('action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    login: async (parent, { username, password }, ctx, info) => {
      const { valid, errors } = validateLoginInput(username, password);

      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError('Error', {
          errors,
        });
      }

      const match = await compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong Credentials';
        throw new UserInputError('Wrong credentials', {
          errors,
        });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        _id: user._id,
        token,
      };
    },

    register: async (
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      ctx,
      info,
    ) => {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
      );

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This email is already taken',
          },
        });
      }

      password = await hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
      });
      const response = await newUser.save();

      const token = generateToken(response);

      return {
        ...response._doc,
        _id: response._id,
        token,
      };
    },
  },
};
