import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../environments/environment';
import { HelperFunctionService } from './helper-function.service';


@Injectable()
export class S3BucketService {

	protected bucket: any;
	protected Helper: any = new HelperFunctionService();

	constructor() {
		this.configInit();
	}


	protected configInit = function () {
		this.bucket = new S3(environment.s3Credentials.credentials);
	};

	public fileUpload = function (file, filePath = null) {

		const fileExt = file.name.split('.').slice(-1)[0];

		const today = new Date();
		const defaultPath = `srmarketplace/${today.getFullYear()}/${today.getMonth() + 1}/'${this.Helper.UUID()}'.${fileExt}`;

		const params = {
			Bucket: environment.s3Credentials.bucket,
			Key: filePath || defaultPath,
			Body: file,
			ACL: 'public-read'
		};
		return this.bucket.upload(params);
	};

	public uploadS3(file: File, filePath = null): Observable<any> {
		if (file) {
			const promise = new Promise((resolve, reject) => {
				this.fileUpload(file, filePath).send((err, data) => {
					if (err) {
						reject(err);
					}
					resolve(data);
				});
			});
			return from(promise).pipe(
				tap((data) => {
					return data;
				}),
				catchError(this.handleError<any>('Update data with params'))
			);
		} else {
			throw {
				message: 'No file provided'
			};
		}
	}

	public cropedImageUpload = function (file, filePath = null) {

		//	let fileExt		= file.name.split('.').slice(-1)[0];
		let fileExt = 'png';

		let today = new Date();
		let defaultPath = `srmarketplace/${today.getFullYear()}/${today.getMonth() + 1}/'${this.Helper.UUID()}'.${fileExt}`;

		let params = {
			Bucket: environment.s3Credentials.bucket,
			Key: filePath || defaultPath,
			Body: file,
			ACL: 'public-read'
		}

		return this.bucket.upload(params);
	};

	

	public uploadHtmlToPdf (file, filePath = null): Observable<any> {

		//	let fileExt		= file.name.split('.').slice(-1)[0];
		let fileExt = 'pdf';

		let today = new Date();
		let defaultPath = `srmarketplace/${today.getFullYear()}/${today.getMonth() + 1}/'${this.Helper.UUID()}'.${fileExt}`;

		let params = {
			Bucket: environment.s3Credentials.bucket,
			Key: filePath || defaultPath,
			Body: file,
			ACL: 'public-read'
		}

		const promise = new Promise((resolve, reject) => {
			this.bucket.upload(params).send((err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
		return from(promise).pipe(
			tap((data) => {
				return data;
			}),
			catchError(this.handleError<any>('Update data with params'))
		);

		// return this.bucket.upload(params);
	};

	public handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			throw error;
		};
	}

}
