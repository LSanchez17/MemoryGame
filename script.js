/*
/  Overall pretty content(as of 4/11/2020) with small project
/  Needs some more UI clean ups
/  Implementation needed still:
/  -Allow user to pick number of cards
/  -Randomize colors(variety is the spice of life)
/  -Use LocalStorage to allow a differentiation between scores 
/   of various card numbers(different highscore for 5 cards, and so on)
/  ~Luis Sanchez 2020
*/




const gameContainer = document.getElementById("game");
const beginGame = document.getElementById('begin');
const restartGame = document.getElementById('restart');
const leaderBoard = document.querySelector('h2');

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

let highScore = localStorage.getItem('score');
let currentScore = 0;
let activeCards = [];
let clearedCards = [];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  updateScore();
  let num = 0;
  for (let color of colorArray) {

    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.id = 'cards'
    newDiv.dataset.id = num;
    num++;
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
  let scoreBoard = document.createElement('h3');
  scoreBoard.innerText = `Current Score: ${currentScore}`;
  gameContainer.appendChild(scoreBoard);
}

//Handles logic for clicking a card, and its ripple effects
//May need split up lots going on
//Could be hard to debug down the road
function handleCardClick(event) {
  //flips card to color
  let cardId = event.target.dataset.id;
  let currentColorClass = event.target.className;  
  event.target.style.backgroundColor = `${currentColorClass}`
  //Adds to array where we handle comparing
  activeCards.push([currentColorClass, cardId]);
  scoreTracking();
  if(activeCards.length === 2){
    cardsMatch();
  }
  clearCards();
}

const scoreTracking = () => {
  currentScore++;
  gameContainer.lastChild.innerText = `Current Score: ${currentScore}`;
}

const clearCards = () => {
  setTimeout( () => {
    //Resets all noncleared cards back to white after 1 seconds
      if(activeCards.length >= 2){
        let clearIt = document.querySelectorAll('#cards');
        for(let i of clearIt){
        i.style.backgroundColor = 'maroon';
        }
        while(activeCards.length > 0){
          activeCards.pop();
        }
      }
    }, 1000);
}

const cardsMatch = () => {
  let cardOne = activeCards[0][0];
  let cardTwo = activeCards[1][0];
  let cardNumOne = activeCards[0][1];
  let cardNumTwo = activeCards[1][1];

  if(cardOne === cardTwo && cardNumOne !== cardNumTwo){
    //if two current cards match, prevent them from flipping back
    let clearme = document.querySelectorAll(`.${activeCards[0][0]}`);
    
    //clear the id that resets the colors
    for(let card in clearme){
      clearme[card].id = 'clear';
    }
    clearedCards.push(cardNumOne, cardNumTwo);
    while(activeCards.length > 0){
      activeCards.pop();
    }
  }
}

const updateScore = () => {
  let oldScore = localStorage.getItem('score');
  let newScore = currentScore;
  if(newScore === 0){
    leaderBoard.innerText = `Current Best Score: ${localStorage.getItem('score')}`;
  }
  if(newScore !== 0 && oldScore < newScore){
    leaderBoard.innerText = `Current Best Score: ${localStorage.getItem('score')}`;
  }  
  else{
    leaderBoard.innerText = `Current Best Score: ${localStorage.getItem('score')}`;    
  }
}  
 
// when the DOM loads
beginGame.addEventListener('click', (e) => {
  if(clearedCards.length === 0){
    createDivsForColors(shuffledColors);
  }
});

restartGame.addEventListener('click', (e) => {
  if(clearedCards.length === 10){
    localStorage.setItem('score', currentScore);
    updateScore;
    currentScore = 0;
    let scoreHolder = document.querySelector('h3');
    gameContainer.removeChild(scoreHolder);

    let clearingRoom = document.querySelectorAll('#clear');
    for(let card of clearingRoom){
      card.remove();
    }
    while(clearedCards.length > 0){
      clearedCards.pop();
    }
    createDivsForColors(shuffledColors);
  }
});