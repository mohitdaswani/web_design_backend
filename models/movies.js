let mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Genre object needs to have the sub groups passed as an object with key value pair
let movieSchema = new Schema(
  {
    MovieName: { type: String },
    title: { type: String },
    description: { type: String },
    language: { type: String },
    posterImage: { type: Object },
    backgroundImage: { type: Object },
    movie: { type: Object },
    isReleased: { type: Boolean, default: 0 },
    country: { type: String },
    isPaid: { type: Boolean },
    releasedDate: { type: Date },
    trending: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    runTime: { type: Number },
    isAdult: { type: Boolean, default: 0 },
    genre: { type: Object },
  },
  { timestamps: true }
);
const movies1 = mongoose.model("movies", movieSchema);

module.exports = movies1;
