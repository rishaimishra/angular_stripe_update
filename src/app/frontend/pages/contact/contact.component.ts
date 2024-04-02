import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { ContactUsCollection } from '../../../_collection/contact_us.collection';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment as env } from '../../../../environments/environment';
import { EncrDecrService } from '../../../services/encr-decr.service';
import {
	FormBuilder,
	Validators,
	FormGroup
} from '@angular/forms';
import { CustomValidator } from '../../../common/validator';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactComponent implements OnInit {

  public error_messages: any = [];
  //public contactUsForm: any = new ContactUsCollection();
  public success_message: any = [];
  public success_messages: any  = [];
  public title: any;
  public countryList: any = [];
  public address: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).address : env.address;

  public phone_number: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).phone_number : env.phone_number;

  public mail_address: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).mail_address : env.mail_address;

  contactForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    protected http: HttpRequestService,
    protected router: Router,
    private ngxService: NgxUiLoaderService,
    public SeoService:SeoServiceService,
    private EncrDecr: EncrDecrService 
  ) {}
  
  ngOnInit() { 
    this.SeoService.getMetaInfo();
    this.title = 'Contact Us';
    //this.contactUsForm.phone_code = '91';
    this.contactForm = this.fb.group({
			email: ['', [Validators.required, CustomValidator.email]],
			name: ['', Validators.required],
			mobile_no: ['', [Validators.required]],
			phone_code: ['+91(IN)', [Validators.required]],
			message: ['', [Validators.required]]
		});
    this.getCountries();
  }

  getCountries() {
    const params = {};
    this.ngxService.start();
		this.http.get(`utility/location/countries`)
		.subscribe((response) => {
      this.ngxService.stop();
			if (response) {
				if (response['data']) {
					this.countryList = response['data'].map((i) => { 
						i.label = '+'+i.phone_code + '(' + i.code + ')';
						i.image = 'assets/flag_png/'+i.code.toLowerCase()+'.png';
						 return i; });
				}
      }
      
		}, (error) => {
      this.ngxService.stop();
			this.countryList = {};
		});
  }
  
  public saveContactUs() {
  //  console.log(this.contactForm.value);
   
    this.ngxService.start();
    const form_data = this.contactForm.value;
      // console.log(formData);
      this.http.post('contact', form_data).subscribe((response) => {
      this.ngxService.stop();
      if (response['status'] === 'success') {
        this.contactForm.reset();
        this.error_messages = '';
				this.success_messages = 'Thanks for your message!. We will get back you soon!.';      
      }
    }, (errors) => {
      this.success_messages = '';
			this.error_messages = errors;
    })
  }
}
