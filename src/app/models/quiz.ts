import { QuizConfig } from './quiz-config';
import { Question } from './question';

export class Quiz {
    config: QuizConfig;
    questions: Question[];

    constructor(data: any) {
        if (data) {
            this.questions = [];
            data.forEach(q => {
              this.questions.push(new Question(q));
            });
        }
    }
}
