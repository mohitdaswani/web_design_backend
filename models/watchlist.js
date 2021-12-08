let mongoose = require("mongoose");

const Schema = mongoose.Schema;
let watchlistSchema = new Schema({
  userId: { type: String, trim: true, required: true },
  movieId: { type: String },
});
const watchlist = mongoose.model("watchlist", watchlistSchema);

module.exports = watchlist;
