import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export class CustomValidator {
	
	constructor(
		protected http: HttpClient,
	) { }

	static email(control: AbstractControl): ValidationErrors | null {

		if (control && control.value !== null && control.value !== undefined) {

			let Regex = new RegExp('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$');

			if (!Regex.test(control.value)) {
				return { email: true }
			}

			if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value)) {
				return { email: true }
			}
		}
		return null; 
	}

	static password (control: AbstractControl): ValidationErrors | null {
		if (control && control.value !== null && control.value !== undefined) {

			if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(control.value)) {
				// console.log('not match');
				return { password: true }
			}
		}
		return null;
	}

	static MatchPassword(AC: AbstractControl) {
		let new_password = AC.get('new_password').value; // to get value in input tag
		let retype_password = AC.get('retype_password').value; // to get value in input tag
		if (new_password != retype_password) {
			// console.log('false');
			AC.get('retype_password').setErrors({ MatchPassword: true })
		} else {
			// console.log('true');
			return null;
		}
	}

	static duplicateEmail(AC: AbstractControl){
		
		let seenDuplicate = false,
      	testObject = {};
		AC.value.items.map((item) => {
			let itemPropertyName = item.email;    
			if (itemPropertyName in testObject && itemPropertyName!=null) {
			// testObject[itemPropertyName].duplicate = true;
			// item.duplicate = true;
				seenDuplicate = true;
				AC.get('items').setErrors( {duplicateEmail: true} );
			} else {
				testObject[itemPropertyName] = item;
			}
		});
		// console.log(AC.value);
		//console.log(seenDuplicate,'seenDuplicate');

	}

	static duplicateName(AC: AbstractControl){
		let seenDuplicate = false,
      	testObject = {};
		AC.value.items.map((item) => {
			let first_name = (item.first_name )? item.first_name.toLowerCase() :  item.first_name;
			let last_name =  (item.last_name) ? item.last_name.toLowerCase() : item.last_name; 			
			let  itemPropertyName = first_name + last_name;
			if (itemPropertyName in testObject && itemPropertyName!=null && itemPropertyName) {
		
				seenDuplicate = true;
				AC.get('items').setErrors( {duplicateName: true} );
			
			} else {
				testObject[itemPropertyName] = item;
			}
		});
		// console.log(AC.value);
		// console.log(seenDuplicate,'seenDuplicate');

	}

}

