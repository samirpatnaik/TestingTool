import { CodeQuestion } from './codequestion';

export class CodeQuiz {
    questions: CodeQuestion[];

    constructor(data: any) {
        if (data) {
            this.questions = [];
            data.forEach(q => {
              this.questions.push(new CodeQuestion(q));
            });
           // console.log(this.questions);
        }
    }
}
