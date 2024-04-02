import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../services/http-request.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../../frontend/pages/login/login.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SeoServiceService }  from '../../services/seo-service.service';
@Component({
	selector: 'app-verify',
	templateUrl: './verify.component.html',
	styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

	public userType : string = '';
	public errorMSG : string = '';
	purpose: string;
	token: string;
	title = 'Account Activation';
	constructor(private route: ActivatedRoute, private http: HttpRequestService, private myRoute: Router,private modalService: NgbModal, public SeoService:SeoServiceService) { }

	ngOnInit() {
		this.SeoService.getMetaInfo();
		this.purpose = this.route.snapshot.paramMap.get("porpuse");
		this.token = this.route.snapshot.paramMap.get("token");

		// console.log(this.purpose);
		// console.log(this.token);

		if (this.purpose === 'verify-email') {

			this.http.get(`account/verify/${this.token}`).subscribe((response) => {
					
				// console.log(response['data']);	
				// console.log(response['data'].roles[0].name);			
				if(response['status'] === 'success')
				{				
					this.userType = response['data'].roles[0].name ? response['data'].roles[0].name : 'customer';					
				}

			}, (errors) => {
				// console.log(errors);				
				if(errors)
				{
					this.errorMSG = errors.error.message;
				}				
				//this.myRoute.navigate(['/']);
			});

		}
	}

	loginFormModal() {

		const ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};


		const modalRef = this.modalService.open(LoginComponent, ngbModalOptions);

		modalRef.result.then((result) => {

			if (localStorage.getItem('userRole') === 'admin') {
				this.myRoute.navigate(['/admin/dashboard']);
			} else if (localStorage.getItem('userRole') === 'vendor') {
				this.myRoute.navigate(['/dashboard']);
			} else if (localStorage.getItem('userRole') === 'customer') {
				this.myRoute.navigate(['/dashboard/profile']);
			} else {
				this.myRoute.navigate(['/dashboard']);
			}

		}).catch((error) => {

		});
	}

}
