import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {QuizService} from '../services/quiz.service'
import {JavaCodeModel} from '../models/javaCodeModel';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';

import { CodeQuestion, CodeQuiz } from '../models/code/index';
import {CodeQuizConfig} from '../models/code/codequiz-config';
import { SessionStorageService } from 'angular-web-storage';

import 'brace';
import 'brace/mode/java';
import 'brace/theme/github';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  @ViewChild('editor') editor;

  text:string = "package br.com.compiler.test.controller;public class Test {  public static void main(String[] args) { new Test().doProcess(); }  private void doProcess() { // CODE TO RUN AND BUILD OUTPUT EXPECTED }}";
  starttest: boolean;
  result:string;

  codequestionlist:JavaCodeModel[];
  data: any;
  quizForm: FormGroup;

  codequiz: CodeQuiz = new CodeQuiz(null);
  questions: CodeQuestion[];
  mode = 'codequiz';

  codeconfig: CodeQuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 100,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  codepager = {
    index: 0,
    size: 1,
    count: 1
  };
  codetimer: any = null;
  codestartTime: Date;
  codeendTime: Date;
  codeellapsedTime = '00:00';
  codeduration = '';

  constructor(private location: LocationStrategy,private formBuilder: FormBuilder,private _codequizservice: QuizService, private router: Router,  private session: SessionStorageService) { 
    // preventing back button in browser  
        history.pushState(null, null, window.location.href);  
        this.location.onPopState(() => {
          history.pushState(null, null, window.location.href);
        }); 
  }

  ngOnInit() {

    this.quizForm = this.formBuilder.group({
      answer: ['']
    });

    this._codequizservice.codequestionlist().subscribe(responseList => {
        this.codequestionlist = responseList;
        this.codequiz = new CodeQuiz(responseList);
        this.codepager.count = this.codequiz.questions.length;
        this.codestartTime = new Date();
        this.codeellapsedTime = '00:00';
        this.codetimer = setInterval(() => { this.codetick(0); }, 1000);
        this.starttest = true;
    });

  }

  onCodeCompile() {

    const codetotest =  {
      "message": this.text
    }
    this._codequizservice.compilecode(codetotest)
       .subscribe(
         data=> {
          console.log(data);
          this.result =data;
         },
         error=>console.error(error)
       )
  }

  onCodeRun(index: number) {

    var paramval:any;
    var resultval:any;

    for (let j = 0; j < this.codequiz.questions[index].inputItems.length; j++) {
      if(this.codequiz.questions[index].inputItems[j].param1 != ''){
        paramval = this.codequiz.questions[index].inputItems[j].param1; 
      }
      if(this.codequiz.questions[index].inputItems[j].param2 != ''){
        paramval += ','+this.codequiz.questions[index].inputItems[j].param2;
      }
      if(this.codequiz.questions[index].inputItems[j].param3 != ''){
        paramval += ','+this.codequiz.questions[index].inputItems[j].param3;
      }
      if(this.codequiz.questions[index].inputItems[j].param4 != ''){
        paramval += ','+this.codequiz.questions[index].inputItems[j].param4;
      }
      if(this.codequiz.questions[index].inputItems[j].param5 != ''){
        paramval += ','+this.codequiz.questions[index].inputItems[j].param5;
      }
      if(this.codequiz.questions[index].inputItems[j].result != ''){
        resultval += this.codequiz.questions[index].inputItems[j].result;
      }
      const codetotest = {
        'params': [paramval],
        'sourceMainToTest': this.text
      };

      this._codequizservice.runcode(codetotest)
      .subscribe(
        data=> {
          setTimeout(() => {
          //  console.log(data);
            this.result = data;
          }, 1000);  //1s
        },
        error=>console.error(error)
      )
    } 
  }
  
  codetick(index: number) {
    if(this.starttest){
      this.codeconfig.duration = this.codequiz.questions[index].allowtime;    
      const now = new Date();
      let diff = (now.getTime() - this.codestartTime.getTime()) / 1000;

      if (diff >= this.codeconfig.duration) {
        diff = 0;
        clearInterval(this.codetimer);
        this.codegoTo(index + 1);
      }
      this.codeellapsedTime = this.parseTime(diff);
    }
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.codequiz.questions) ?
      this.codequiz.questions.slice(this.codepager.index, this.codepager.index + this.codepager.size) : [];
  }

  codegoTo(index: number) {

    if(index <= this.codepager.count){
      
      let answers = {
        'userId': this.session.get('currentUser'),
        'quizId': this.codequiz.questions[index-1].id,
        'answered': this.text,
        'output': this.result,
        'qtype': 'code'
      };
      this._codequizservice.addcodeanswer(answers).subscribe(result =>{});
    }

    if (index >= 0 && index < this.codepager.count) {  
      this.codeellapsedTime = '00:00'; 
      this.codestartTime = new Date();   
      this.codetimer = setInterval(() => { this.codetick(index); }, 1000);
      this.codepager.index = index;
      this.mode = 'codequiz';
      this.text = "package br.com.compiler.test.controller;public class Test {  public static void main(String[] args) { new Test().doProcess(); }  private void doProcess() { // CODE TO RUN AND BUILD OUTPUT EXPECTED }}";
      this.quizForm.controls['answer'].setValue('');
      this.result ='';
    }
    else{
      this.starttest = false;
      this.mode = 'result';
      this.router.navigate(["/thankyou"])
    }
  }
}
