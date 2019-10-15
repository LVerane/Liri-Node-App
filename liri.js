require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var userRequest = process.argv[2];
var userSearch = process.argv.slice(3).join("+");

var resultArtistName;
function fixName(lowerName) {
    var artistName = [];
    lowerName = lowerName.split("+")
    for (var i = 0; i < lowerName.length; i++) {
        artistName[i] = lowerName[i].charAt(0).toUpperCase() + lowerName[i].slice(1);
    }
    resultArtistName = artistName.join(" ");
}


if (userRequest === "html-this") {
    function action(textToPrint) {
        fs.appendFile("index.html", "<p>" + textToPrint + "</p>", function () { })
        fs.appendFile("log.txt", textToPrint + ",\n", function () { })
    }

} else {
    function action(textToPrint) {
        console.log(textToPrint)
        fs.appendFile("log.txt", textToPrint + ",\n", function () { })
    }
}

fs.appendFile("log.txt", "user input was " + process.argv.slice(2).join(" ") + ",\n", function () { })
action("------------------------------------------");
baseSwitch();

var htmlMode;

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

        case "html-this":
            html();
            break;

        case undefined:
            instructions();
            break;

        default:
            console.log("This is not an artsy thing")
            break;
    }
}

function instructions() {
    action("Enter 'concert-this' and a band/artist name to get information on their upcoming shows")
    action("Enter 'spotify-this-song' and a song name to get information on it")
    action("Enter 'movie-this' and a movie title to get information on it")
    action("Enter 'do-what-it-says' for a surprise")
    action("No quotes are needed, and you may enter only the first command for a default result")
    action("You may use 'html-this' before any other command to have the response be a html file you can open in the browser instead of console.logs")
    if (htmlMode) {
        closeHtml()
    }
}

function html() {
    fs.writeFile("index.html", "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='ie=edge'><title>Document</title></head><body>", function () { })
    userRequest = process.argv[3];
    userSearch = process.argv.slice(4).join("+")
    htmlMode = true;
    baseSwitch();
}

function closeHtml() {
    fs.appendFile("index.html", "</body></html>", function () { })
    console.log("index.html successfully created. Open from folder")
}

function concert() {
    if (userSearch === "") {
        userSearch = "maroon+5";
    }
    fixName(userSearch);
    var queryUrl = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp"
    axios.get(queryUrl).then(
        function (response) {
            action("Upcoming " + resultArtistName + " shows")
            for (var i = 0; i < 10 && i < response.data.length; i++) {
                action("Venue: " + response.data[i].venue.name)
                if (response.data[i].venue.region === "") {
                    action("Venue location: " + response.data[i].venue.country + ", " + response.data[i].venue.city)
                } else {
                    action("Venue location: " + response.data[i].venue.country + ", " + response.data[i].venue.region + ", " + response.data[i].venue.city)
                }
                var date = response.data[i].datetime
                action("Date: " + moment(date).format("MM/DD/YYYY"))
                action("------------------------------------------")
            }
            if (htmlMode) {
                closeHtml()
            }
        }
    )
}

function spotifySong() {
    if (userSearch === "") {
        userSearch = "the+sign+us+album";
    }
    spotify.search({ type: 'track', query: userSearch, limit: 1 }, function (err, data) {
        if (err) {
            return action('Error occurred: ' + err);
        }
        var inputName = data.tracks.items[0].artists[0].name
        fixName(inputName);
        action("Artist name: " + resultArtistName);
        action("Song name: " + data.tracks.items[0].name);
        action("Preview link: " + data.tracks.items[0].external_urls.spotify);
        action("Album: " + data.tracks.items[0].album.name);
        if (htmlMode) {
            closeHtml()
        }
    });
}

function movie() {
    if (userSearch === "") {
        userSearch = "mr+nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userSearch + "&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            action("Title: " + response.data.Title);
            action("Year of release: " + response.data.Year);
            action("IMDB rating: " + response.data.imdbRating);
            action(response.data.Ratings[1].Source + " rating: " + response.data.Ratings[1].Value);
            action("Country: " + response.data.Country);
            action("Language: " + response.data.Language);
            action("Plot: " + response.data.Plot);
            action("Actors: " + response.data.Actors);
            console.log(htmlMode)
            if (htmlMode) {
                closeHtml()
            }
        }
    )
}

function random() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return action(error);
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