import { Component, OnInit, Input,OnChanges } from '@angular/core';

@Component({
  	selector: 'form-validation-message',
  	templateUrl: './validation-message.component.html',
  	styleUrls: ['./validation-message.component.css']
})
export class ValidationMessageComponent implements OnChanges{

	@Input() fromInstance   : any;
	@Input() fieldName      : string = 'field';
	@Input() minValue :number;
	@Input() maxValue :number;
	
	
	public messages         : any; 
	public define_messages  : any


	public invalid : boolean = true;
	public dirty   : boolean = false;
	public touched : boolean = false;
 
	ngOnChanges(){
		this.fromInstance.valueChanges.subscribe((r)=>{
			// console.log(this.fromInstance, ' as');
			this.invalid 	= this.fromInstance.invalid;
			this.dirty 		= this.fromInstance.dirty;
			this.touched 	= this.fromInstance.touched;			
		});
	}
 
}
