import { HttpRequestService } from '../services/http-request.service';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CourseResolver implements Resolve<any> {

  	constructor(
		private http: HttpRequestService,
		protected router : Router
	) { }

	public news: any = undefined;
	resolve(route: ActivatedRouteSnapshot) {
		let slug: any = route.params['slug'];
		let user: any = this.http.getUser();
		this.http.get(`utility/check-tutor-course/${slug}/${user.id}`).subscribe((response) => {
			if (response['data'].length === 0) {
				this.router.navigate(['/course-details/' + slug]);
			}
		}, (errors) => {
		});
		return user;
	}
}