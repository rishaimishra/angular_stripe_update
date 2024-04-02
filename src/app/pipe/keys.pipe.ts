import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  	transform(value, args:string[]) : any {
		let keys = [];
		value = JSON.parse(value);
		for(let key in value){
			if (value[key] != '') {
				keys.push({key: key, value: value[key]});
			}
		}
		return keys;
  	}
}