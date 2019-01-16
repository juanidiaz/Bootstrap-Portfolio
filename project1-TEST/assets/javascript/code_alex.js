// VARIABLES --------------------------------------------

//      OBJECTS
var intervalId; // Holds setInterval that runs the stopwatch

//      ARRAYS
var cardsArray = []; // Will hold the URLs fr all cards in te grid
var urlArray = []; // Will hold the URL of card one and card two
var indexArray = []; // Will hold the index of card one and card two

//      STRINGS/CHAR
var userName = ''; // User's name
var userCountry = ''; // User's country name
var mode = ''; // Type of game selected [EASY, TIMED, CHALLENGE]
var firstPick = ""; // Index of the first card picked
var secondPick = ""; // Index of the second card picked

//      NUMBER/INTEGER
var pairs = 2; // Pair of cards that will be in the grid
var tries = 0; // Number of pairs fliped in a game
var timeToBeat = 20; // Time to beat every game
var time = 0; // TIme used to start the timer - comes from timeToBeat
var timeUsed = 0; // Time used to finish the last game
var level = pairs - 1; // Number of games played
var pairsMatched = 0; // Number of pairs matched in a game
var overallTime = 0; // Added time used for the CHALLENGE mode
var overallTries = 0; // Added number of tries used for the CHALLENGE mode

//      BOOLEAN
var timer = false; // The game requires to show and use timer
var challenge = false; // The player is on 'challenge' mode
var finishGame = false; // TRUE if all pairs have been found in a game


// Creating a "player info" object using constructor notation
function playerInfo(playerName, playerCountry, ) {
    this.name = playerName; // Player's name
    this.country = playerCountry; // Player's choice
};

var player = new playerInfo('', ''); // Contains CURRENT player info

// ------------------------------------------------------------
$("#container-leaderboard").hide();

$("#showLeaderboard", "#showLeaderboardInBox", "#showLeaderboardInModalFooter").on("click", function () {
    $("#container-leaderboard").fadeToggle(2000);
});

$("#input-fields").hide();

//--------------------------------------------------------------

$(document).ready(function () {

    // Show the value of all variables
    function allVariablesInfo() {
        console.log('intervalId: ' + intervalId);
        console.log('cardsArray: ' + cardsArray);
        console.log('urlArray: ' + urlArray);
        console.log('indexArray: ' + indexArray);
        console.log('userName: ' + userName);
        console.log('userCountry: ' + userCountry);
        console.log('mode: ' + mode);
        console.log('firstPick: ' + firstPick);
        console.log('secondPick: ' + secondPick);
        console.log('pairs: ' + pairs);
        console.log('tries: ' + tries);
        console.log('timeToBeat: ' + timeToBeat);
        console.log('time: ' + time);
        console.log('timeUsed: ' + timeUsed);
        console.log('level: ' + level);
        console.log('pairsMatched: ' + pairsMatched);
        console.log('overallTime: ' + overallTime);
        console.log('overallTries: ' + overallTries);
        console.log('timer: ' + timer);
        console.log('challenge: ' + challenge);
        console.log('finishGame: ' + finishGame);
        console.log('player: ' + player);
    }

    // Reset variables for a new game
    function freshStart(full) {

        if (full) { // Clear user name and country if TRUE
            userName = "";
            userCountry = "";
        };

        mode = "";
        pairs = 2;
        tries = 0;
        timeToBeat = 20;
        time = 0;
        timeUsed = 0;
        level = 1;
        pairsMatched = 0;
        overallTime = 0;
        overallTries = 0;
        timer = false;
        challenge = false;
        finishGame = false;
    }

    // Start a game
    function startGame(pairs) {

        console.log("Starting level " + level + " in mode " + mode);

        // Setting variables for the TIMED and CHALLENGE modes 
        if (mode === 'timed' || mode === 'challenge') {

            // Calculate level numer based on the number of PAIRS
            level = pairs - 1;

            // Calculate amount of time per game based on the number of PAIRS
            switch (parseInt(pairs)) {
                case 2:
                    timeToBeat = 20;
                    break;

                case 3:
                    timeToBeat = 32;
                    break;

                case 4:
                    timeToBeat = 39;
                    break;

                case 5:
                    timeToBeat = 48;
                    break;

                case 6:
                    timeToBeat = 59;
                    break;

                case 7:
                    timeToBeat = 72;
                    break;

                case 8:
                    timeToBeat = 87;
                    break;

                case 9:
                    timeToBeat = 104;
                    break;

                case 10:
                    timeToBeat = 123;
                    break;
            }

            time = timeToBeat;
        };

        // Get the URL to the GIFs
        getGifURL();

        //Update screen
        updateScreen()
    };

    /*******************************************
     * Randomize array element order in-place. *
     * Using Durstenfeld shuffle algorithm.    *
     *******************************************/
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    // Use the API to get the URL to the GIFs used on the card's front
    function getGifURL() {
        // Empty array with URL of cards
        cardsArray = [];

        //////////////////////// superheroapi ////////////////////////
        const KEY = '10161297457820113';

        var queryURL = `https://cors-anywhere.herokuapp.com/http://superheroapi.com/api.php/${KEY}/search/man`;
        // var queryURL = `https://cors-anywhere.herokuapp.com/http://superheroapi.com/api.php/10161297457820113/search/man`;
        // var queryURL = `http://superheroapi.com/api.php/${KEY}/search/man`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Get the URL to the image into the cardsArray... twice!
            // note to [22,23,50,57] Numbers to avoid(no Imgs)????

            // Built carsArray with URL to character images
            for (let p = 0; p < pairs; p++) {

                // Generate random number between 1 and 63 - to randomize character image
                var index = Math.floor(Math.random() * 63) + 1;

                // Confirm the index is not one of th eones with missing images
                switch (index) {
                    case 22:
                    case 23:
                    case 50:
                    case 57:
                        // Yup... no images for these indexes... try again.

                        //console.log("Selected: " + index + "  Trying again");

                        // Reduce the iteration variable so to get a new value
                        p--;
                        break;

                    default:
                        // For all other cases push the URL to the image into cardsArray... twice! 
                        cardsArray.push(response.results[index].image.url);
                        cardsArray.push(response.results[index].image.url);
                        break;
                }
            }

            // Randomize the positions of the cardsArray
            shuffleArray(cardsArray);

            // Show the BACK of the cards
            displayCards();
        });
        //////////////////////////////////////////////////////////////

    };

    // Show the cards in the board
    function displayCards() {

        // Resize the container of the cards
        switch (parseInt(pairs)) {
            case 2:
                // For 2 pairs only (4 cards)
                var boxWidth = 250;
                break;

            case 3, 4:
                // For 3 pairs (6 cards) and 4 pairs (8 cards)
                var boxWidth = 370;
                break;

            default:
                // For 5 pairs or more
                var boxWidth = 490;
                break;
        }

        //console.log("Pairs: " + pairs + "   Width: " + boxWidth);

        // Set the with of the cards grid
        $("#gifBox").css("width", boxWidth);

        // Remove all the existing cards
        $("#gifs").html("");

        // For each GIF append an element to the DOM
        for (var c in cardsArray) {

            // Create a CARD div
            var cardDiv = $("<div>").addClass("card m-2");

            // Append the character image to the front of the card, but HIDE this image - this to mimic the fact of the card being "facing donw"
            var cardImg = $("<img>").attr("src", cardsArray[c]).attr("id", "frnt" + c).css("display", "none").addClass("staticgif card-img-top").appendTo(cardDiv);

            // Append the image of the back if the card - this to mimic the fact of the card being "facing donw"
            var cardback = $("<img>").attr("src", "./assets/images/card_back.png").attr("id", "back" + c).attr("data-url", cardsArray[c]).addClass("staticgif card-img-top").appendTo(cardDiv);

            // Append each card
            $("#gifs").append(cardDiv);
        };

        // Start the countdown clock for the TIMED and CHALLENGE modes 
        if (mode === 'timed' || mode === 'challenge') {
            console.log("calling the clock with " + time + " seconds");
            timerRun(time);

            $("#box-clock").show();

        } else {

        };




    };

    // Update the screen
    function updateScreen() {

        console.log("UPDATING");

        switch (mode) {
            case 'easy': // EASY mode
                console.log("EASY MODE");
                $("#welcome").hide();
                $("#game").show();

                $("#box-clock").hide();
                $("#box-level").hide();

                updateStats();
                break;

            case 'timed': // TIMED mode
                console.log("TIMED MODE");
                $("#welcome").hide();
                $("#game").show();

                $("#box-clock").show();
                $("#box-level").hide();

                updateStats();
                break;

            case 'challenge': // CHALLENGE mode
                console.log("CHALLENGE MODE");
                $("#welcome").hide();
                $("#game").show();

                $("#box-clock").show();
                $("#box-level").show();

                updateStats();
                break;

            default: // NO mode... first load
                console.log("DEFAULT MODE");

                $('#nameInput').val(userName);
                $('#countryInput').val(userCountry);

                $("#welcome").show();
                $("#game").hide();

                break;
        }
    };

    // Update player stats
    function updateStats() {

        $("#app-logo").css("text-align", "start");
        $("#app-logo-img").css("width", "290px");
        $("#app-title").hide();


        $("#mode_lbl").text(mode.toLocaleUpperCase() + " MODE");

        if (!finishGame) {
            $("#pairsm").text(pairsMatched);
            $("#tries").text(tries);
            $("#level").text(level);

        } else {
            // If all pairs have been found in a game

            // Stop countdown timer
            timerStop();

            timeUsed = timeToBeat - time;
            overallTime = overallTime + timeUsed;
            overallTries = overallTries + tries;
            level = pairs - 1;

            console.log("=== End of game stats ===");
            console.log("Name: " + userName);
            console.log("Country: " + userCountry);
            console.log("Level finished: " + level);
            console.log("Time used: " + timeUsed);
            console.log("Tries used: " + tries);
            console.log("Matched pairs: " + pairsMatched);
            console.log("      --- OVERALL ---");
            console.log("Overall time used: " + overallTime);
            console.log("Overall tries used: " + overallTries);
            console.log("=========================");

            if (mode === 'challenge') {

                if (level < 10) {
                    console.log("HERE");
                    var newButton = $("<button>").addClass("btn btn-sm btn-info mr-3").attr("id", "nextButton").attr("type", "button").text("Play next level").appendTo($("#box-buttons"));
                    // $("#box-buttons").append(newButton);
                    // var newButton = $("<button>").html('<button class="btn btn-sm btn-info mr-3" id="nextButton" type="button">Play next level</button>').append($("#box-button"));                
                    pairs++;
                } else {
                    // All levels finished on CHALLENGE mode
                }
            }

            // var gameStats = $("<h1>").text("FOUND ALL PAIRS!").appendTo($("#info"));

            // Set update message on GameUpdate modal
            $("#updateText").text("YOU FOUND ALL PAIRS! Do you want to play again?");

            // Display ALERT modal
            $("#modalGameUpdate").modal({
                backdrop: 'static',
                keyboard: false
            });



        }


    };

    //  BUTTON LOGIC

    // Click on back of card
    $("#gifs").on("click", ".staticgif", function () {

        if (secondPick != "") {
            return;
        }

        // Save the ID of the clicked card
        // Making sure to remove the first 4 characters
        var choice = this.id.substr(4);

        // If the same card is clicked twice do nothing
        if (this.id.substr(4) === firstPick) {
            console.log("repeated");
            return;
        }

        if (firstPick === "") {
            firstPick = choice;
        } else if (firstPick != "" && secondPick === "") {

            secondPick = choice;
        }

        // Hide the back of the card
        $("#back" + choice).hide();

        // Show the front of the card
        $("#frnt" + choice).show();

        // Get the URL for the card
        urlArray.push(this.dataset.url)

        // Get the INDEX for the card
        indexArray.push(choice);

        if (firstPick != "" && secondPick != "") {
            // Add a try to the list
            tries++;

            // Wait some time to show both cards and then follow up
            setTimeout(function () {
                if (urlArray[0] === urlArray[1]) {
                    // The cards match, hide both cards

                    // console.log("CARDS MATCH!!");

                    // Hiding the front of the card
                    $("#frnt" + indexArray[0]).css("visibility", "hidden");
                    $("#frnt" + indexArray[1]).css("visibility", "hidden");

                    // Add a pair matched to the list
                    pairsMatched++;

                    if (pairsMatched * 2 === cardsArray.length) {

                        console.log("FINISHED ALL CARDS!");
                        finishGame = true;
                    }

                } else {
                    // The cards dont match, flip tham back
                    // console.log("Not a match");

                    // Hide the back of the card
                    $("#back" + indexArray[0]).show();
                    $("#frnt" + indexArray[0]).hide();
                    $("#back" + indexArray[1]).show();
                    $("#frnt" + indexArray[1]).hide();
                }

                // Empty the URL and index array
                urlArray = [];
                indexArray = [];

                // Switch back that the first card was picked
                firstPick = "";
                secondPick = "";

                // Update the game stats
                updateStats();

            }, 2000); // Wait this many miliseconds after the second card is picked


        }

    });

    // Player selects play mode
    $(".btnPlay").on("click", function (e) {
        e.preventDefault();

        // If player has not entered name or country show elart message
        if ($('#nameInput').val() === "" || $('#countryInput').val() === "") {

            // Set error message on ALERT modal
            $("#errorText").text("YOU NEED TO ENTER A USERNAME AND A SELECT A VALID COUNTRY");

            // Display ALERT modal
            $("#modalAlert").modal({
                backdrop: 'static',
                keyboard: false
            });

            // Exit
            return;
        };
//------------------------------------------------------------------------------------------------//
        // // Save username and user country localy        conflict with Alex's code
        // userName = $('#nameInput').val().trim();
        // userCountry = $('#countryInput').val().trim();
//------------------------------------------------------------------------------------------------//

        // Get the mode from the button selected
        mode = this.id;

        switch (mode) {
            // EASY mode
            case 'easy': // EASY mode

                // Show modalPairs to ask the player how many pairs
                $("#modalPairs").modal({
                    backdrop: 'static',
                    keyboard: false
                });

                // Don't show/need countdown timer
                timer = false;

                // Not challenge mode
                challenge = false;

                break;

            case 'timed': // TIMED mode

                // Show modalPairs to ask the player how many pairs
                $("#modalPairs").modal({
                    backdrop: 'static',
                    keyboard: false
                });

                // Show/need countdown timer
                timer = true;

                // Not challenge mode
                challenge = false;

                break;

            case 'challenge': // CHALLENGE mode

                // Start the challenge with 2 pairs
                pairs = 2;

                // Show/need countdown timer
                timer = true;

                // Enable challenge mode
                challenge = true;

                // Start game
                startGame(pairs);

                break;
        };

    });

    // Player select how many pairs to play with
    $("#play").click(function () {

        // Get the # of pairs from the input form
        pairs = parseInt($('#pairsInput').val().trim());

        // console.log("Seelcted to play with " + pairs + " pairs.");

        // Hide the modal
        $("#modalPairs").modal("hide");

        // Start game
        startGame(pairs);
    });

    // Player select to play AGAIN after the game ended
    $("#playAgain").click(function () {

        // Reset variables - FALSE = keep player name and country
        freshStart(false);

        // Hide the modal
        $("#modalGameUpdate").modal("hide");

        // Update screen
        updateScreen();

    });

    // Play next game
    $("#nextButton").on("click", function () {
        // Start game
        startGame(pairs);
    })

    /********** ALL TIMER RELATED FUNCTIONS **********/
    function timerRun() {

        // Stop timer
        timerStop();

        // Set interval to 1 second
        clearInterval(intervalId);
        intervalId = setInterval(decrement, 1000);
    };

    function timerStop() {
        // Stop the countdown - leave the last time
        clearInterval(intervalId);
    };

    function decrement() {

        //  Decrease time by one.
        time--;

        // Display time (if hidden)
        $("#clock").css("visibility", "visible");

        // Update the time 
        $("#clock").text(fancyTimeFormat(time));

        //  When run out of time...
        if (time <= 0) {

            //  Update the time 
            // $("#clock").text("Time's up!");

            // Set update message on GameUpdate modal
            $("#updateText").text("YOUR TIME IS UP... try again!");

            // Display ALERT modal
            $("#modalGameUpdate").modal({
                backdrop: 'static',
                keyboard: false
            });

            // Stop timer
            timerStop();

            // Log "out of time" and question number
            console.log("Clock down");
        }
    };

    function fancyTimeFormat(time) {
        // Hours, minutes and seconds
        // ~~ is a shorthand for Math.floor

        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    };

    /*************************************************/

    // Update screen
    updateScreen();
});



//************************Adding code Alex's code **************/



//********API calls for flags and Firebase code for Leaderboard ***************************************************/


var urlFlagArray = [];

//Flags API code Function-----------------------------------/

$("#country-input-btn").on("click", function (event) {

    event.preventDefault();

    var country = $("#country-input").val();

    var queryURL = "https://restcountries.eu/rest/v2/name/" + country;

    $("#flags").empty();

    //hide user input/btn to show input/btn for country 
    $(this).parent().hide();
    $("#input-fields").show();


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        for (i = 0; i < response.length; i++) {
            var result = response[i].flag;
        }

        var flagUrl = result;
        urlFlagArray.push(flagUrl);
    });
});

//--------------------------------------------------

//**************************************************************** */

//Initialize Firebase

var config = {
    apiKey: "AIzaSyB8rR_AYeLUh4aE2dQB_D2NITW_tVoCdiQ",
    authDomain: "leader-board-717ef.firebaseapp.com",
    databaseURL: "https://leader-board-717ef.firebaseio.com",
    projectId: "leader-board-717ef",
    storageBucket: "leader-board-717ef.appspot.com",
    messagingSenderId: "954867525887"
}; 

firebase.initializeApp(config);
var database = firebase.database();
const db = firebase.firestore();                //without this line of code is a realtime database
db.settings({timestampsInSnapshots: true});     //without this line of code is a realtime database



// 2. Button for adding Payers to database

$("#add-player-btn").on("click", function (event) {
    event.preventDefault();

    $(this).parent().hide();

    // Grabs user input

    var rankingInfo = $("#ranking").val().trim(); //info needed from game results
    var username = $("#name-input").val().trim();
    var countryName = $("#country-input").val().trim();
    var scoreInfo = $("#score").val().trim(); //info needed from game results

    // Creates local "user-info" object for holding Player data

    var newPlayer = {
        ranking: rankingInfo,
        user: username,
        country: urlFlagArray[0],
        score: scoreInfo
    };

    // Uploads player data to the database
    database.ref().push(newPlayer);

    db.collection('Easy').add(newPlayer);


    $("#ranking").text(newPlayer.ranking); //Waiting for data from game
    $("#name-input").text(newPlayer.user);
    $("#country-input").text(newPlayer.country);
    $("#score").text(newPlayer.score); //Waiting for data from game


    $("#ranking").val("");
    $("#name-input").val("");
    $("#country-input").val("");
    $("#score").val("");
});

database.ref().on("child_added", function (childSnapshot) {

    var rankingInfo = childSnapshot.val().ranking;
    var userName = childSnapshot.val().user;
    var countryName = childSnapshot.val().country;
    var scoreInfo = childSnapshot.val().score;



    // Adding Next player to the leaderboard

    var newRow = $("<tr>").append(
        $("<td>").text(rankingInfo),
        $("<td>").text(userName),
        $("<img>").attr("src", countryName).addClass("flagSmall"),
        $("<td>").text(scoreInfo),

    );


    // Append the new row to the table

    $("#leaderboard-table > tbody").append(newRow);

    //Empying out url Array for next player
    urlFlagArray = [];

});

//********API calls for flags and Firebase code for Leaderboard    END***************************************************/