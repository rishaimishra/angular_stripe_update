import { Directive,Input,TemplateRef,ViewContainerRef } from '@angular/core';
import { HttpRequestService } from '../services/http-request.service';

@Directive({
    selector: '[hasPermission]'
})
export class PermissionDirective {

  	constructor(
		protected http 			: HttpRequestService,
		protected templateRef	: TemplateRef<any>, 
		protected viewContainer	: ViewContainerRef,
	){}

	@Input() set hasPermission(prm:string){
		if(this.http.hasPermission(prm)){
			this.viewContainer.createEmbeddedView(this.templateRef);
		}else{
			this.viewContainer.clear();
		}
	}
}
