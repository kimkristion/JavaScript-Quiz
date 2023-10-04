// Game Questions 
const gamequestions = [
    {
        question: 'What is the result of the following Javascript expression (5 + 1)',
        choices: [
            {txt: '2', correct: false},
            {txt: '5', correct: false},
            {txt: 'false', correct: false},
            {txt: '6', correct: true}

        ]
    },
    {
        question: 'Which keyword is used to declare a variable?',
        choices: [
            {txt: 'var', correct: true},
            {txt: 'const', correct: false},
            {txt: 'let', correct: false},
            {txt: 'variable', correct: false}
        ]
    },
    {
        question: 'Which of the following is not a JavaScript data type?',
        choices: [
            {txt: 'String', correct: false},
            {txt: 'Character', correct: true},
            {txt: 'Boolean', correct: false},
            {txt: 'Number', correct: false}
        ]
    },
    {
        question: 'What does DOM stand for?',
        choices: [
            {txt: 'Document Object Model', correct: true},
            {txt: 'Data Object Model', correct: false},
            {txt: 'Document Oriented Model', correct: false},
            {txt: 'Domain Object Model', correct: false},
        ]
    }
]

// Elements
const quizIntro = document.getElementById('quizintro');
const quizContainer = document.getElementById('quizContainer');
const startButton = document.getElementById('startBtn');
const questionElement = document.getElementById('question');
const choiceButtons = document.getElementById('choices');
const nextButton = document.getElementById('nextBtn');
const userData = document.getElementById('userData');
const submitButton = document.getElementById('submitBtn');
const displayLeaderboardData = document.getElementById('leaderboardListData');
const timerDisplay = document.getElementById('timer');
const clearBtn = document.getElementById('clearBtn');
const goToLeaderboard = document.getElementById('leaderboardTab');
const homeBtn = document.getElementById('homeBtn');
const homeBtn2 = document.getElementById('homeBtn2');
const leaderboardContainer = document.getElementById('scoreContainer');

let currentQuestionIndex = 0;
let score = 0;
let time = 60;

// Timer functions
function startTimer(duration) {
    time = duration;

    const timerInterval = setInterval(function () {
        timerDisplay.textContent = `Time remaining: ${time}`;
        time--;

        if (time < 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'TIMES UP';
            displayScore();
        } else if (currentQuestionIndex === gamequestions.length) {
            clearInterval(timerInterval);
            timerDisplay.textContent = `Time Finished: ${time + 2} seconds`;
        }
    }, 1000);
}

function subtractTime(seconds) {
    if (time >= seconds) {
        timerDisplay.textContent = `Time remaining: ${time} (-10s)`;
        time -= seconds;
    } else {
        time = 0;
    }
}

// Start Quiz function
function startQuiz() {
    quizIntro.style.display = 'none';
    quizContainer.style.display = 'block';
    startTimer(60);
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = 'Next';
    displayQuestion();
}

// Display current question
function displayQuestion() {
    resetQuizCurrentState();
    let currentQuestion = gamequestions[currentQuestionIndex];
    let questionIndexShown = currentQuestionIndex + 1;
    questionElement.innerHTML = questionIndexShown + ". " + currentQuestion.question;
    currentQuestion.choices.forEach(choices => {
        const button = document.createElement('button');
        button.innerHTML = choices.txt;
        button.classList.add('choice');
        choiceButtons.appendChild(button);

        if (choices.correct) {
            button.dataset.correct = choices.correct;
        }
        button.addEventListener('click', SelectedAnswer);
    });
}

// Reset quiz state
function resetQuizCurrentState() {
    nextButton.style.display = 'none';
    homeBtn.style.display = 'none'
    userData.style.display = 'none';
    submitButton.style.display = 'none';
    while (choiceButtons.firstChild) {
        choiceButtons.removeChild(choiceButtons.firstChild);
    }
}

// Handle selected answer
function SelectedAnswer(e) {
    const selectedAnswerButton = e.target;
    const answerIsCorrect = selectedAnswerButton.dataset.correct === 'true';

    if (!answerIsCorrect) {
        subtractTime(10);
    }

    if (answerIsCorrect) {
        selectedAnswerButton.classList.add('correct');
        score++;
    } else {
        selectedAnswerButton.classList.add('incorrect');
    }
    Array.from(choiceButtons.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
        button.disabled = true;
    });
    nextButton.style.display = 'block';
}

// Leaderboard functions
const listofScores = JSON.parse(localStorage.getItem('listofScores')) || [];

function saveUserScore(username, score) {
    const userscore = {
        username: username,
        score: score
    };

    listofScores.push(userscore);

    localStorage.setItem('listofScores', JSON.stringify(listofScores));
}

function getUserScore() {
    const savedData = JSON.parse(localStorage.getItem('listofScores'));
    displayLeaderboardData.textContent = '';
    if (savedData) {
        savedData.sort((a, b) => b.score - a.score);

        savedData.forEach(userscore => {
            const username = userscore.username;
            const score = userscore.score;
            const data = `${username} scored ${score} out of 4`;

            const dataList = document.createElement('li');
            dataList.id = 'leaderboardDataList';
            dataList.textContent = data;
            displayLeaderboardData.appendChild(dataList);
        });
    }
}

getUserScore();

// Display user's score
function displayScore() {
    resetQuizCurrentState();
    questionElement.innerHTML = `You scored ${score} out of ${gamequestions.length}`;
    userData.style.display = 'block';
    submitButton.style.display = 'block';

    nextButton.innerHTML = 'Play Again';
    nextButton.style.display = 'block';
    homeBtn.style.display = 'block'
}

// Submit button click event
submitButton.addEventListener('click', () => {
    const username = userData.value;
    saveUserScore(username, score);
    getUserScore();
});

// Clear leaderboard
clearBtn.addEventListener('click', () => {
    listofScores.length = 0;
    localStorage.setItem('listofScores', JSON.stringify(listofScores));
    getUserScore();
});

// Activate next question or start a new quiz
function activateNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < gamequestions.length) {
        displayQuestion();
    } else {
        displayScore();
    }
}

// Next button click event
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < gamequestions.length) {
        activateNextButton();
    } else {
        startQuiz();
    }
});

// Start button click event
startButton.addEventListener('click', startQuiz);

// Go to leaderboard
goToLeaderboard.addEventListener('click', () => {
    quizContainer.style.display = 'none';
    quizIntro.style.display = 'none';
    leaderboardContainer.style.display = 'block';
});

// Return to the home screen
homeBtn.addEventListener('click', () => {
    quizContainer.style.display = 'none';
    quizIntro.style.display = 'flex';
    leaderboardContainer.style.display = 'none';
});

// Return to the home screen
homeBtn2.addEventListener('click', () => {
    quizContainer.style.display = 'none';
    quizIntro.style.display = 'flex';
    leaderboardContainer.style.display = 'none';
});