const { get, post, put, delete1 } = require("../controllers/AdminController");
const { Router } = require("express");
//requiring and setting up multer
// const upload = require("../utils/multer")
const multer = require("multer");
// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const router = Router();
router.post("/admin/login", post.login_admin);
router.post(
  "/admin/addMovie",
  upload.fields([
    {
      name: "posterImage",
      maxCount: 1,
    },
    {
      name: "backgroundImage",
      maxCount: 1,
    },
    {
      name: "movie",
      maxCount: 1,
    },
  ]),
  post.add_movie
);
console.log("Im here");
//router.put("/admin/editMovie",put.edit_movie);
try{router.get("admin/getAll",get.getAllMovies);}
catch(err)
{
  console.log(err);
}
try{router.delete("/admin/deleteMovie", delete1.delete_movie);}
catch(err){
  console.log("I dont know why");
}

router.delete("/admin/logout", delete1.logout_admin);
module.exports = router;
