const movieRouter = require('express').Router();
const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const { validateAddMovie, validateDeleteMovie } = require('../middlewares/validation');

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateAddMovie, addMovie);
movieRouter.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = movieRouter;
