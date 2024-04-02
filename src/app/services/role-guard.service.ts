import { Injectable } from '@angular/core';
import { Router,CanActivate, RouterStateSnapshot } from '@angular/router';
import { HttpRequestService } from './http-request.service';

@Injectable()

export class RoleGuard implements CanActivate {

    constructor(
		protected http          : HttpRequestService,
		protected router        : Router,
	) { }

	canActivate(router,state:RouterStateSnapshot){

		if(!router.data.role)
		throw new Error("role string is not use in route. eg. data:{role:'abcd'}");

		if(!this.http.hasRole(router.data.role)){
			// this.router.navigate(['/access-denied']);
			this.router.navigate(['/']);
			return false;
		}

		return true;
  	}
}
