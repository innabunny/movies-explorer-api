const movieSchema = require('../models/movie');

const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

module.exports.getMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  movieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы неккоректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  movieSchema.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundErr('Фильм не найден');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenErr('Вы не можете удалять чужие фильмы');
      }
      return movie.remove();
    })
    .then(() => {
      res.send({ message: 'Фильм успешно удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Неккоректный id фильма'));
      } else {
        next(err);
      }
    });
};
