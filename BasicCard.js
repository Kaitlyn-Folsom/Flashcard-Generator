var inquirer = require("inquirer");

var myCards = require("./BasicCard.json");

var clozeCards = require("./ClozeCard.json");

var fs = require("fs");

// console.log(myCards);
console.log(clozeCards);

//===============START=============//

var cardCount = 0;
var correctAnswers = 0;
var incorrectAnswers = 0;

function start() {
    inquirer.prompt([{
        name: "task",
        message: "What would you like to do?",
        type: "list",
        choices: ["Add Basic Card", "Show Basic Cards", "Take Quiz"]
    }]).then(function(choice) {
        if (choice.task === "Add Basic Card") {
            addBasicCard();
        } else if (choice.task === "Show Basic Cards") {
            showBasicCards();
        } else if (choice.task === "Take Quiz") {
            chooseQuiz();
        }
    });
};

function chooseQuiz(){
    inquirer.prompt([{
        name: "task",
        message: "Which quiz would you like to take?",
        type: "list",
        choices: ["Basic Quiz", "Cloze Card Quiz"]
    }]).then(function(choice) {
        if (choice.task === "Basic Quiz") {
            takeBasicQuiz();
        } else if (choice.task === "Cloze Card Quiz") {
            takeClozeQuiz();
        }
    });
}

function addBasicCard() {
    inquirer.prompt([{
        name: "front",
        message: "Front of card",
        type: "input"
    }, {
        name: "back",
        message: "Back of card",
        type: "input"
    }]).then(function(data) {
        var cardObj = {                  
                front: data.front,
                back: data.back
                };
        myCards.push(cardObj);  

        fs.writeFile("BasicCard.json", JSON.stringify(myCards, null, 2));

        console.log("Your flashcard has been added to the deck"); 
        
        start();
    });
};

function showBasicCards() {
    var obj;
    fs.readFile("BasicCard.json", "utf8", function (err, data) {
      if (err) throw err;

      obj = JSON.parse(data);
      console.log(obj);
    start();
    });
}

function takeBasicQuiz() {
    if (cardCount < myCards.length) {
        inquirer.prompt([{
            type: "input",
            name: "userGuess",
            message: myCards[cardCount].front
        }]).then(function(data) {
            if (data.userGuess === myCards[cardCount].back) {
                console.log("You are correct!");
                cardCount++;
                correctAnswers++;
                takeBasicQuiz();
            } else {
                console.log("You are incorrect! The correct answer is " + myCards[cardCount].back);
                cardCount++;
                incorrectAnswers++;
                takeBasicQuiz();
            }
        })
    } else {
        showScore();
    }

} //End takeBasicQuiz function

function takeClozeQuiz() {
    if (cardCount < clozeCards.length) {
        inquirer.prompt([{
            type: "input",
            name: "userGuess",
            message: clozeCards[cardCount].clozeDeleted
        }]).then(function(data) {
            if (data.userGuess === clozeCards[cardCount].cloze) {
                console.log("You are correct! " + clozeCards[cardCount].partial);
                cardCount++;
                correctAnswers++;
                takeClozeQuiz();
            } else {
                console.log("You are incorrect! " + clozeCards[cardCount].partial);
                cardCount++;
                incorrectAnswers++;
                takeClozeQuiz();
            }
        })
    } else {
        showScore();
    }

} //End TakeClozeQuiz function

function showScore() {
    console.log("\nCorrect Answers: " + correctAnswers);
    console.log("Incorrect Answers: " + incorrectAnswers + "\n");
}

start();