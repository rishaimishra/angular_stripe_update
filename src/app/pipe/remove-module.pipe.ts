import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  	name: 'removeModule'
})
export class RemoveModulePipe implements PipeTransform {
  	transform(items: any[]): any[] {
		var removeKey = [];
		Object.keys(items).forEach((key, i) => {
			if (items[key].course_lectures.length === 0) {
				removeKey.push(i);
			}
		});
		removeKey.reverse().forEach(function(x) {
			items.splice(x);
		});
		return items;
   	}
}
