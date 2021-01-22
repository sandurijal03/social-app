const { Schema, model } = require('mongoose');

const {
  Types: { ObjectId },
} = Schema;

const postSchema = new Schema(
  {
    body: {
      type: String,
    },
    username: {
      type: String,
    },
    comments: [
      {
        body: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
    likes: [
      {
        username: String,
        createdAt: String,
      },
    ],
    user: {
      type: ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Post', postSchema);
