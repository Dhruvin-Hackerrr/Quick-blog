export const commentSelect = {
  commentId: true,
  message: true,
  postId: true,
  user : {
    select : {
      firstName : true,
      lastName : true
    }
  },
  createdAt : true
};
