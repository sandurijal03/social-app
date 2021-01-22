const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../model/Post');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
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

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
      });

      const post = await newPost.save();

      ctx.pubsub.publish('NEW_POST', {
        newPost: post,
      });

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
    likePost: async (parent, { postId }, ctx, info) => {
      const { username } = checkAuth(ctx);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (parent, args, { pubsub }, info) =>
        pubsub.asyncIterator('NEW_POST'),
    },
  },
};
