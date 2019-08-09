import { CodeOption } from './codeoption';

export class CodeQuestion {

    qtype: string;
    id: string;
    name: string;
    allowtime: number;
    inputItems : CodeOption[];

    constructor(data: any) {
        data = data || {};
        this.id = data._id;
        this.name = data.question_title;
        this.qtype = data.qtype;
        this.inputItems = [];
        this.allowtime = data.allowtime;
        data.inputItems.forEach(o => {
            this.inputItems.push(new CodeOption(o));
        });
    }
}
