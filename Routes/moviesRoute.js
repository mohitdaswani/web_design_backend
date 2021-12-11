const { get, post, put, delete1 } = require("../controllers/moviesController");
const { post1, get1 } = require("../controllers/watchListController");
const { Router } = require("express");
const authentication = require("../middlewares/authentication");
const router = Router();
router.get("/allMovies", authentication, get.getAllMovies);
router.get(
  "/movies/netflixOriginals",
  authentication,
  get.fetchNetflixOriginalMovies
);
router.get("/movies/all", get.getAllMovies);
router.get("/movies/topRated", authentication, get.fetchTopRatedMovies);
router.get("/movies/TrendingMovies", authentication, get.fetchTrendingMovies);
router.get("/movies/:genres", authentication, get.getMovieByGenre);
router.get("/user/watchlist", authentication, get1.getUserWatchlist);
router.get("/movie/:movieId", authentication, get.singleMovie);
router.get("/watchList/:movieId", authentication, post1.addToWatchlist);
router.get("/search", authentication, get.search_movie);
router.get("/latest", authentication, get.fetchLatestMovies);
router.get(
  "/movies/language/:language",
  authentication,
  get.getMovieByLanguage
);
module.exports = router;
