import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment as env } from '../../environments/environment';

import { HttpRequestService } from './http-request.service';
import { PageLoaderService } from './page-loader.service';

@Injectable({
	providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

	constructor(
		private http: HttpRequestService,
		private loaderService: PageLoaderService
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		this.showLoader();

		const urlArr = req.url.split('/');

		if (urlArr.length > 3) {
			if (urlArr[2] === (env.api.host + ':' + env.api.port)) {
				const token = this.http.getToken() ? this.http.getToken() : '';

				const tokenizeReq = req.clone({
					setHeaders: {
						Authorization: token
					}
				});

				return next.handle(tokenizeReq).pipe(tap((event: HttpEvent<any>) => {
					if (event instanceof HttpResponse) {
						this.onEnd();
					}
				}, (err: any) => {
					this.onEnd();
				}));
			} else {
				return next.handle(req);
			}
		} else {
			return next.handle(req);
		}

	}

	private onEnd(): void {
		this.hideLoader();
	}

	private showLoader(): void {
		this.loaderService.show();
	}

	private hideLoader(): void {
		this.loaderService.hide();
	}
}
