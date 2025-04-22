class QuizManager {
    constructor() {
        this.score = 0;
        this.currentQuestion = null;
        this.questionCount = 0;
        this.maxQuestions = 10;
        this.categoryEmojis = {
            'General Knowledge': '🌐',
            'Entertainment: Books': '📚',
            'Entertainment: Film': '🎬',
            'Entertainment: Music': '🎵',
            'Entertainment: Musicals & Theatres': '🎭',
            'Entertainment: Television': '📺',
            'Entertainment: Video Games': '🎮',
            'Entertainment: Board Games': '🎲',
            'Science & Nature': '🌿',
            'Science: Computers': '💻',
            'Science: Mathematics': '➗',
            'Mythology': '🧙',
            'Sports': '⚽',
            'Geography': '🗺️',
            'History': '🏛️',
            'Politics': '🗳️',
            'Art': '🎨',
            'Celebrities': '🌟',
            'Animals': '🐾',
            'Vehicles': '🚗',
            'Entertainment: Comics': '💥',
            'Science: Gadgets': '📱',
            'Entertainment: Japanese Anime & Manga': '🎌',
            'Entertainment: Cartoon & Animations': '🐭'
        };
        this.questions = [];
    }

    getCategoryWithEmoji(category) {
        // Décodage de la catégorie avant de chercher l'emoji
        const decodedCategory = this.decodeHtmlEntities(category);
        const emoji = this.categoryEmojis[decodedCategory] || '❓';
        return `${emoji} ${decodedCategory}`;
    }

    async fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
            const data = await response.json();
            this.questions = data.results.map(question => ({
                ...question,
                question: this.decodeHtmlEntities(question.question),
                category: this.decodeHtmlEntities(question.category),
                correct_answer: this.decodeHtmlEntities(question.correct_answer),
                incorrect_answers: question.incorrect_answers.map(
                    answer => this.decodeHtmlEntities(answer)
                )
            }));
            return true;
        } catch (error) {
            console.error('Erreur lors de la récupération des questions:', error);
            return false;
        }
    }

    loadNextQuestion() {
        if (this.questionCount >= this.maxQuestions) {
            return null;
        }
        this.currentQuestion = this.questions[this.questionCount];
        return this.currentQuestion;
    }

    resetGame() {
        this.score = 0;
        this.questionCount = 0;
        this.currentQuestion = null;
        this.questions = [];
    }

    decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    checkAnswer(selectedAnswer) {
        if (selectedAnswer === this.currentQuestion.correct_answer) {
            this.score += 10;
            return true;
        }
        return false;
    }

    displayButtons(answers) {
        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';
        
        answers.forEach((answer) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.className = 'btn';
            
            if (answer === 'TRUE') {
                button.classList.add('btn-true');
            } else if (answer === 'FALSE') {
                button.classList.add('btn-false');
            } else {
                button.classList.add('btn-play');
            }
            
            answersContainer.appendChild(button);
        });
    }
}