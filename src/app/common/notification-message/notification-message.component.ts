import { Component,Input,OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'notification-message',
    templateUrl: './notification-message.component.html',
    styleUrls: ['./notification-message.component.css']
})

export class NotificationMessageComponent implements OnChanges {

	@Input() isError  : any = true;
	@Input() messages : any
	

	public display_messages : any = [];

	  constructor() {}
	  
	public edited = false;

	ngOnChanges(){
		this.edited = true;
		if(!this.messages.error) return;

		this.display_messages = [];

		if(this.isError == false){
			this.display_messages.push(this.messages);
			return;
		}

		switch(this.messages.status) {
			case 401:
				var error_message = this.messages.error;
				this.display_messages.push({message:error_message.message});
				break;
			case 403:
				var error_message = this.messages.error;
				this.display_messages.push({message:error_message.message});
				break;
			case 422:
				var error_message 	= this.messages.error.errors;
				this.display_messages = Object.keys(error_message).map((key)=>{ return error_message[key]});
				break;
			default:
				this.display_messages.push({message:'Server error. Please try again after some time.'}); 
		}


		setTimeout(function() {
			this.edited = false;
			// console.log(this.edited);
		}.bind(this), 2000);


	}
}
