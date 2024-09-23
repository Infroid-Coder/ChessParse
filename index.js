const server = require("./modules/server");
const fs = require("fs");
const url = require("url");
const path = require("path");
const { execSync } = require("child_process");

function chessParse(jsonCont){
    let stats = jsonCont.stats // get the statistics for the different playing formats
    let rObj = { // initialize the return object
        username: jsonCont.username,
        daily: null,
        rapid: null,
        blitz: null,
        bullet: null,
        puzzles: null
    };
    // go through each format and insert the necessary information into the return object
    for(let i = 0; i < stats.length; i++){
        let iStats = stats[i].stats; // declare a variable with the stats for the current format
        let pushKey = null; // declare a variable to hold the keyname to be updated
        switch(stats[i].key){ // setup a switch to check which format is currently being considered
            case 'chess': // if it is 'chess' (daily)...
                pushKey = "daily"; // update the 'pushKey' variable to 'daily'
                break;
            case 'rapid': // if it is 'rapid'...
                pushKey = "rapid"; // update the 'pushKey' variable to 'rapid'
                break;
            case 'lightning': // if it is 'lightning'...
                pushKey = "blitz"; // update the 'pushKey' variable to 'blitz'
                break;
            case 'bullet': // if it is 'bullet'...
                pushKey = "bullet" // update the 'pushKey' variable to 'bullet'
                break;
            case 'tactics': // if it is 'tactics'...
                pushKey = "puzzles" // update the 'pushKey' variable to 'puzzles'
                break;
        }
        rObj[pushKey] = {
            rating: iStats.rating, // set the 'rating' property to the current rating
            highestRating: iStats.highest_rating // set the 'highestRating' property to the highest rating of the member
        }
    }
    return rObj; // return the prepared object
}

let s1 = server.newServer("localhost",1344,() => {}); // initialize the server

s1.addRoute("/",(req,res) => { // setup the route '/'
    if(req.method === "GET"){  // if the request is a GET request...
        res.end(fs.readFileSync("./src/index.html")); // send the 'index.html' file as a response
    } else if(req.method === "POST"){ // if the request is a POST request...
        let body = ""; // declare a variable named 'body' with an empty string as the value
        req.on("data",(chunk) => { // when data is received from the request...
            body += chunk; // whenever a chunk is received, insert that to the body
        });
        req.on("end",() => { // when the request is finally over...
            let data = JSON.parse(body); // parse the JSON in the 'body' variable and set it as the value of the 'data' variable
            let username = data.username.toLowerCase(); // get the 'username' property from the data
            let uUrl = `https://www.chess.com/callback/member/stats/${username}`; // construct the url by inserting the username in to the template url
            fetch(uUrl) // fetch data from the constructed url
            .then(val => {return val.json()}) // get the JSON data from the response
            .then(json => {
                if(!json.message){ // if there's no 'message' property in the response...
                    json.username = path.parse(url.parse(uUrl).path).name; // add a new property to the response object name 'username' and set its value to the requested username
                    let parsedInfo = chessParse(json); // pass the received response to the 'chessParse' function to get the relevant info
                    res.end(JSON.stringify(parsedInfo)); // send the parsed information as the response
                } else{ // otherwise... (a 'message' property is found)
                    res.end(JSON.stringify(({error: `Acess Refused: Unable to fetch information about '${username}'`}))); // send an object containing an error as the response
                }
            }).catch(err => { // if there's any error in fetching the data...
                res.end(JSON.stringify(({error: `Fetch Error: Unable to fetch information about '${username}'`}))); // send an object containg an error as the response
                console.log(err) // log the error to the console
            });
        });
    }
});
s1.addRoute("/style.css",(req,res) => { // setup the route '/style.css'
    res.end(fs.readFileSync("./src/style.css")); // send the 'style.css' file from the 'src' folder as the response
})
s1.addRoute("/script.js",(req,res) => { // setup the route '/script.js'
    res.end(fs.readFileSync("./src/script.js")); // send the 'script.js' file from the 'src' folder as the response 
})
s1.addRoute("/logo.png",(req,res) => { // setup the route '/logo.png'
    res.end(fs.readFileSync("./src/logo.png")); // send the 'logo.png' file from the 'src' folder as the response 
})
s1.addRoute("/fonts/Astonpoliz.ttf",(req,res) => { // setup the route 'fonts/style.css'
    res.end(fs.readFileSync("./src/fonts/Astonpoliz.ttf")); // send the 'Astonpoliz.ttf' file from the 'src/fonts' folder as the response 
})
s1.addRoute("/fonts/blissfulthinking.otf",(req,res) => { // setup the route 'fonts/style.css'
    res.end(fs.readFileSync("./src/fonts/blissfulthinking.otf")); // send the 'blissfulthinking.ttf' file from the 'src/fonts' folder as the response
})

s1.start() // start the server

execSync(`start http://localhost:${s1.port}`) // open the localhost url in the browser (remove this line if you don't want to automatically open the page in the browser);