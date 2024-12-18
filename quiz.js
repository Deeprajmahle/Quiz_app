const Questions = [
  {
    question: "What does SQL stand for?",
    options: [
      "Stylish Question Language",
      "Stylesheet Query Language",
      "Statement Question Language",
      "Structured Query Language"
    ],
    correct_answer: "Structured Query Language"
  },
  {
    question: "What does XML stand for?",
    options: [
      "eXtensible Markup Language",
      "eXecutable Multiple Language",
      "eXTra Multi-Program Language",
      "eXamine Multiple Language"
    ],
    correct_answer: "eXtensible Markup Language"
  },
  {
    question: "What is the name of the town located in the Kanglatongbi area?",
    options: [
      "Imphal",
      "Kangpokpi",
      "Kakching",
      "Churachandpur"
    ],
    correct_answer: "Kangpokpi"
  }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;
let userAnswers = [];

function startQuiz() {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("quizContainer").style.display = "block";
  resetQuizState(); 
  loadQuestion();
  startTimer();
}
function loadQuestion() {
  const questionElement = document.getElementById("ques");
  const optionsContainer = document.getElementById("opt");
  const questionNumber = document.getElementById("questionNumber");
  
  questionElement.textContent = Questions[currentQuestion].question;
  questionNumber.textContent = `${currentQuestion + 1} of ${Questions.length} Questions`;
  optionsContainer.innerHTML = "";

  Questions[currentQuestion].options.forEach(option => {
    const optionDiv = document.createElement("div");
    optionDiv.textContent = option;
    optionDiv.className = "option";
    optionDiv.onclick = () => selectOption(optionDiv);
    optionsContainer.appendChild(optionDiv);
  });

  resetOptionStyles();
  resetTimer();
}

function selectOption(selectedDiv) {
  const answerValue = selectedDiv.textContent;
  const correctAnswer = Questions[currentQuestion].correct_answer;

  userAnswers.push({
    question: Questions[currentQuestion].question,
    user_answer: answerValue,
    correct_answer: correctAnswer,
    is_correct: answerValue === correctAnswer
  });

  if (answerValue === correctAnswer) score++;

  document.querySelectorAll(".options-container div").forEach(div => div.classList.add("disabled"));
  setTimeout(nextQuestion, 1000);
}

function skipQuestion() {
  userAnswers.push({
    question: Questions[currentQuestion].question,
    user_answer: "Skipped",
    correct_answer: Questions[currentQuestion].correct_answer,
    is_correct: false
  });
  nextQuestion();
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < Questions.length) {
    loadQuestion();
  } else {
    clearInterval(timer);
    showResults();
  }
}

function showResults() {
  document.querySelector(".timer-container").style.display = "none"; 
  document.querySelector(".question-container").innerHTML = `<h2>Your Score: ${score}/${Questions.length}</h2>`;
  document.getElementById("opt").style.display = "none";
  document.querySelector(".footer").style.display = "none";

  const resultsContainer = document.createElement("div");
  resultsContainer.classList.add("results-summary");

  userAnswers.forEach((answer, index) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";

    resultItem.innerHTML = `
      <p><strong>Q${index + 1}:</strong> ${answer.question}</p>
      <p class="answer ${answer.is_correct ? 'correct-answer' : 'incorrect-answer'}">${answer.user_answer}</p>
      ${!answer.is_correct ? `<p class="answer correct">Correct: ${answer.correct_answer}</p>` : ''}
    `;
    resultsContainer.appendChild(resultItem);
  });

  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Quiz";
  restartButton.className = "restart-button";
  restartButton.onclick = restartQuiz;

  resultsContainer.appendChild(restartButton);
  document.querySelector(".question-container").appendChild(resultsContainer);
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      skipQuestion();
    }
  }, 1000);
}

function resetTimer() {
  timeLeft = 15;
  document.getElementById("timer").textContent = timeLeft;
}

function resetOptionStyles() {
  document.querySelectorAll(".options-container div").forEach(div => div.classList.remove("correct", "incorrect", "disabled"));
}

function restartQuiz() {
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("startPage").style.display = "flex";
}

function resetQuizState() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];

  document.getElementById("opt").innerHTML = "";
  document.getElementById("score").innerHTML = "";
  document.querySelector(".question-container").innerHTML = `
    <div id="questionNumber">1 of ${Questions.length} Questions</div>
    <h2 id="ques">Question text goes here</h2>
  `;
  
  document.querySelector(".timer-container").style.display = "flex";
  document.getElementById("opt").style.display = "block";
  document.querySelector(".footer").style.display = "flex";
  
  document.getElementById("score").innerHTML = ""; 
  document.querySelector(".results-summary")?.remove(); 

  resetTimer();
}
