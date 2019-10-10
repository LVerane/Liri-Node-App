require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var moment = require('moment');

var userRequest = process.argv[2];
var userSearch  = process.argv.slice(3).join("+");

switch (userRequest) {
    case "concert-this":
        concert();
        break;

    // case "spotify-this-song":
    //     //function
    //     break;

    // case "movie-this":
    //     //function
    //     break;

    // case "do-what-it-says":
    //     //function
    //     break;

    default:
        console.log("This is not an artsy thing")
        break;
}

function concert(){
    var queryUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp"
    axios.get(queryUrl).then(
        function(response) {
            for(var i=0; i<10; i++){
            // console.log(response.data[i])
            console.log(response.data[i].venue.name)

            console.log("test " + i)
            }
        })
}

