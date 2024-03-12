const router = require("express").Router();
const Movie = require("../models/movie");
const User = require("../models/user");
const movies = require("../config/movies.json");
const users = require("../config/user.json");

router.get("/movies", async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let genre = req.query.genre || "All";

    const genreOptions = [
      "Action",
      "Romance",
      "Fantasy",
      "Drama",
      "Crime",
      "Adventure",
      "Thriller",
      "Sci-fi",
      "Music",
      "Family",
    ];

    genre === "All"
      ? (genre = [...genreOptions])
      : (genre = req.query.genre.split(","));
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
      .where("genre")
      .in([...genre])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Movie.countDocuments({
      genre: { $in: [...genre] },
      name: { $regex: search, $options: "i" },
    });

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      genres: genreOptions,
      movies,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// const insertMovies = async () => {
//     try {
//         const docs = await Movie.insertMany(movies);
//         return Promise.resolve(docs);
//     } catch (err) {
//         return Promise.reject(err)
//     }
// };

// insertMovies()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))

// const insertUsers = async () => {
//   try {
//     const docs = await User.insertMany(users);
//     return Promise.resolve(docs);
//   } catch (err) {
//     return Promise.reject(err);
//   }
// };

// insertUsers()
//   .then((docs) => console.log(docs))
//   .catch((err) => console.log(err));

// Endpoint to get a movie by its ID
router.get("/movies/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: true, message: "Movie not found." });
    }

    res.status(200).json({ error: false, movie });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

//endpoint to add a new movie to the lobby (requires "admin" role)
router.post("/movies", async (req, res) => {
  // Check if user has "admin" role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: true,
      message: "Permission denied. Requires admin role.",
    });
  }

  try {
    const newMovieData = req.body; // Assuming the request body contains movie data
    const newMovie = await Movie.create(newMovieData);

    res.status(201).json({
      error: false,
      message: "Movie added successfully.",
      movie: newMovie,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error." });
  }
});

// //endpoint to update an existing movie's information (requires "admin" role)
router.put("/movies/:id", async (req, res) => {
  // Check if user has "admin" role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: true,
      message: "Permission denied. Requires admin role.",
    });
  }

  try {
    const movieId = req.params.id;
    const updatedMovieData = req.body; // Assuming the request body contains updated movie data

    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      updatedMovieData,
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: true, message: "Movie not found." });
    }

    res.status(200).json({
      error: false,
      message: "Movie updated successfully.",
      movie: updatedMovie,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error." });
  }
});
//endpoint to delete a movie from the lobby (requires "admin" role)
router.delete("/movies/:id", async (req, res) => {
  // Check if user has "admin" role, you may implement this based on your authentication logic
  // Example: if (!userHasAdminRole(req.user)) { return res.status(403).json({ error: true, message: "Permission denied." }); }
  try {
    const movieId = req.params.id;

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return res.status(404).json({ error: true, message: "Movie not found." });
    }

    res.status(200).json({
      error: false,
      message: "Movie deleted successfully.",
      movie: deletedMovie,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error.." });
  }
});
module.exports = router;
