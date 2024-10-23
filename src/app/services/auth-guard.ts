import { Injectable } from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import {map, take} from 'rxjs/operators';
import {SessionService} from './session.service';


@Injectable({
  providedIn: 'root'
})

/**
 * This service is the AuthGuard service and it is used to guards the routes
 * which are meant to be used only after Authentication. It uses SessionService internally
 * to decide whether session is authenticated or not.
 */
export class AuthGuard implements CanActivate {


  constructor(private session: SessionService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): any {
      return this.session.auth.pipe(
          take(1),
          map(user => {
              const isAuth = !!user
              console.log('User in auth guard', user);
              if (isAuth) {
                  return true;
              } else {
              return this.router.createUrlTree(['/auth/login']);
          }}));
  }


}
