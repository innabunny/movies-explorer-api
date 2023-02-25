const userRouter = require('express').Router();
const {
  getUser, updateUser,
} = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

userRouter.get('/users/me', getUser);
userRouter.patch('/users/me', validateUpdateUser, updateUser);

module.exports = userRouter;
