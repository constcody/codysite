var count = 1


var click = false
function demo() {
  if (click) return
  document.getElementById('demo' + count++)
    .classList.toggle('hover')

}

function demo2() {
  if (click) return
  document.getElementById('demo2')
    .classList.toggle('hover')
}

function reset() {
  count = 1
  var hovers = document.querySelectorAll('.hover')
  for (var i = 0; i < hovers.length; i++) {
    hovers[i].classList.remove('hover')
  }
}

document.addEventListener('mouseover', function () {
  mousein = true
  reset()
})

//SECTION General information about deck of cards
const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k']; //Length: 13 (0-12)
const suits = ['s', 'h', 'c', 'd']; //Length: 4 (0-3)

let drawnTups = []; //Imitate "tuple" of "val + suit"

//SECTION Specific to blackjack
let dealerBj = 0; //Value of dealer hand
let dealerBjAces = 0; //Num. aces in dealer hand
let dealerBjHtml; //Wrapper Div of dealer cards, used to append cards

let playerBj = 0; //Value of player hand
let playerBjAces = 0; //Num. aces in player hand
let playerBjHtml; //Wrapper Div of player cards, used to append cards

let createdHtml = []; //All created HTML elements, delete when resetting game
let betHtml = []; //All buttons to add/sub bet amount
let bjWinAud; //Sound played when player wins blackjack
let curCoins = 1000;
let curBet = 0;

//SECTION Runs upon page loading: sets up first game and properties
const loadBjHtml = () => {
  //First 4 drawn cards: [dOne,pOne,dTwo,pTwo]
  const firstFour = [drawCard(), drawCard(), drawCard(), drawCard()];
  console.log(firstFour);
  //Add num aces and add values of hands
  for (let i = 0; i < firstFour.length; i++) {
    let curCardVal = valCardBj(firstFour[i]);
    //If current card is an ace (11)
    if (curCardVal == 11) {
      //Add corresponding # aces
      i % 2 == 0 ? (dealerBjAces += 1) : (playerBjAces += 1);
      //Value of ace initially 11
    }
    //Add values now
    i % 2 == 0 ? (dealerBj += curCardVal) : (playerBj += curCardVal);
    //Update value of player hands
    updatePValHtml();
    //Check player bust
    checkBjBustP();
  }
  console.log(`Dealer Aces: ${dealerBjAces}`);
  console.log(`Player Aces: ${playerBjAces}`);
  //Change src of cards
  document.getElementById('dealer1').src = `./images/pokercards/${firstFour[0]}.png`;
  document.getElementById('player1').src = `./images/pokercards/${firstFour[1]}.png`;
  document.getElementById('player2').src = `./images/pokercards/${firstFour[3]}.png`;
  console.log(drawnTups);
  console.log(`Dealer Hand: ${dealerBj}`);
  console.log(`Player Hand: ${playerBj}`);
  //Set the div to append cards
  dealerBjHtml = document.getElementById('dWrapperBj');
  playerBjHtml = document.getElementById('pWrapperBj');
  //Set sounds
  bjWinAud = new Audio(`./sounds/bjwin.mp3`);
  bjWinAud.volume = 0.25;
  bjLoseAud = new Audio(`./sounds/bjlose.mp3`);
  bjLoseAud.volume = 0.1;
  bjTieAud = new Audio(`./sounds/bj.mp3`);
  bjTieAud.volume = 0.25;
};

//SECTION Updates the text of the player's hand value
const updatePValHtml = () => {
  document.getElementById('pValueText').innerHTML = `Player Hand: ${playerBj}`;
};

//SECTION Updates the text of the dealer's hand value
const updateDValHtml = () => {
  document.getElementById('dValueText').innerHTML = `Dealer Hand: ${dealerBj}`;
};

//SECTION Simulates a "hit" for player in Blackjack
const hitBjHtml = () => {
  const newCardHtml = document.createElement('img');
  const newCard = drawCard();
  playerBj += valCardBj(newCard);
  if (valCardBj(newCard) == 11) {
    playerBjAces += 1;
  }
  newCardHtml.src = `./images/pokercards/${newCard}.png`;
  newCardHtml.style.width = '75px';
  newCardHtml.style.height = '120px';
  newCardHtml.style.margin = '20px';
  //Append the new drawn card
  playerBjHtml.appendChild(newCardHtml);
  createdHtml.push(newCardHtml);
  //Update player hand
  updatePValHtml();
  //Check bust
  checkBjBustP();
  console.log('Hit');
};

//SECTION Simulates the dealer after the player stands
const standBjHtml = () => {
  //Reveal dealer 2nd card and value
  document.getElementById('dealer2').src = `./images/pokercards/${drawnTups[2]}.png`;
  updateDValHtml();
  //Check if aces cause bust
  while (dealerBj > 21 && dealerBjAces > 0) {
    dealerBj -= 10;
    dealerBjAces -= 1;
  }
  //Keep drawing if dealer hand < 17
  while (dealerBj < 17) {
    const newCardHtml = document.createElement('img');
    const newCard = drawCard();
    dealerBj += valCardBj(newCard);
    if (valCardBj(newCard) == 11) {
      dealerBjAces += 1;
    }
    newCardHtml.src = `./images/pokercards/${newCard}.png`;
    newCardHtml.style.width = '75px';
    newCardHtml.style.height = '120px';
    newCardHtml.style.margin = '20px';
    //Append the new drawn card
    dealerBjHtml.appendChild(newCardHtml);
    createdHtml.push(newCardHtml);
    //Check if ace causes bust
    while (dealerBj > 21 && dealerBjAces > 0) {
      dealerBj -= 10;
      dealerBjAces -= 1;
    }
  }
  if (dealerBj > 21) {
    document.getElementById('bjstatus').innerHTML = '--Dealer busts!--';
    bjWinAud.play();
  } else if (dealerBj > playerBj) {
    document.getElementById('bjstatus').innerHTML = '--Dealer wins!--';
    bjLoseAud.play();
  } else if (dealerBj == playerBj) {
    document.getElementById('bjstatus').innerHTML = '--No one wins!--';
    bjTieAud.play();
  } else {
    document.getElementById('bjstatus').innerHTML = '--Player wins!--';
    bjWinAud.play();
  }
  updateDValHtml();
  endBjHtml();
};

//SECTION Runs when a blackjack game ends
const endBjHtml = () => {
  document.getElementById('hitBjButton').disabled = true;
  document.getElementById('standBjButton').disabled = true;
  document.getElementById('playBjButton').hidden = false;
};

//SECTION Runs when player clicks "play again"
const resetBjHtml = () => {
  //Stop the audio
  bjLoseAud.pause();
  bjWinAud.pause();
  //Remove all added pictures
  createdHtml.forEach((e) => {
    e.remove();
  });
  //Reset all attributes and HTML
  createdHtml = [];
  drawnTups = [];
  dealerBj = 0;
  dealerBjAces = 0;
  playerBj = 0;
  playerBjAces = 0;
  document.getElementById('dealer2').src = `./images/pokercards/backcard.jpg`;
  document.getElementById('dValueText').innerHTML = 'Dealer Hand: ?';
  document.getElementById('bjstatus').innerHTML = '--Game in progress--';
  document.getElementById('hitBjButton').disabled = false;
  document.getElementById('standBjButton').disabled = false;
  document.getElementById('playBjButton').hidden = true;
  //Load the game again
  loadBjHtml();
};

//SECTION Resets the deck of cards
function resetDeck() {
  drawnTups = [];
}

//SECTION Returns a randomly drawn card from a deck of cards
function drawCard() {
  //Draws a random card in the form of "1s"
  let drawn = values[Math.floor(Math.random() * 13)] + suits[Math.floor(Math.random() * 4)];
  //While drawn array has the tuple, keep redrawing
  while (drawnTups.indexOf(drawn) >= 0) {
    drawn = values[Math.floor(Math.random() * 13)] + suits[Math.floor(Math.random() * 4)];
  }
  drawnTups.push(drawn);
  return drawn;
}

//SECTION Returns the numeric value of a card passed in BJ
//Ex. "qc" returns 10
function valCardBj(cardname) {
  let cardVal = cardname.charAt(0);
  if (cardVal == 't') return 10;
  if (cardVal == 'j') return 10;
  if (cardVal == 'q') return 10;
  if (cardVal == 'k') return 10;
  if (cardVal == '1') return 11;
  return parseInt(cardVal);
}

//SECTION Checks if value of hand busts because of an ace, fix if needed
function checkBjBustP() {
  //If player has ace and will bust, subtract value 10 and num. ace 1
  while (playerBj > 21 && playerBjAces > 0) {
    playerBj -= 10;
    playerBjAces -= 1;
  }
  updatePValHtml();
  if (playerBj > 21) {
    document.getElementById('bjstatus').innerHTML = '--Player Busts!--';
    bjLoseAud.play();
    //Reveal dealer 2nd card and value if bust
    document.getElementById('dealer2').src = `./images/pokercards/${drawnTups[2]}.png`;
    updateDValHtml();
    endBjHtml();
  }
}