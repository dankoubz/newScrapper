var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Port Number
var PORT = 3000;

// Initialize Express
var app = express();

// HandleBars View Engine
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Mongo Database
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/dandanNews";
mongoose.connect(MONGODB_URI);

// Routes

// Render Page
app.get('/', (req, res) => {
    res.render('index');
});

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {

    // First, we grab the body of the html with axios
    axios.get("https://www.smh.com.au/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

		// ._2XVos
        // Now, we grab every h2 within an article tag, and do the following:
        $("._15r1L").each(function(i, element) {
            // Initialise Variable for Looped Element
            var articleErrors = new Array();

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
			result.title = $(this).children("._1YzQk").children("._2XVos").text();
			result.link = $(this).children("._1YzQk").children("._2XVos").children("a").attr("href");
			result.snippet = $(this).children("._1YzQk").children("._3XEsE").text();
			result.cat = $(this).children("._1YzQk").children("._3XK8N").text();
			result.image = $(this).children("figure.XmCQH").children("a").children("div._1hWPs").children("picture").children("img._1MQMh").attr("src");
            result.saved = false;
            
            // Validate the Article
            if ( !result.title )
                articleErrors.push("Missing Title");
            if ( !result.link )
                articleErrors.push("Missing Link");
            if ( !result.snippet )
                articleErrors.push("Missing Snippet");
            if ( !result.cat )
                articleErrors.push("Missing Cat");
            if (!result.image )
                articleErrors.push("Missing Image");

            if ( articleErrors.length ){
                console.error("Invalid Article: "+articleErrors.join(", "));
            } else {
                // Check if Article already exists with Same Link Attribute
                db.Article.find({ link: result.link })
                    .then(function(dbArticle) {

                        // If No Existing Article is Found - Create One
                        if(dbArticle.length == 0){
                            // Create a new Article using the `result` object built from scraping
                            db.Article.create(result)
                                .then(function(dbArticle) {
                                    // View the added result in the console
                                    console.log(dbArticle);
                                    /*
                                    db.Article.find({})
                                        .then(function(dbArticle) {
                                            // If we were able to successfully find Articles, send them back to the client
                                            // res.json(dbArticle);
                                            // console.log("Adding an article to the Output");
                                        })
                                        .catch(function(err) {
                                            // If an error occurred, send it to the client
                                            console.error(err);
                                        });
                                    */
                                })
                                .catch(function(err) {
                                    // If an error occurred, log it
                                    console.error(err);
                                });
                        }

                    })
                    .catch(function(err) {
                        console.log("2: Catch");
                        //Oops
                    });

            }
           
        });

        // db.Article.collection.drop();
        db.Article.collection.deleteMany({ saved: false },{ skip:20 , sort: { _id: "desc" } } );
        
        // res.json("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/saved", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.find({ saved: true })
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/saved/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    // db.Article.create(req.body)
    db.Article.findOneAndUpdate({ _id: req.params.id } , { saved: true })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json("3: " + dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});