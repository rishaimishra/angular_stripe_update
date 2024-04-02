import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class QadataService {

	private messageSource = new BehaviorSubject('');
	currentMessage = this.messageSource.asObservable();

	constructor() { }

	getQuestions(message: any) {
		this.messageSource.next(message);
	}
}
