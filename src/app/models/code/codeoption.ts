export class CodeOption {
    param1:string;
    param2:string;
    param3:string;
    param4:string;
    param5:string;
    result:string;
    constructor(data: any) {
        data = data || {};
        this.param1 = data.param1;
        this.param2 = data.param2;
        this.param3 = data.param3;
        this.param4 = data.param4;
        this.param5 = data.param5;
        this.result = data.result;
    }
}
