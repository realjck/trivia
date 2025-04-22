class QuizManager {
    constructor() {
        this.score = 0;
        this.currentQuestion = null;
    }

    decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    async fetchQuestion() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
            const data = await response.json();
            this.currentQuestion = data.results[0];
            // Décodage des entités HTML pour la question et les réponses
            this.currentQuestion.question = this.decodeHtmlEntities(this.currentQuestion.question);
            this.currentQuestion.correct_answer = this.decodeHtmlEntities(this.currentQuestion.correct_answer);
            this.currentQuestion.incorrect_answers = this.currentQuestion.incorrect_answers.map(
                answer => this.decodeHtmlEntities(answer)
            );
            return this.currentQuestion;
        } catch (error) {
            console.error('Erreur lors de la récupération de la question:', error);
        }
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