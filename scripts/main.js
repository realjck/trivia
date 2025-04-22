document.addEventListener('DOMContentLoaded', () => {
    const quizManager = new QuizManager();
    const playButton = document.querySelector('.btn-play');
    const quizContainer = document.getElementById('quiz-container');
    const questionCounter = document.getElementById('question-counter');
    const logoContainer = document.querySelector('.logo-container');
    
    // Ajout des sons
    const winSound = new Audio('sounds/win.mp3');
    const loseSound = new Audio('sounds/lose.mp3');

    playButton.addEventListener('click', startGame);

    async function startGame() {
        quizManager.resetGame();
        playButton.style.display = 'none';
        logoContainer.style.display = 'none';
        quizContainer.style.display = 'flex';
        
        const quizContent = document.getElementById('quiz-content');
        const loadingSpinner = document.getElementById('loading-spinner');
        
        quizContent.style.display = 'none';
        questionCounter.style.display = 'none';
        loadingSpinner.style.display = 'block';
        
        // Chargement initial des questions
        const success = await quizManager.fetchQuestions();
        if (!success) {
            alert('Erreur lors du chargement des questions. Veuillez réessayer.');
            endGame();
            return;
        }
        
        loadingSpinner.style.display = 'none';
        questionCounter.style.display = 'block';
        quizContent.style.display = 'flex';
        
        loadNewQuestion();
    }

    function endGame() {
        quizContainer.style.display = 'none';
        questionCounter.style.display = 'none';
        logoContainer.style.display = 'none';
        
        const endScreen = document.getElementById('end-screen');
        const finalScore = endScreen.querySelector('.final-score');
        const replayButton = endScreen.querySelector('.btn-play');
        
        finalScore.textContent = quizManager.score;
        endScreen.style.display = 'flex';
        
        replayButton.addEventListener('click', () => {
            endScreen.style.display = 'none';
            startGame();
        });
    }

    function loadNewQuestion() {
        const question = quizManager.loadNextQuestion();
        if (!question) {
            endGame();
            return;
        }

        quizManager.questionCount++;
        questionCounter.textContent = `${quizManager.questionCount}/${quizManager.maxQuestions}`;
        displayQuestion(question);
    }

    function displayQuestion(question) {
        document.getElementById('category').textContent = quizManager.getCategoryWithEmoji(question.category);
        document.getElementById('question').textContent = question.question;
        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';
        
        const answers = [
            ...question.incorrect_answers,
            question.correct_answer
        ].sort(() => Math.random() - 0.5);

        answers.forEach((answer) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.className = 'btn';
            button.onclick = () => {
                // Désactiver tous les boutons immédiatement après un clic
                const allButtons = answersContainer.querySelectorAll('button');
                allButtons.forEach(btn => {
                    btn.disabled = true;
                    if (btn.textContent === answer && answer === question.correct_answer) {
                        // Si c'est la bonne réponse, on met en vert
                        btn.style.backgroundColor = '#4CAF50';
                    } else if (btn.textContent === answer) {
                        // Si c'est la mauvaise réponse cliquée, on met en rouge
                        btn.style.backgroundColor = '#f44336';
                    } else if (btn.textContent === question.correct_answer) {
                        // On montre la bonne réponse en vert
                        btn.style.backgroundColor = '#4CAF50';
                    }
                });
                handleAnswer(answer);
            };
            answersContainer.appendChild(button);
        });
    }

    function handleAnswer(selectedAnswer) {
        const isCorrect = quizManager.checkAnswer(selectedAnswer);
        
        // Jouer le son approprié
        if (isCorrect) {
            winSound.play();
        } else {
            loseSound.play();
        }
        
        const feedbackElement = document.createElement('div');
        feedbackElement.textContent = isCorrect ? 'Correct' : 'Incorrect';
        feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        document.getElementById('quiz-container').appendChild(feedbackElement);

        setTimeout(() => {
            feedbackElement.remove();
            loadNewQuestion();
        }, isCorrect ? 1000 : 2000);
    }
});