import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  implements CanActivate{

  constructor(private session: SessionStorageService, private _router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.session.get('currentUser')) {
      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this._router.navigate(['register']);
      return false;
    }
  }

}
