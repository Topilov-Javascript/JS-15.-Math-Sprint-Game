const myInputs = document.querySelectorAll(".my-input");
const startFace = document.querySelector(".start-face");
const waitingFace = document.querySelector(".waiting-face");
const playingFace = document.querySelector(".playing-face");
const endFace = document.querySelector(".end-face");
const waitingCounter = document.getElementById("waiting-counter");
const playingContent = document.getElementById("playing-content");
const scoreEl = document.getElementById("score");
const baseTimeEl = document.getElementById("base-time");
const penaltyEl = document.getElementById("penalty");
const bestScoresEl = document.querySelectorAll('.bestScore')

let bestScores = [
  {questions: 10, bestScore:0.0},
  {questions: 25, bestScore:0.0},
  {questions: 50, bestScore:0.0},
  {questions: 100, bestScore:0.0}
]
let inputValue = 0;
let expressions = [];
let answers = [];
let userAnswers = [];
let order = 0;
let time = 0;
let timeInterval;

// -----------------------------------------------------------------------------------
startFace.hidden = false;
// -----------------------------------------------------------------------------------

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

// end function (End Face)
function ending() {
  playingFace.hidden = true;
  endFace.hidden = false;
  clearInterval(timeInterval);
  time = round(time, 1);

  let right_answers_number = 0;
  let score = 0;
  let base_time = 0;
  let penalty = 0;
  // Calculate number of right answers
  let i = 0;
  while (i < order) {
    if (answers[i] === userAnswers[i]) {
      right_answers_number++;
    }
    i++;
  }
  // Calculate score, base time, penalty
  score = time;
  penalty = round((order - right_answers_number) * 0.2, 1);
  base_time = round(time - penalty, 1);
  // Set scoreEl, baseTimeEl, penaltyEl with DOM
  scoreEl.textContent = `${score}s`;
  penaltyEl.textContent = `${penalty}s`;
  baseTimeEl.textContent = `${base_time}s`;
  
  // set bestScore to localStorage
  bestScores.forEach((e, i) => {
    if (e.questions == order && e.bestScore > round(score, 1)) {
      e.bestScore = round(score, 1)
    }
    if (e.questions == order && e.bestScore === 0) {
      e.bestScore = round(score, 1)
    }
  })
  localStorage.setItem('bestScores', JSON.stringify(bestScores))

  time = 0;
  order = 0;
  userAnswers = [];
  inputValue = 0;
}

// make Expressions
function makeExpressions() {
  let i = 0;
  expressions = []
  while (i < inputValue) {
    let number1 = Math.floor(Math.random() * 10);
    let number2 = Math.floor(Math.random() * 10);
    let random = Math.floor(Math.random() * 5);
    let expression = {
      number_1: number1,
      number_2: number2,
      equals_to: number1 * number2,
      equals_to_show: [
        number1 * number2 - random < 0 ? 0 : number1 * number2 - random,
        number1 * number2,
        number1 * number2 + random
      ][Math.floor(Math.random() * 3)]
    };
    expressions.push(expression);
    i++;
  }

  expressions.forEach(e => {
    if (e.equals_to === e.equals_to_show) {
      answers.push("right");
    } else {
      answers.push("wrong");
    }
  });
}

// Start Playing (show expressions in order)
function playing(user_answer) {
  if (order !== 0) {
    userAnswers.push(user_answer);
    if (order === expressions.length) {
      ending();
      return false;
    }
  }
  playingContent.textContent = `${expressions[order].number_1} * ${expressions[
    order
  ].number_2} = ${expressions[order].equals_to_show}`;
  order++;
}

// playing function (Playing Face)
function startPlaying() {
  waitingFace.hidden = true;
  playingFace.hidden = false;
  makeExpressions();
  userAnswers = [];
  order = 0;
  timeInterval = setInterval(() => {
    time += 0.1;
  }, 100);
  playing();
}

// waiting function (Waiting Face)
function waiting() {
  startFace.hidden = true;
  waitingFace.hidden = false;
  let s = 3;
  waitingCounter.textContent = s;
  let counter_interval = setInterval(() => {
    s--;
    waitingCounter.textContent = s;
    if (s === 0) {
      waitingCounter.textContent = "Go!";
      clearInterval(counter_interval);
      setTimeout(() => {
        waitingCounter.textContent = "";
        s = 3;
        startPlaying();
      }, 500);
    }
  }, 1000);
}

// Get Value (10, 25, 50 or 100)
function getValue(value) {
  myInputs.forEach(e => {
    if (e.getAttribute("value") == value) {
      e.classList.add("selected");
    } else {
      e.classList.remove("selected");
    }
  });
  inputValue = value;
}

// Submit (Start Round)
function startRound() {
  if (inputValue === 0) {
    alert("Select a number you want to play");
    return false;
  } else {
    myInputs.forEach(e => {
      e.classList.remove("selected");
    });
    waiting();
  }
}

// Play Again Button at the end
function playAgain() {
  endFace.hidden = true;
  startFace.hidden = false;
  onLoad()
}

function onLoad() {
  if (localStorage.getItem('bestScores')) {
    bestScores = JSON.parse(localStorage.getItem('bestScores'))
  } else {
    localStorage.setItem('bestScores', JSON.stringify(bestScores))
  }
  bestScores.forEach((e, i)=>{
    bestScoresEl[i].textContent = parseInt(e.bestScore)==round(e.bestScore, 1) ? `${e.bestScore}.0s`: `${e.bestScore}s`
  })
}
onLoad()
