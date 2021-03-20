fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        
        setQuestion(0);
    });

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let questNum = document.querySelector('#questNum');
let answers = document.querySelectorAll('.list-group-item');

let results = document.querySelector('.results');
let list = document.querySelector('.list');
let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}
function markCorrect(elem) {
    elem.classList.add('correct');
}
function markInCorrect(elem) {
    elem.classList.add('incorrect');
}
function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
       answers[i].removeEventListener('click', doAction);
    }
}

function setQuestion(index) {
    //clearClass();
    question.innerHTML = preQuestions[index].question;
    questNum.innerHTML = index + 1;
 
    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});

next.addEventListener('click', function () {
    index++;
   if (index >= preQuestions.length) {
       list.style.display = 'none';
       results.style.display = 'block';
       userScorePoint.innerHTML = points;
       average.innerHTML = saveScore();
    } else {
       setQuestion(index);
       activateAnswers();
    }
});
previous.addEventListener('click', function () {
    if (index <= 0)
        return;
    index--;
    setQuestion(index);
    activateAnswers();
});

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
       answers[i].addEventListener('click', doAction);
       answers[i].classList.remove('correct');
       answers[i].classList.remove('incorrect');
    } 
}
activateAnswers();

function saveScore() {
    let score = {
        average: 0,
        sum: points,
        count: 0
    }

    let lastScore_serialized = localStorage.getItem("score");
    let lastScore = JSON.parse(lastScore_serialized);

    if (lastScore !== null) {
        score.count = lastScore.count + 1
        score.sum += lastScore.sum;
        score.average = score.sum / score.count;
    }
    else {
        score.count = 1
        score.average = score.sum / score.count;
    }

    localStorage.setItem("score", JSON.stringify(score));

    return score.average;
}
