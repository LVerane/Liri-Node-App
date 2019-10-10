require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var moment = require('moment');

var userRequest = process.argv[2];
var userSearch = process.argv.slice(3).join("+");

var artistName = [];
var userArtistName;
var resultArtistName;
function fixName() {
    userArtistName = userSearch.split("+")
    for (var i = 0; i < userArtistName.length; i++) {
        artistName[i] = userArtistName[i].charAt(0).toUpperCase() + userArtistName[i].slice(1);
    }
    resultArtistName = artistName.join(" ");
    console.log(resultArtistName)
}

//

console.log("------------------------------------------")

baseSwitch();

function baseSwitch() {
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
}

function concert() {
    fixName();
    var queryUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp"
    console.log(queryUrl)
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
    console.log(userSearch)
    // var queryUrl = "https://api.spotify.com/v1/search?q=" + userSearch + "&type=artist"
    // axios.get(queryUrl).then(
    //     function (response) {
    //         console.log(response)
    //     }
    // )
}

function movie() {
    if (userSearch === "") {
        userSearch = "mr+nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userSearch + "&apikey=trilogy";
    console.log(queryUrl)
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
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var randomPosition = Math.floor(Math.random() * 3)//0, 1, 2
        var position = randomPosition * 2;//0, 2, 4

        var dataArr = data.split(",");

        userRequest = dataArr[position]
        userSearch = dataArr[position + 1]
        userSearch = userSearch.slice(1, userSearch.length - 1)
        userSearch = userSearch.replace(/ /gi, "+")
        baseSwitch();
    })
}


fs.appendFile("log.txt", "userRequest was " + userRequest + ",\n" + "userSearch was " + userSearch + ",\n", function(err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Content Added!");
  }
});