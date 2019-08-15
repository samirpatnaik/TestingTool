import { Component, OnInit } from '@angular/core';
import {QuizService} from '../services/quiz.service'
import { MultiOptionModel } from '../models/multiOptionModel';
import {JavaCodeModel} from '../models/javaCodeModel';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Question, Quiz, QuizConfig } from '../models/index';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit {

  multiquestionlist:MultiOptionModel[];
  codequestionlist:JavaCodeModel[];
  data: any;

  quizForm: FormGroup;
  submitted = false;

  starttest: boolean;
  quiz: Quiz = new Quiz(null);
  questions: Question[];
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 0,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  multipager = {
    pageindex: 0,
    size: 1,
    count: 1
  };

  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';

  constructor(private formBuilder: FormBuilder,private _quizservice: QuizService, private router: Router, private session: SessionStorageService) { }

  ngOnInit() {

    this.quizForm = this.formBuilder.group({
      answer: ['']
    });
    
    this._quizservice.multiplequestionlist().subscribe(responseList => {
        this.quiz = new Quiz(responseList);
        this.multipager.count = this.quiz.questions.length;
        this.startTime = new Date();
        this.ellapsedTime = '00:00';
        this.timer = setInterval(() => { this.tick(0); }, 1000);
        this.starttest = true;
    });
  }

  tick(index: number) {
    if(this.starttest){
      this.config.duration = this.quiz.questions[index].allowtime;    
      const now = new Date();
      let diff = (now.getTime() - this.startTime.getTime()) / 1000;
      if (diff >= this.config.duration) {
        diff = 0;
        clearInterval(this.timer);
        this.goTo(index + 1);
      }
      this.ellapsedTime = this.parseTime(diff);
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
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.multipager.pageindex, this.multipager.pageindex + this.multipager.size) : [];
  }
  goTo(pageindex: number) {

    if(pageindex <= this.multipager.count){
      let answers = {
        'userId': this.session.get('currentUser'),
        'quizId': this.quiz.questions[pageindex-1].id,
        'answered': this.quizForm.controls['answer'].value,
        'qtype': 'multi'
      };
      this._quizservice.addmultianswer(answers).subscribe(result =>{});
    }

    if (pageindex >= 0 && pageindex < this.multipager.count) {  
      this.ellapsedTime = '00:00'; 
      this.startTime = new Date();   
      this.timer = setInterval(() => { this.tick(pageindex); }, 1000);
      this.multipager.pageindex = pageindex;
      this.mode = 'quiz';
      this.quizForm.controls['answer'].reset();
    }
    else{
      this.mode = 'result';
      clearTimeout(this.timer);
      this.starttest = false;
      this.router.navigateByUrl('/quiz', {skipLocationChange: true}).then(()=>
      this.router.navigate(["/testcode"])); 
    }
  }
}
