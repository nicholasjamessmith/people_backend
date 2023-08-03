//Backend setup for fullstack application using Express for backend and React for front end
//Import our dependencies
//Read our .env file and create environmetal variables
require("dotenv").config();
//Pull PORT from .env, give default value
//const PORT = process.env.PORT || 8000
const { PORT = 8000, DATABASE_URL } = process.env
//Import express
const express = require("express");
//Create application object
const app = express()
//Import mongoose
const mongoose = require("mongoose")
//Import cors
const cors = require("cors")
//Import morgan
const morgan = require("morgan")

//Database connection
//Establish connection
mongoose.connect(DATABASE_URL)

//Connection events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error))

//Models
//models = PascalCase, singular "People"
//collection = tables, =snake_case, plural "peoples"
const peopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
})

const People = mongoose.model("People", peopleSchema)
//Middlewware
//cors for preventing cors erros (allows all the reqests from other origins)
app.use(cors())
//morgan for logging requests
app.use(morgan("dev"))
//Express functionality to recogize incmoing request objects as JSON objects
app.use(express.json())

//Routes
// "/people"
//INDUCES - INDEX, xNEWx, DELETE, UPDATE, CREATE, xEDITx, SHOW
//IDUCS - INDEX, DESTROY, UPDATE, CREATE, SHOW, (FOR AN JSON API)

//INDEX - GET /people - gets all people
app.get("/people", async (req, res) => {
  try {
    //fetch all people from the database, .find built in function to "People", pass empty object to return all people
    const people = await People.find({})
    //send json of all people
    res.json(people);
  } catch (error) {
    // send error as JSON
    res.status(400).json({ error })
  }
})

//CREATE - POST /people - create a new person
app.post("/people", async (req, res) => {
  try {
    //create the new person
    const person = await People.create(req.body)
    //send newsly created person as JSON
    res.json(person)
  }
  catch (error) {
    res.status(400).json({ error })
  }
})

//SHOW - GET /people/:id - get a single person
app.get("/people/:id", async (req, res) => {
  try {
    //get a person from the database
    const person = await People.findById(req.params.id);
    //return the person as json
    res.json(person);
  } catch (error) {
    res.status(400).json({ error });
  }
});

//UPDATE - PUT - /people/:id - update a single person
app.put("/people/:id", async (req, res) => {
  try {
    //update the person
    const person = await People.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    //send the updated person as json
    res.json(person);
  } catch (error) {
    res.status(400).json({ error });
  }
});

//DESTROY - DELETE - /people/:id - delete a single person
app.delete("/people/:id", async (req, res) => {
  try {
    //delete the person
    const person = await People.findByIdAndDelete(req.params.id)
    //send deleted person as json
    res.status(204).json(person)
  } catch (error) {
    res.status(400).json({ error });
  }
})

//Create a test route
app.get("/", (req, res) => {
  res.json({ hello: "world" })
})

//Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
