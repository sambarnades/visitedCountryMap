import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  host: "localhost",
  user: "postgres",
  database: "world",
  password: "postgres",
  port: 5432
})

db.connect()


// let countries = [];



let visitedCountries = [];




app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.

  const results = await db.query("SELECT visited_countries FROM visited_countries") // Query
  console.log("There are " + results.rows.length + " entries.")                     // Control

  results.rows.forEach(row => {                                                     // Push the strings in the array
    visitedCountries.push(row.visited_countries);
  });

  res.render("index.ejs", {                                                         // Rendering
    countries: visitedCountries,
    total: results.rows.length
  })

console.log(visitedCountries)                                                       // Control

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});