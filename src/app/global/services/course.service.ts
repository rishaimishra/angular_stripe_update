import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CourseService {

	private _objectCount: BehaviorSubject<number> = new BehaviorSubject(0);
	public objectCount$: Observable<number> = this._objectCount.asObservable();

	constructor() { }

	public setObjectCount(value: number) {
		this._objectCount.next(value);
	}
}
