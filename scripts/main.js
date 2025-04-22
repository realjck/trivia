document.addEventListener('DOMContentLoaded', () => {
    const quizManager = new QuizManager();

    // Initialisation du jeu
    const playButton = document.querySelector('.btn-play');
    playButton.addEventListener('click', startGame);

    async function startGame() {
        await loadNewQuestion();
    }

    async function loadNewQuestion() {
        const question = await quizManager.fetchQuestion();
        if (question) {
            displayQuestion(question);
        }
    }

    function displayQuestion(question) {
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
        
        // Ajout de la classe appropriée pour le retour visuel
        const feedbackElement = document.createElement('div');
        feedbackElement.textContent = isCorrect ? 'Correct !' : 'Incorrect !';
        feedbackElement.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        document.getElementById('quiz-container').appendChild(feedbackElement);

        // Suppression du feedback après 1 seconde
        setTimeout(() => {
            feedbackElement.remove();
            loadNewQuestion();
        }, 1000);
    }
});