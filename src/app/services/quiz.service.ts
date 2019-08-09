import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MultiOptionModel} from  '../models/multiOptionModel';
import { forkJoin } from 'rxjs';  // RxJS 6 syntax
import {JavaCodeModel} from  '../models/javaCodeModel';

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  constructor(private _http: HttpClient) { }


  public codequestionlist(): Observable<any[]>{

    return this._http.get<JavaCodeModel[]>('http://127.0.0.1:3000/javacode/dashboard');

  }
 

  public multiplequestionlist(): Observable<any[]>{

    return this._http.get<MultiOptionModel[]>('http://127.0.0.1:3000/multioption/dashboard');
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    //return forkJoin([response1, response2]);

   /* return this._http.get<MultiOptionModel[]>('http://127.0.0.1:3000/multioption/dashboard',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })*/
  }

  compilecode(javacode): Observable<any>{
    return this._http.post('https://j-compiler-test.herokuapp.com/dev-code-test-platform/compiler/v1/execute', javacode); 
  }

  runcode(javacode): Observable<any>{
    return this._http.post('https://j-compiler-test.herokuapp.com/dev-code-test-platform/test/v1/execute', javacode); 
    
  }

  addanswer(body:any){
    return this._http.post('http://127.0.0.1:3000/multioption/addanswer',body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }
}
