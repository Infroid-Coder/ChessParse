let input = document.getElementById("username");
let trigger = document.getElementById("fetch-btn");
let ratingOutputs = document.querySelectorAll("#rating-card");
let buffer = document.getElementById("buffer-btn");

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
    return rObj;
}
function popupOpen(text=""){
    if(typeof text !== "string" || text === "") return;
    let popupBox = document.getElementById('popup');
    let popupText = document.getElementById('popup-content');

    popupText.innerHTML = text;
    popupBox.style.animationName = "popup-in";
    popupBox.style.animationDuration = ".5s";
    popupBox.style.display = "block";
    popupBox.onanimationend = () => {
        popupBox.animationName = "";
        popupBox.onanimationend = undefined;
    }
    setTimeout(() => {
        popupClose();
    }, 3300)
}
function popupClose(){
    let popupBox = document.getElementById('popup');
    let popupText = document.getElementById('popup-content');
    popupBox.style.animationName = "popup-out";
    popupBox.style.animationDuration = ".3s";
    popupBox.onanimationend = () => {
        popupBox.style.display = "none";
        popupBox.animationName = "";
        popupBox.onanimationend = undefined;
    }
}

input.addEventListener("keydown",(e) => {
    if(e.key === " "){
        e.preventDefault();
        input.value += "_";
    } else if(e.key === "Enter"){
        trigger.click();
    }
})

trigger.onclick = () => {
    trigger.style.display = "none";
    buffer.style.display = "inline-block";
    for(let i = 0; i < ratingOutputs.length; i++){
        ratingOutputs[i].children[1].innerText = "---"
        ratingOutputs[i].children[1].style.color = "#093a3e"
    }
    fetch("/",{
        method: "post",
        headers: {
            "Accept" : "application/json",
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            reqType: "ratingInfo",
            username: input.value
        })
    })
    .then(val => {return val.json()})
    .then((vars) => {
        if(vars.error){
            console.log("Error fetching the information. Please try again!");
            alert("Error fetching the information. Please try again!");
            trigger.style.display = "inline-block";
            buffer.style.display = "none";
        } else{
            for(let i = 0; i < ratingOutputs.length; i++){
                let ratingObj = vars[ratingOutputs[i].children[0].innerText.toLowerCase()];
                ratingOutputs[i].children[1].style.color = "#64e9ee";
                ratingOutputs[i].children[1].style.userSelect = "auto";
                ratingOutputs[i].children[1].innerText = (ratingObj === null) ? "Unrated" : ratingObj.rating;
            }
            trigger.style.display = "inline-block";
            buffer.style.display = "none";
        }
    })
}
