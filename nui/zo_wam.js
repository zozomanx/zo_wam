// Config Settings - gets values from client.lua or uses these as defaults
let gameLength = 10000;  // How long a game lasts
let minSpeed = 400;  // Lower is harder
let maxSpeed = 800;  // Lower is harder
let amountToWin = 12;  // How many you have to hit to win
// end of Config Settings

// Variables
let lastHole;
let timeUp = false;
let score = 0;

const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const timeLeftBoard = document.querySelector('.countdown');
const moles = document.querySelectorAll('.mole');
const html = document.documentElement;


function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    // console.log(hole);
    if (hole === lastHole) {
        // console.log('Same hole, retrying...');
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(minSpeed, maxSpeed);
    const hole = randomHole(holes);
    hole.classList.add('up');
    hole.querySelector('.mole').classList.remove('clicked');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    // wait 1.5 seconds before starting
    setTimeout(() => {
        document.querySelector('.passfail').classList.remove('show');
        document.querySelector('h2').style.display = 'block';
        countDown(gameLength / 1000, timeLeftBoard);
        scoreBoard.textContent = 0;
        timeUp = false;
        score = 0;
        peep();
        setTimeout(() => timeUp = true, gameLength);
    },1500)
}

function bonk(e) {  
    if (!e.isTrusted || this.classList.contains('clicked')) return; // already clicked!
    this.classList.add('clicked');
    score++;
    this.classList.remove('up');
    scoreBoard.textContent = score;
}


function countDown(start, element) {
  let counter = start;
  function tick() {
    element.textContent = counter;
    counter--;
    if (counter <0) {
      clearInterval(timer);
    //   element.textContent = '0';
      if (score >= amountToWin) {
        document.querySelector('.passfail').textContent = 'SUCCESS!';
        toggleText()
        setTimeout(() => CloseWindow(true), 2000)
    } else {
        document.querySelector('.passfail').textContent = 'FAILURE!';
        toggleText()
        setTimeout(() => CloseWindow(false), 2000)
    }
    }
  }
  let timer = setInterval(tick, 1000); // 1000ms = 1s
  tick(); // call tick immediately for the first second
};

async function CloseWindow(result) {
    html.style.display = 'none';

    try {
        await axios.post(`https://${GetParentResourceName()}/closeWAM`, {})
        sendResult(result)
    } catch (error) {
        console.error('Error during closeWAM request:', error.message)
        console.error('Full error object:', error)
    }
}

function toggleText() {
    document.querySelector('.passfail').classList.add('show');
    document.querySelector('h2').style.display = 'none';
}

async function sendResult(result) {
    try {
        await axios.post(`https://${GetParentResourceName()}/gameResult`, {
            result: result
          })
          .catch((error) => {
            console.error(error);
          })
    } catch (error) {
        console.error('Error during gameResult request:', error.message)    
    }
}

moles.forEach(mole => mole.addEventListener('click', bonk));

window.addEventListener('message', (event) => {
    // console.log('Received message:', event.data);

    if (event.data.action == 'openWAM') {
        // console.log('Starting game...');
        html.style.display = 'block';
        gameLength = event.data.gameLength;
        minSpeed = event.data.minSpeed;
        maxSpeed = event.data.maxSpeed;
        amountToWin = event.data.amountToWin;
        startGame();
    }
  });


  // Add event listener for the Esc key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // console.log('Closing game...');
        CloseWindow();
    }
});