export class JavaCodeModel{
    _id: string;
    question_title: string;
    allowtime: number;
    length: number;
    inputItems :[{  param1:{type:String, default : ''},
                    param2:{type:String, default : ''},
                    param3:{type:String, default : ''},
                    param4:{type:String, default : ''},
                    param5:{type:String, default : ''},
                    result:{type:String, default : ''},
                    rid:{type:String}
                }];

}