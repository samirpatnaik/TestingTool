
export class Question {
    id: string;
    name: string;
    questionType: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    option5: string;
    correctoption: string;
    allowtime: number;

    constructor(data: any) {
        data = data || {};
        this.id = data._id;
        this.name = data.question_title;
        this.questionType = data.qtype;
        this.option1 = data.answer1;
        this.option2 = data.answer2;
        this.option3 = data.answer3;
        this.option4 = data.answer4;
        this.option5 = data.answer5;
        this.correctoption =  data.correctanswer;
        this.allowtime = data.allowtime;
    }
}