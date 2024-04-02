import { Directive,Input,TemplateRef,ViewContainerRef } from '@angular/core';
import { HttpRequestService } from '../services/http-request.service';

@Directive({
    selector: '[hasRole]'
})
export class RoleDirective {

  	constructor(
		protected http 			: HttpRequestService,
		protected templateRef	: TemplateRef<any>, 
		protected viewContainer	: ViewContainerRef,
	){}

	@Input() set hasRole(role:string){
		if(this.http.hasRole(role)){
			this.viewContainer.createEmbeddedView(this.templateRef);
		}else{
			this.viewContainer.clear();
		}
	}
}
