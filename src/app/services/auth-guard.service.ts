import { Injectable } from '@angular/core';
import { Router,CanActivate, RouterStateSnapshot } from '@angular/router';
import { HttpRequestService } from './http-request.service';

@Injectable()
export class AuthGuard implements CanActivate {

  	constructor(
		protected http 	 : HttpRequestService,
		protected router : Router
	){}

  	canActivate(router,state:RouterStateSnapshot){

		if(this.http.isAuthinticate()) 
			return true;

		//let queryParams = state.url != '/' ? {queryParams:{redirectUrl:state.url}}:{};
		//this.router.navigate(['/'],queryParams);
		this.router.navigate(['/']);
		return false;
	}
}


