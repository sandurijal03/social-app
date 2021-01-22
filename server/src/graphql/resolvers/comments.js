const Post = require('../../model/Post');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Mutation: {
    createComment: async (parent, { postId, body }, ctx, info) => {
      const { username } = checkAuth(ctx);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'comment body must not be empty',
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
    deleteComment: async (parent, { postId, commentId }, ctx, info) => {
      const { username } = checkAuth(ctx);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
};
