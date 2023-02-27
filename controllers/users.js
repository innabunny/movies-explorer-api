const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const userSchema = require('../models/user');

const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');
const AuthErr = require('../errors/AuthErr');

const { JWT_SECRET = config.JWT_KEY } = process.env;

module.exports.getUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundErr('Такого пользователя не существует');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  userSchema.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundErr('Такого пользователя не существует');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы неккоректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  //
  // userSchema.findOne({ email })
  //   .then((user) => {
  //     if (user) {
  //       throw new ConflictErr('Пользователь с таким email уже существует');
  //     }
  bcrypt.hash(password, 10)
    .then((hash) => userSchema.create({
      email, password: hash, name,
    })
      .then((user) => {
        const newUser = user.toObject();
        delete newUser.password;
        res.send(newUser);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestErr('Переданы неккоерктные данные'));
        } else if (err.code === 11000) {
          next(new ConflictErr('пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthErr('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthErr('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          res.send({ token });
        });
    })
    .catch(next);
};
