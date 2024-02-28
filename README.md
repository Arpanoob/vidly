Api Contract


info:
  title: vidly (Movie renting ,adding,returning )
  description: A movie renting with JWT Authenication API .
  version: 1.0.0
  routes:
  /api/genres
  /api/customer
  /api/movies
  /api/rentals
  /api/user
  /api/auth
  /api/returns
servers:
  - url: https://vidly-ypxh.onrender.com/api




    paths:


  /api/genres:
    get:
      summary: Get all genres
      operationId: getUsers
      responses:
        '200':
          description: A list of genres
          content:
            application/json:
              schema:
                type: array
                items:
                  object: 'genres'
        '500':
          description: Internal server error
      
    post:
      summary: Create a new genre
      requestBody:
                    name: 
                    type: String,
                    minlength: 5,
                    maxlength:50,
        required: true
        lenght > 5 and less than 50
      responses:
        '200':
          description: genre created successfully
        '400':
          description: Bad request
        '500':
          description: Internal server error

  /genre/{Id}:
    get:
      summary: Get a genre by ID
      operationId: getgenreById
      parameters:
        - id: genreId
          required: true

      responses:
        '200':
          description: User found
        '404':
          description: User not found
        '500':
          description: Internal server error

    put:
      summary: Update a genre by ID
      operationId: updategenre
      parameters:
        - name: userId
          required: true
      requestBody:
        feild: genre data to be updated
            name: 
        type: String,
        minlength: 5,
        maxlength:50,
        required: true
      responses:
        '200':
          description: User updated successfully
        '400':
          description: Bad request
        '404':
          description: User not found
        '500':
          description: Internal server error

    delete:
      summary: Delete a genre by ID
      parameters:
        - Id
          required: true
          Authorized as admin in JWT token
      responses:
        '204':
          description: User deleted successfully
        '404':
          description: User not found
        '500':
          description: Internal server error


paths:
  /customer:
    get:
      summary: Get all customer
      operationId: getcustomer
      responses:
        '200':
          description: A list of customer
          content:
            application/json:
              schema:
                type: array
        '500':
          description: Internal server error
    put:
      summary: Update a customer by ID
      operationId: updat customer
      parameters:
        - name: userId
          required: true
      requestBody:
        feild: customer data to be updated
        required: true
      responses:
        '200':
          description: User updated successfully
        '400':
          description: Bad request
        '404':
          description: User not found
        '500':
          description: Internal server error

    post:
      summary: Create a new customer
      operationId: createcustomer
      requestBody:
        name(less tha 5 and greater than 50),phone,password(will hashed in backend) 
         isGold: Boolean,
            name: {
              type: String,
              required: true,
              minlength: 5,
              maxlength: 10,
            },
            phone: {
              type: Number,
              minlength: 10,
              maxlength: 10,
              required: true,
            }
        required: true

          
      responses:
        '200':
          description: customer created successfully
          content:
            application/json:
        '401':
        unAuthentic
        '400':
          description: Bad request
        '500':
          description: Internal server error

  /customer/{customerId}:
    get:
      summary: Get a customer by ID
      operationId: getcustomerById
      parameters:
        - name: customerId
      responses:
        '200':
          description: customer found
        '401':
        unAuthentic
        '404':
          description: customer not found
        '500':
          description: Internal server error


    delete:
      summary: Delete a customer by ID
      operationId: deletecustomer
      parameters:
        - name: customerId
      responses:
        '401':
        unAuthentic
        '403':
        forbidden
        '204':
          description: customer deleted successfully
        '404':
          description: customer not found
        '500':
          description: Internal server error


paths:
  /movies:
    get:
      summary: Get all movies
      operationId: getmovies
      responses:
        '200':
          description: A list of movies
          content:
            application/json:
              schema:
                type: array
        '500':
          description: Internal server error
    put:
      summary: Update a movies by ID
      operationId: updat movies
      parameters:
        - name: userId
          required: true
      requestBody:
        feild: movies data to be updated
          title: { type: String, required: true, minlength: 5, maxlength: 255 },
            genre: Genre Object Id,
            numberInStock: { type: Number, required: true, min: 0, max: 255 },
            dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
        required: true
      responses:
        '200':
          description: User updated successfully
        '400':
          description: Bad request
        '404':
          description: User not found
        '500':
          description: Internal server error

    post:
      summary: Create a new movies
      operationId: createmovies
      requestBody:
          title: { type: String, required: true, minlength: 5, maxlength: 255 },
            genre: Genre Object Id,
            numberInStock: { type: Number, required: true, min: 0, max: 255 },
            dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
        required: true
        
          
      responses:
        '200':
          description: movies created successfully
          
        '401':
        unAuthentic
        '400':
          description: Bad request
        '500':
          description: Internal server error

  /movies/{moviesId}:
    get:
      summary: Get a movies by ID
      operationId: getmoviesById
      parameters:
        - name: moviesId
      responses:
        '200':
          description: movies found
        '401':
        unAuthentic
        '404':
          description: movies not found
        '500':
          description: Internal server error

    
    /movies/id:
    delete:
      summary: Delete a movies by ID
      operationId: deletemovies
      parameters:
        - name: moviesId
      responses:
        '401':
        unAuthentic
        '403':
        forbidden
        '204':
          description: movies deleted successfully
        '404':
          description: movies not found
        '500':
          description: Internal server error


   
    paths:
  /api/rentals:
    get:
      summary: Get all rentals
      operationId: getUsers
      responses:
        '200':
          description: A list of rentals
          content:
            application/json:
              schema:
                type: array
                items:
                  object: 'rentals'
        '500':
          description: Internal server error
       



   paths:
       /api/rentals

    post:
      summary: add return date in rental and add return date and calculate feee
      requestBody:
        description: genre data to be created
        customerId: objectIdrequired,
        movieId: objectIdrequired,
        required: true
        lenght > 5 and less than 50)
      responses:
        '200':
          description: genre created successfully
        '400':
          description: Bad request
        '500':
          description: Internal server error

paths:
  /users:
    get:
      summary: Get all users
      operationId: getUsers
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
        '500':
          description: Internal server error
/api/users
    post:
      summary: Create a new user
      operationId: createUser
      requestBody:
        name(less tha 5 and greater than 50),phone,password(will hashed in backend) 
        required: true
name: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: { type: Boolean, default: false },
          
      responses:
          JWT with payload id and isAdmin Property

        '200':
          description: User created successfully
          content:
            application/json:
        '400':
          description: Bad request
        '500':
          description: Internal server error

  /users/{userId}:
    get:
      summary: Get a user by ID
      operationId: getUserById
      parameters:
        - name: userId
      responses:
        '200':
          description: User found
        '401':
        unAuthentic
        '404':
          description: User not found
        '500':
          description: Internal server error


    delete:
      summary: Delete a user by ID
      operationId: deleteUser
      parameters:
        - name: userId
      responses:
        '401':
        unAuthentic
        '403':
        forbidden
        '204':
          description: User deleted successfully
        '404':
          description: User not found
        '500':
          description: Internal server error

/api/auth/


paths:
  /users:
    get:
      summary: Get all users
      operationId: getUsers
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
        '500':
          description: Internal server error

    post:
      summary: Create a new user
      operationId: createUser
      requestBody:
        name(less tha 5 and greater than 50),phone,password(will hashed in backend) 
        required: true
    email: string().min(5).max(255).required().email()
        password: .string().min(5).max(255).required(),

          
      responses:
        '200':
          description: User created successfully
          JWT with payload id and isAdmin Property
          content:
            application/json:
        '400':
          description: Bad request
        '500':
          description: Internal server error
