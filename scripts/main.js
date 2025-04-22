document.addEventListener('DOMContentLoaded', () => {
    const quizManager = new QuizManager();
    const playButton = document.querySelector('.btn-play');
    const quizContainer = document.getElementById('quiz-container');
    const questionCounter = document.getElementById('question-counter');

    playButton.addEventListener('click', startGame);

    async function startGame() {
        quizManager.resetGame();
        playButton.style.display = 'none';
        quizContainer.style.display = 'flex';
        questionCounter.style.display = 'block';
        
        // Chargement initial des questions
        const success = await quizManager.fetchQuestions();
        if (!success) {
            alert('Erreur lors du chargement des questions. Veuillez réessayer.');
            endGame();
            return;
        }
        
        loadNewQuestion();
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

    function endGame() {
        quizContainer.style.display = 'none';
        questionCounter.style.display = 'none';
        playButton.style.display = 'block';
        alert(`Partie terminée ! Votre score : ${quizManager.score}`);
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
            button.onclick = () => handleAnswer(answer);
            answersContainer.appendChild(button);
        });
    }

    function handleAnswer(selectedAnswer) {
        const isCorrect = quizManager.checkAnswer(selectedAnswer);
        document.getElementById('score').textContent = `Score: ${quizManager.score}`;
        
        const feedbackElement = document.createElement('div');
        feedbackElement.textContent = isCorrect ? 'Correct !' : 'Incorrect !';
        feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        document.getElementById('quiz-container').appendChild(feedbackElement);

        setTimeout(() => {
            feedbackElement.remove();
            loadNewQuestion();
        }, 1000);
    }
});