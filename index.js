const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const accountSID = "AC3ab15ba5f99991dbb313b05cb19450da";
const authToken = "3708cf8a7404c88a5472e141f7a8f932";

const client = new twilio(accountSID, authToken);

const messaging_response = require('twilio').twiml.MessagingResponse;

let app = express();

app.use(bodyParser.urlencoded({extended:false}));

let playerData = {};

app.post('/sms', function (request, response){
    const twiml = new messaging_response();

    let currUser = request.body.From;
    let body = request.body.Body.toLowerCase();

    if(body === "new game") {
        playerData[currUser + " Random Number"] = Math.floor(Math.random() * 10) + 1;
        twiml.message("The random number has been generated, you can now start guessing a number between 1 and 10.");
    } else if (parseInt(body) < playerData[currUser + " Random Number"]) {
        twiml.message("The guess was too low. Try again. ");
    } else if (parseInt(body) > playerData[currUser + " Random Number"]) {
        twiml.message("The guess was too high. Try again. ");
    } else if (parseInt(body) === playerData[currUser + " Random Number"]) {
        if (playerData[currUser + " Number of Wins"] === undefined) {
            playerData[currUser + " Number of Wins"] = 1;
        } else playerData[currUser + " Number of Wins"] += 1;
        twiml.message("Correct! You win. You can start another game if you would like.")
    } else twiml.message("There has been an error, please try again.")

    response.writeHead(200, {'Content-Type' : 'text/xml'});
    response.end(twiml.toString());
});

app.listen(8000);


// account SID: AC3ab15ba5f99991dbb313b05cb19450da
// auth token: 3708cf8a7404c88a5472e141f7a8f932
// Twilio phone: +12702771708