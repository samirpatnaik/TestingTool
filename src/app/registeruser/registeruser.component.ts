import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {RegisteruserService} from '../services/registeruser.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-registeruser',
  templateUrl: './registeruser.component.html',
  styleUrls: ['./registeruser.component.css']
})
export class RegisteruserComponent implements OnInit {

  regForm: FormGroup;
  submitted = false;
  strMessage: string;
  data: any;
  constructor(private router: Router,private formBuilder: FormBuilder,private _registerservice:RegisteruserService, private _router:Router,private session: SessionStorageService) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required]
    });

    if (this.session.get('currentUser')) {
      // logged in so return true
      this.router.navigate(['/register']);
    }
  }

  get f() { return this.regForm.controls; }

  add_newuser() {
    this.submitted = true;
    if (this.regForm.invalid) {
      return;
    } else {
      this._registerservice.resiteruser(this.regForm.value)
      .subscribe(data =>{
        this.data = data;
//        console.log(this.data);
        if(this.data === 'failed'){
          this.strMessage = "Account information already exists.";
        }
        else{
          //console.log(this.data);
          this.session.set('currentUser', this.data._id);
          this.session.set('firstName', this.data.firstName);
          this.session.set('lastName',this.data.lastName);
          this.router.navigate(['/quiz']);
        }
      });
    }
  }

}
