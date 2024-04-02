import { Injectable } from '@angular/core';
import { Router,CanActivate, RouterStateSnapshot } from '@angular/router';
import { HttpRequestService } from './http-request.service';

@Injectable()

export class PermissionGuard implements CanActivate {

    constructor(
		protected http          : HttpRequestService,
		protected router        : Router,
	) { }

	canActivate(router,state:RouterStateSnapshot){
		
		if(!router.data.permission)
		throw new Error("permissions string is not use in route. eg. data:{permission:'abcd'}");

		if(!this.http.hasPermission(router.data.permission)){
			this.router.navigate(['/access-denied']);
			return false;
		}

		return true;	
  	}
}
