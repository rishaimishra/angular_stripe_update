import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { GlobalConstantService } from './global-constant.service';
import { httpResponse } from '../interface/http.request';
import { catchError, tap, mergeMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { EncrDecrService } from './encr-decr.service';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Injectable()
export class HttpRequestService {

	protected jwtHelper: any = new JwtHelperService();
	protected base_url: string = this.constant.API_URL;
	protected auth_url: string = 'login';
	protected social_auth_url: string = 'login/social';

	private module: any;
	public httpOptions: any;

	public vendorPerPage: Number = 10;
	public frontendPerPage: Number = 9;
	public adminPerPage: Number = 10;

	constructor(
		private http: HttpClient,
		private constant: GlobalConstantService,
		private router: Router,
		private EncrDecr: EncrDecrService 
	) {
		//let encKey=this.EncrDecr.set('123456$#@$^@1ERF','#SLM2019Matrix'+(new Date().getTime()+ 60000*10).toString());
		let encKey=this.EncrDecr.set(env.encrDecrKey,'#SLM2019Matrix'+(new Date().getTime()+ 10000).toString());
		this.httpOptions = {
			headers: new HttpHeaders({ 
				'Content-Type': 'application/json' ,
				 'Authorization':localStorage.getItem('token')? localStorage.getItem('token'):'',
				 'api_key':encKey
			})
		};
	 }

	public setModule(moduleName: string) {
		
		let encKey=this.EncrDecr.set(env.encrDecrKey,'#SLM2019Matrix'+(new Date().getTime()+ 10000).toString());
		// console.log(encKey,'encKey');
		this.module = null;
		if (moduleName in this.constant.apiModules) {
			this.module = this.constant.apiModules[moduleName];
			this.httpOptions = {
				headers: new HttpHeaders({ 
					'Content-Type': 'application/json' ,
					 'Authorization': localStorage.getItem('token')?localStorage.getItem('token'):'',
					 'api_key':encKey
				})
			};
		}
		return this;
	}

	private getReq(url): Observable<any> {
		return this.http.get<any>(url, this.httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Get one data based on id'))
		);
	}

	private postReq(url, params): Observable<any> {
		return this.http.post<any>(url, params, this.httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Save data with params'))
		);
	}

	private putReq(url, params): Observable<any> {
		return this.http.put<any>(url, params, this.httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Update data with params'))
		);
	}

	private deleteReq(url): Observable<any> {
		return this.http.delete<any>(url, this.httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Delete data with params'))
		);
	}

	private patchReq(url, params): Observable<any> {
		return this.http.patch<any>(url, params, this.httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Delete data with params'))
		);
	}

	buildRequestByMethod(methodName: string, urlParamStr: string = '', paramsObj: any = null ): Observable<any> {

		if (!this.module) {
			return throwError({
				error: {
					message: 'Module not found!'
				}
			});
		}


		const method = this.module.methods.find((el) => {
			return (el.name === methodName);
		});

		let url = this.module ? this.module.url : '';
		if (method) {
			url += method.url;
		}
		url += urlParamStr;

		if (method) {
			switch (method.type) {
				case 'get':
					return this.getReq(url);
				case 'post':
					return this.postReq(url, paramsObj);
				case 'delete':
					return this.deleteReq(url);
				case 'put':
					return this.putReq(url, paramsObj);
				case 'patch':
					return this.patchReq(url, paramsObj);
				default:
					return throwError({
						error: {
							message: 'Definition not found in configuration'
						}
					});
			}
		} else {
			return throwError({
				error: {
					message: 'Definition not found in configuration'
				}
			});
		}
	}

	findOne(id: string, optParams: any = null): Observable<any> {
		console.log('call');
		let url = '';
		if (!id) {
			return throwError({
				error: {
					message: 'Id not found'
				}
			});
		}
		url += '/' + id;
		const routeParams = optParams || {};
		url += this.__objectToUrl(routeParams);

		return this.buildRequestByMethod('details', url);
		// return this.http.get<any>(url, this.httpOptions).pipe(
		// 	tap((data: any) => {
		// 		return data;
		// 	}),
		// 	catchError(this.handleError<any>('Get one data based on id'))
		// );
	}

	search(params: any): Observable<any> {
		// let url = this.module ? this.module.url : '';
		let url = '';
		url += this.__objectToUrl(params);
		return this.buildRequestByMethod('list', url);
		// return this.http.get<any>(url, this.httpOptions).pipe(
		// 	tap((data: any) => {
		// 		return data;
		// 	}),
		// 	catchError(this.handleError<any>('Get all data based on query'))
		// );
	}

	list(params: any): Observable<any> {
		let url = this.module ? this.module.url : '';
		if (this.module) {
			const method = this.module.methods.filter((element) => (element.name === 'list'));
			url += method[0].url;
		}
		url += this.__objectToUrl(params);
		return this.http.get<any>(url, this.httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Get all data based on query'))
		);
	}

	create(params: any): Observable<any> {
		// const url = this.module ? this.module.url : '';
		const url = '';
		return this.buildRequestByMethod('create', url, params);
		// return this.http.post<any>(url, params, this.httpOptions).pipe(
		// 	tap((data: any) => {
		// 		return data;
		// 	}),
		// 	catchError(this.handleError<any>('Save data with params'))
		// );
	}

	update(params: any): Observable<any> {
		// let url = this.module ? this.module.url : '';
		let url = '';
		if (!('id' in params)) {
			return throwError({
				error: {
					message: 'Id not found'
				}
			});
		}
		url += '/' + params['id'];
		return this.buildRequestByMethod('update', url, params);
		// return this.http.put<any>(url, params, this.httpOptions).pipe(
		// 	tap((data: any) => {
		// 		return data;
		// 	}),
		// 	catchError(this.handleError<any>('Update data with params'))
		// );
	}

	deleteOne(params: any): Observable<any> {
		// let url = this.module ? this.module.url : '';
		let url = '';
		if (!('id' in params)) {
			return throwError({
				error: {
					message: 'Id not found'
				}
			});
		}
		url += '/' + params['id'];
		delete params.id;
		url += this.__objectToUrl(params);
		return this.buildRequestByMethod('delete', url);
		// return this.http.delete<any>(url, this.httpOptions).pipe(
		// 	tap((data: any) => {
		// 		return data;
		// 	}),
		// 	catchError(this.handleError<any>('Delete data with params'))
		// );
	}

	generateSXLAddress(params): Observable<any> {
		let url = this.constant.sxl.url;
		url += '/ethgen.php';

		const httpOptions = {
			headers: new HttpHeaders({
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0',
				'Content-Type': 'application/json'
			})
		};

		return this.http.post<any>(url, params, httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('SXL data with params'))
		);
	}

	checkSXLAddress(params): Observable<any> {
		let url = this.constant.sxl.url;
		url += '/checkSXL.php';

		url += this.__objectToUrl(params);

		const httpOptions = {
			headers: new HttpHeaders({
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0',
				'Content-Type': 'application/json'
			})
		};

		return this.http.get<any>(url, httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('SXL data with params'))
		);
	}

	getPaypalToken(): Observable<any> {
		let url = this.constant.paypal.url;
		url += '/oauth2/token';


		const credentials = btoa(this.constant.paypal.clientId + ':' + this.constant.paypal.secret);

		const httpOptions = {
			headers: new HttpHeaders({
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
				'Accept-Language': 'en_US',
				'authorization': 'Basic ' + credentials
			})
		};

		const paramBody = new URLSearchParams();
		const params = {
			grant_type: 'client_credentials'
		};

		Object.keys(params).forEach((k) => {
			paramBody.set(k, params[k]);
		});

		return this.http.post<any>(url, paramBody.toString(), httpOptions).pipe(
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Paypal data with params'))
		);
	}

	sendPaypalPayment(params) {
		let url = this.constant.paypal.url;
		url += '/payments/payment';

		return this.getPaypalToken().pipe(
			mergeMap((tokenRes) => {
				const httpOptions = {
					headers: new HttpHeaders({
						'Cache-Control': 'no-cache, no-store, must-revalidate',
						'Pragma': 'no-cache',
						'Expires': '0',
						'Content-Type': 'application/json',
						'authorization': tokenRes.token_type + ' ' + tokenRes.access_token
					})
				};
				// httpOptions.headers.set('authorization', tokenRes.token_type + ' ' + tokenRes.access_token);
				return this.http.post<any>(url, params, httpOptions);
			}),
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Paypal data with params'))
		);
	}

	getPaypalPaymentDetails(paymentId) {
		let url = this.constant.paypal.url;
		url += '/payments/payment/' + paymentId;

		return this.getPaypalToken().pipe(
			mergeMap((tokenRes) => {
				const httpOptions = {
					headers: new HttpHeaders({
						'Cache-Control': 'no-cache, no-store, must-revalidate',
						'Pragma': 'no-cache',
						'Expires': '0',
						'Content-Type': 'application/json',
						'authorization': tokenRes.token_type + ' ' + tokenRes.access_token
					})
				};
				// httpOptions.headers.set('authorization', tokenRes.token_type + ' ' + tokenRes.access_token);
				return this.http.get<any>(url, httpOptions);
			}),
			tap((data: any) => {
				return data;
			}),
			catchError(this.handleError<any>('Paypal data with params'))
		);
	}

	// get(url, data_params = null, fullpath = false): Observable<httpResponse[]> {
	// 	//console.log(data_params);

	// 	// console.log(JSON.stringify(data_params),'data');
	// 	// var encrypted = this.EncrDecr.set('123456$#@$^@1ERF', JSON.stringify(data_params));
	// 	// console.log(encrypted,'encrypted');
	// 	// var decrypted = this.EncrDecr.get('123456$#@$^@1ERF', encrypted);
	// 	// console.log(decrypted,'decrypted');
	// 	//console.log(this.EncrDecr.get(env.encrDecrKey, params),'Dycripted Value');

	// 	// let encDataParams = data_params?{params:this.EncrDecr.set('123456$#@$^@1ERF', JSON.stringify(data_params))}: {};
	// 	 //console.log(encDataParams,'Encryted value');
	// 	 //console.log(JSON.parse(this.EncrDecr.get('123456$#@$^@1ERF', decodeURIComponent(encDataParams.params))),"Dycrypt value");
	// 	// let params = data_params ? { params: encDataParams } : {};
		


	// 	let params = data_params ? { params: data_params } : {};
	// 	let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
		
	// 	return this.http.get<httpResponse[]>(action_url, params);

		
	// }

	get(url, data_params = null, fullpath = false): Observable<any> {

		let encKey=this.EncrDecr.set(env.encrDecrKey,'#SLM2019Matrix'+(new Date().getTime()+ 60000*10).toString());
		
		this.httpOptions = {
			headers: new HttpHeaders({ 
				'Content-Type': 'application/json' ,
				 'Authorization':localStorage.getItem('token')? localStorage.getItem('token'):'',
				 'api_key':encKey
			})
		};

		 if(data_params){
	 	 	url += this.__objectToUrl(data_params);
	 	 }
	 	 let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
	 	 
	 	 return this.http.get<any>(action_url,this.httpOptions);

	}

	// post(url, data, fullpath = false): Observable<httpResponse[]> {
	// 	let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
	// 	return this.http.post<httpResponse[]>(action_url, data);
		
	// }
	post(url, data, fullpath = false): Observable<any> {
		let encKey=this.EncrDecr.set(env.encrDecrKey,'#SLM2019Matrix'+(new Date().getTime()+ 60000*10).toString());
		
		this.httpOptions = {
			headers: new HttpHeaders({ 
				'Content-Type': 'application/json' ,
				 'Authorization':localStorage.getItem('token')? localStorage.getItem('token'):'',
				 'api_key':encKey
			})
		};
		
		let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
		return this.http.post<any>(action_url, data,this.httpOptions);
		
	}

	// put(url, data, fullpath = false): Observable<httpResponse[]> {
	// 	let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
	// 	return this.http.put<httpResponse[]>(action_url, data);
	// }

	put(url, data, fullpath = false): Observable<any> {
		let encKey=this.EncrDecr.set(env.encrDecrKey,'#SLM2019Matrix'+(new Date().getTime()+ 60000*10).toString());
		
		this.httpOptions = {
			headers: new HttpHeaders({ 
				'Content-Type': 'application/json' ,
				 'Authorization':localStorage.getItem('token')? localStorage.getItem('token'):'',
				 'api_key':encKey
			})
		};
		let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
		return this.http.put<httpResponse[]>(action_url, data,this.httpOptions);
	}


	// delete(url, fullpath = false): Observable<httpResponse[]> {
	// 	let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
	// 	return this.http.delete<httpResponse[]>(action_url);
	// }
	delete(url, fullpath = false): Observable<any> {
		let encKey=this.EncrDecr.set(env.encrDecrKey,'#SLM2019Matrix'+(new Date().getTime()+ 60000*10).toString());
		
		this.httpOptions = {
			headers: new HttpHeaders({ 
				'Content-Type': 'application/json' ,
				 'Authorization':localStorage.getItem('token')? localStorage.getItem('token'):'',
				 'api_key':encKey
			})
		};
		let action_url = (fullpath == true) ? url : `${this.base_url}/${url}`;
		return this.http.delete<any>(action_url,this.httpOptions);
	}


	isAuthinticate() {
		let token = localStorage.getItem('token');
		if (!token) return false;

		let expirationDate = this.jwtHelper.getTokenExpirationDate(token);
		let isExpired = this.jwtHelper.isTokenExpired(token);
		return !isExpired || (Date.now() <= new Date(expirationDate).getTime());
	}

	getToken() {
		return localStorage.getItem('token');
	}

	setLastActivateTime() {
		const curTs = (new Date()).getTime();
		localStorage.setItem('last-active-time', curTs.toString());
	}

	getLastActivateTime(): Observable<any> {
		const lastTime = localStorage.getItem('last-active-time') || null;
		if (lastTime) {
			const curTs = (new Date()).getTime();
			const diff = (curTs - parseInt(lastTime, 10));
			const seconds = (diff /  1000);
			const minutes = (diff / (60 * 1000));
			const hours = (diff / (60 * 60 * 1000));
			return of({
				lastActiveTime: parseInt(lastTime, 10),
				diffObj: {
					milliseconds: diff,
					seconds: Math.round(seconds),
					minutes: Math.round(minutes),
					hours: Math.round(hours),
				}
			});
		}
		return of(lastTime);
	}

	getUser(param = null) {
		const token = localStorage.getItem('token');
		if (!token) {
			return false;
		}
		const user = this.jwtHelper.decodeToken(token).user;
		return param ? (user[param] || null) : user;
	}

	getUserObservable(): Observable<any> {
		const token = localStorage.getItem('token');
		if (!token) {
			return of(null);
		}
		const user = this.jwtHelper.decodeToken(token);
		return of(user);
	}

	getLoggedUser(): Observable<any> {
		const token = localStorage.getItem('token');
		if (!token) {
			return of(null);
		}
		const loggedObj = this.jwtHelper.decodeToken(token);
		return of(loggedObj);
	}

	getUserRole() {
		let token = localStorage.getItem('token');
		if (!token) return false;
		let role = this.jwtHelper.decodeToken(token).roles;
		return role;
	}
	checkKyc() {
		let token = localStorage.getItem('token');
		if (!token) return false;
		let kyc_status = this.jwtHelper.decodeToken(token).user.is_kyc;
		// console.log(this.jwtHelper.decodeToken(token).user);
		return kyc_status;
	}

	authinticate(credentials, loginType?) {
		let url = '';
		if (loginType === 'social') {
			url = this.social_auth_url;
		} else {
			url = this.auth_url;
		}

		return new Promise((resolve, reject) => {
			this.post(url, credentials).subscribe((response) => {
				if (response['status'] === 'success') {
					localStorage.setItem('token', response['token']);
					localStorage.setItem('login_at', new Date().getTime().toString());
					localStorage.setItem('name', this.getUser().profile.first_name ? this.getUser().profile.first_name + ' ' + this.getUser().profile.last_name : this.getUser().user_name);
					localStorage.setItem('userRole', this.getUserRole()[0]);
					localStorage.setItem('tutorAgreement',this.getUser().agreement_pdf);
					resolve(true);
				} else {
					resolve(false);
				}
			}, (errors) => {
				reject(errors);
			});
		});
	}

	doLogout() {
		localStorage.clear();
		//this.router.navigate(['/login']);
		// this.router.navigate(['/']);
		window.location.href ='/';
	}

	idealModeLogout(minute = 5) {

		this.router.events.subscribe((val) => {
			if (this.isAuthinticate()) {
				let timePrev = parseInt(localStorage.getItem('login_at'));
				let timeNow = new Date().getTime();
				let timeDiff = Math.floor((timeNow - timePrev) / 1000 / 60);

				if (timeDiff > minute) {
					this.doLogout();
					return;
				}

				localStorage.setItem('login_at', timeNow.toString());
			}
		});
	}

	hasPermission(name: string) {
		let token = localStorage.getItem('token');
		if (!token) return false;

		let permissions = this.jwtHelper.decodeToken(token).permissions;
		if (!permissions) return false;

		if (name.indexOf('|') >= 0) {
			return !!name.split('|').filter(v => permissions.indexOf(v) >= 0).length;
		}

		if (name.indexOf(',') >= 0) {
			return (name.split(',').filter(v => permissions.indexOf(v) >= 0).length) === (name.split(',').length);
		}

		return permissions.indexOf(name) >= 0;
	}

	hasRole(name: string) {
		let token = localStorage.getItem('token');
		if (!token) return false;

		let roles = this.jwtHelper.decodeToken(token).roles;

		if (!roles) return false;

		if (name.indexOf('|') >= 0) {
			return !!name.split('|').filter(v => roles.indexOf(v) >= 0).length;
		}

		if (name.indexOf(',') >= 0) {
			return (name.split(',').filter(v => roles.indexOf(v) >= 0).length) === (name.split(',').length);
		}

		return roles.indexOf(name) >= 0;
	}

	isLoggednIn() {
		return this.getToken() !== null;
	}

	private __objectToUrl(dataParams: any): string {
		let url = '';
		if (Object.keys(dataParams).length > 0) {
			Object.keys(dataParams).forEach((key, k) => {
				if (dataParams[key]) {
					url += (k === 0) ? '?' : '&';
					url += key + '=' + encodeURI(dataParams[key]);
				}
			});
		}
		return url;
	}

	public handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			throw error;
		};
	}

	isCourseEditable () {
		if(localStorage.getItem('courseEditId')) {
			
		return	this.get(`utility/course-order-status/${localStorage.getItem('courseEditId')}`).pipe(
				mergeMap((response) => {
			
				if (response['status']=='success') {
					return of (true);
				} else {
					return of (false);
				}
			}));
			
		} else {
			
			return of (false);
		}
		
	}

	getSiteSettings() {
		this.get(`site-setting`).subscribe ((response) => {
			//	console.log(response['data']);
				let getSettingsValue = response['data'].reduce(function(result, item) {
					//console.log(item,'item');
					result[item['access_key']] = item['value'];
					return result;
				}, {});
				//console.log(getSettingsValue);
				//localStorage.setItem('siteSettings',JSON.stringify(getSettingsValue));
				localStorage.setItem('siteSettings', this.EncrDecr.set(env.encrDecrKey,JSON.stringify(getSettingsValue)));
				//console.log(JSON.parse(localStorage.getItem('siteSettings')));
	
			});
	}
	
	
	
}
