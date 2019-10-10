require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var moment = require('moment');

var userRequest = process.argv[2];
var userSearch = process.argv.slice(3).join("+");

//for bands in town
var userArtistName = [];
for (var i = 3; i < process.argv.length; i++) {
    userArtistName[i - 3] = process.argv[i].charAt(0).toUpperCase() + process.argv[i].slice(1);
}
var resultArtistName = userArtistName.join(" ");

console.log("------------------------------------------")

switch (userRequest) {
    case "concert-this":
        concert();
        break;

    case "spotify-this-song":
        spotifySong();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        random();
        break;

    default:
        console.log("This is not an artsy thing")
        break;
}

function concert() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp"
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data[1])
            console.log("Upcoming " + resultArtistName + " shows")
            for (var i = 0; i < 10; i++) {
                // console.log(response.data[i])
                console.log("Venue: " + response.data[i].venue.name)
                if (response.data[i].venue.region === "") {
                    console.log("Venue location: " + response.data[i].venue.country + ", " + response.data[i].venue.city)
                } else {
                    console.log("Venue location: " + response.data[i].venue.country + ", " + response.data[i].venue.region + ", " + response.data[i].venue.city)
                }
                var date = response.data[i].datetime
                console.log("Date: " + moment(date).format("MM/DD/YYYY"))
                console.log("------------------------------------------")
            }
        }
    )
}

function spotifySong() {
    console.log("spotify is not yet implemented")
    // var queryUrl = "https://api.spotify.com/v1/search?q=" + userSearch + "&type=artist"
    // axios.get(queryUrl).then(
    //     function (response) {
    //         console.log(response)
    //     }
    // )
}

function movie() {
    if(userSearch === ""){
        userSearch = "mr+nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userSearch + "&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data);
            console.log("Title: " + response.data.Title);
            console.log("Year of release: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log(response.data.Ratings[1].Source + " rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    )
}

function random() {
    console.log("random is not yet implemented")
}