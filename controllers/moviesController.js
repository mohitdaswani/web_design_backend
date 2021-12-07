const movieSchema = require("../models//movies");
const SubscribeSchema = require("../models/subscriptionPlans");
module.exports = {
  get: {
    async getAllMovies(req, res) {
      const allMovies = await movieSchema.find();
      res.json({ statusCode: 200, movies: allMovies });
    },
    async singleMovie(req, res) {
      try {
        const user = req.user;
        const { movieId } = req.params;
        const { watched } = req.body;
        const movie = await movieSchema.find({ _id: movieId });
        movie[0].trending += 1;
        await movie[0].save();
        if (movie[0].isPaid === false)
          return res.json({ statusCode: 201, movie: movie[0] });
        else {
          const subscription = await SubscribeSchema.find({ userId: user.id });
          if (subscription.length > 0) {
            if (
              new Date(
                subscription[subscription.length - 1].planExpiryDate
              ).getTime() >= Date.now()
            ) {
              res.json({ statusCode: 201, movie: movie[0] });
            } else
              return res.json({
                status: "failed",
                error: "please Resubscribe the premium plan",
              });
          } else
            return res.json({
              status: "failed",
              error: "please subscribe the premium plan",
            });
        }
      } catch (err) {
        console.log(err);
        res.send("server Error");
      }
    },
    async search_movie(req, res) {
      try {
        const value = req.query.value;
        console.log(value);
        const movie = await movieSchema.find({
          MovieName: { $regex: value, $options: "i" },
        });
        console.log(movie);
        res.json({ statusCode: 201, movies: movie });
      } catch (err) {
        console.log(err);
        return res.json("Server Error");
      }
    },
    async getMovieByLanguage(req, res) {
      try {
        const { language } = req.params;
        console.log(language);
        const Allmovies = await movieSchema.find({ language });
        res.json({ statusCode: 201, movies: Allmovies });
      } catch (err) {
        console.log(err);
        res.send("serverError");
      }
    },
    async fetchTrendingMovies(req, res) {
      try {
        const movies = await movieSchema.find({}).sort({ trending: -1 });
        res.json({ statusCode: 201, movies });
      } catch (err) {
        console.log(err);
        res.send("serverError");
      }
    },
    async fetchTopRatedMovies(req, res) {
      try {
        const movies = await movieSchema.find({}).sort({ rating: -1 });
        res.json({ statusCode: 201, movies });
      } catch (err) {
        console.log(err);
        res.send("serverError");
      }
    },
    async fetchLatestMovies(req, res) {
      try {
        const movies = await movieSchema.find({}).sort({ createdAt: 1 });
        res.json({ statusCode: 201, movies });
      } catch (err) {
        console.log(err);
        res.send("serverError");
      }
    },
    async fetchNetflixOriginalMovies(req, res) {
      try {
        const user = req.user;
        // if (user.isPaid === true) {
        const movies = await movieSchema
          .find({ isPaid: true })
          .sort({ trending: -1 });
        res.send({ statusCode: 201, movies });
        // } else
        //   return res.json({
        //     statusCode: 400,
        //     message: "please subscribe the premium plan",
        //   });
      } catch (err) {
        console.log(err);
        res.send("serverError");
      }
    },
    async getMovieByGenre(req, res) {
      const { genres } = req.params;
      const movies = await movieSchema.find({});
      const filteredMovies = await movies.filter(movie => {
        return movie.genre[genres] === true;
      });
      res.json({ statusCode: 201, movies: filteredMovies });
    },
  },
};
