Movie API Readme This Movie API provides endpoints to manage a movie database, allowing users with appropriate roles to perform CRUD operations on movie entries. The API is built using Express.js and MongoDB as the database.

Endpoints

Get Movies Endpoint: GET /movies Description: Retrieve a list of movies based on various parameters like page, limit, search, genre, and sorting. Query Parameters: page: Page number for pagination (default: 1) limit: Number of movies per page (default: 5) search: Search term for movie names sort: Sorting criteria (default: "rating") genre: Movie genre (default: "All") Response: JSON containing a paginated list of movies, total count, current page, limit, available genres, and an error flag.

Get Movie by ID Endpoint: GET /movies/:id Description: Retrieve details of a specific movie by its ID. Path Parameter: id: Movie ID Response: JSON containing movie details or an error message if the movie is not found.

Add Movie Endpoint: POST /movies Description: Add a new movie to the database (requires "admin" role). Request Body: Movie data including name, genre, rating, etc. Response: JSON containing a success message, new movie details, or an error if the user lacks admin privileges.

Update Movie Endpoint: PUT /movies/:id Description: Update information for an existing movie (requires "admin" role). Path Parameter: id: Movie ID Request Body: Updated movie data Response: JSON containing a success message, updated movie details, or an error if the movie is not found or the user lacks admin privileges.

Delete Movie Endpoint: DELETE /movies/:id Description: Delete a movie from the database (requires "admin" role). Path Parameter: id: Movie ID Response: JSON containing a success message, deleted movie details, or an error if the movie is not found or the user lacks admin privileges.

Authentication The API requires proper user authentication, and certain endpoints are restricted to users with the "admin" role. Unauthorized access to these endpoints will result in a 403 Forbidden response.

Error Handling In case of any errors or internal server issues, the API responds with a 500 Internal Server Error status along with an error message.
