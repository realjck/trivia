document.addEventListener('DOMContentLoaded', () => {
    const quizManager = new QuizManager();
    const playButton = document.getElementById('start-btn');
    const quizContainer = document.getElementById('quiz-container');
    const questionCounter = document.getElementById('question-counter');
    const logoContainer = document.querySelector('.logo-container');
    const attributionBox = document.querySelector('.attribution-box');
    const difficultyIndicator = document.getElementById('difficulty-indicator');
    const difficultyText = difficultyIndicator.querySelector('.difficulty-text');
    const helperButtons = document.getElementById('helper-buttons');

    // Ajout des sons
    const winSound = new Audio('sounds/win.mp3');
    const loseSound = new Audio('sounds/lose.mp3');

    // Définir les gestionnaires d'événements en dehors pour pouvoir les réutiliser
    const handleReplay = () => {
        document.getElementById('end-screen').style.display = 'none';
        startGame();
    };

    const handleBack = () => {
        document.getElementById('end-screen').style.display = 'none';
        logoContainer.style.display = 'flex';
        attributionBox.style.display = 'flex';
        playButton.style.display = 'inline';
    };

    playButton.addEventListener('click', startGame);

    // Navbar Logic
    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about');
    const aboutModal = document.getElementById('about-modal');
    const closeModalElements = document.querySelectorAll('.close-modal, .close-modal-btn');

    navHome.addEventListener('click', () => {
        // Reset and go back to home screen
        document.getElementById('end-screen').style.display = 'none';
        quizContainer.style.display = 'none';
        questionCounter.style.display = 'none';
        difficultyIndicator.style.display = 'none';
        helperButtons.style.display = 'none';

        logoContainer.style.display = 'flex';
        attributionBox.style.display = 'flex';
        playButton.style.display = 'inline';

        quizManager.resetGame();
    });

    navAbout.addEventListener('click', () => {
        aboutModal.classList.add('show');
    });

    closeModalElements.forEach(el => {
        el.addEventListener('click', () => {
            aboutModal.classList.remove('show');
        });
    });

    // Close modal when clicking outside
    globalThis.addEventListener('click', (event) => {
        if (event.target === aboutModal) {
            aboutModal.classList.remove('show');
        }
    });

    async function startGame() {
        quizManager.resetGame();
        playButton.style.display = 'none';
        logoContainer.style.display = 'none';
        attributionBox.style.display = 'none';
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

        // Réinitialiser les boutons d'aide
        helperButtons.innerHTML = `
            <button class="helper-btn">/2</button>
            <button class="helper-btn">/2</button>
            <button class="helper-btn">/2</button>
        `;
        helperButtons.style.display = 'flex';

        loadNewQuestion();
    }

    function endGame() {
        quizContainer.style.display = 'none';
        questionCounter.style.display = 'none';
        difficultyIndicator.style.display = 'none';
        helperButtons.style.display = 'none'; // Cacher les boutons d'aide

        const endScreen = document.getElementById('end-screen');
        const finalScore = endScreen.querySelector('.final-score');
        const replayButton = endScreen.querySelector('.btn-play');
        const backButton = endScreen.querySelector('.btn-back');

        finalScore.textContent = quizManager.score;
        endScreen.style.display = 'flex';

        // Supprimer et réajouter les écouteurs
        replayButton.removeEventListener('click', handleReplay);
        backButton.removeEventListener('click', handleBack);
        replayButton.addEventListener('click', handleReplay);
        backButton.addEventListener('click', handleBack);
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
        // Mettre à jour l'indicateur de difficulté
        difficultyText.textContent = question.difficulty.toUpperCase();
        difficultyIndicator.className = `difficulty-indicator difficulty-${question.difficulty}`;
        difficultyIndicator.style.display = 'block';
        document.getElementById('category').textContent = quizManager.getCategoryWithEmoji(question.category);
        document.getElementById('question').textContent = question.question;
        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';

        const answers = [
            ...question.incorrect_answers,
            question.correct_answer
        ].sort(() => Math.random() - 0.5);

        // Ajouter les gestionnaires d'événements pour les boutons d'aide
        const helperButtons = document.querySelectorAll('.helper-btn');

        // Réactiver tous les boutons d'aide restants
        helperButtons.forEach(btn => {
            btn.disabled = false;
        });

        helperButtons.forEach(button => {
            button.onclick = () => {
                // Désactiver tous les boutons d'aide
                helperButtons.forEach(btn => {
                    btn.disabled = true;
                });

                // Supprimer uniquement le bouton cliqué
                button.remove();

                // Trouver les mauvaises réponses
                const incorrectAnswers = answers.filter(answer => answer !== question.correct_answer);

                // Sélectionner aléatoirement deux mauvaises réponses à masquer
                const answersToHide = new Set(
                    incorrectAnswers
                        .toSorted(() => Math.random() - 0.5)
                        .slice(0, 2)
                );

                // Masquer les réponses sélectionnées
                const answerButtons = answersContainer.querySelectorAll('button');
                answerButtons.forEach(btn => {
                    if (answersToHide.has(btn.textContent)) {
                        btn.style.opacity = '0';
                        btn.disabled = true;
                    }
                });
            };
        });

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