import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisteruserService {

  constructor(private _http:HttpClient) { }

  resiteruser(body:any){
    return this._http.post('http://127.0.0.1:3000/users/registeruser',body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

}
