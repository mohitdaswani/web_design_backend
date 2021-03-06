let mongoose = require("mongoose");

const Schema = mongoose.Schema;
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
movieSchema.statics.delete_movie = async MovieName => {
  try {
    console.log("inside delete_movie");
    const mov = await movies1.findOneAndDelete({ MovieName:MovieName });
   // mov.MovieName = null;
    mov.save();
    return movies1;
  } catch (err) {
    console.log(err.message);
  }
};
movieSchema.statics.find_all= async function(){
  console.log("inside fina_all");
 const allmovies= await movies1.find();
 return allmovies;
};

const movies1 = mongoose.model("movies", movieSchema);

module.exports = movies1;
