import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { Router} from '@angular/router';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AboutComponent implements OnInit {
  public myTeam: any = [];
  ourTeam = { items: 4, autoplay: true, loop: true, autoplayTimeout: 2000, autoplayHoverPause: true, lazyLoad: true, dots: false, responsiveClass: true, nav: true, margin: 25, responsive: { 0: { items: 1 }, 400: { items: 2, margin: 10 }, 1023: { items: 3, margin: 10 }, 1138: { items: 5 } } };
  testimonial = { items: 3, dots: false, nav: true, margin: 30, responsive: { 0: { items: 1 }, 1024: { items: 2, margin: 10 }, 1138: { items: 3 } } };
  vendors = { items: 5, dots: false, nav: true, margin: 15, responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 3, margin: 10 }, 1138: { items: 5 } } };

  constructor(
    private http: HttpRequestService, 
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    public router:Router,
    public SeoService:SeoServiceService
    ) { 
    }
  title: any;
  content: any;
  ngOnInit() {
    this.getData();
    window.scroll(0,0);
    this.getMyTeam();
    this.SeoService.getMetaInfo();
  }

  

  getData() {
    this.ngxService.start();
    this.http.get('cms-page/about').subscribe((response) => {
      if (response['status'] === 'success') {
        this.ngxService.stop();
        this.title = response['data'].title;
        this.content = response['data'].content;

      //  this.titleService.setTitle(response['data'].title);
      //  this.meta.addTag({ name: 'description', content: response['data'].description });
        // this.titleService.setTitle(response['data'].title);
        // this.meta.updateTag({ name: 'description', content:  response['data'].description });
      }
    }, (errors) => {
			this.ngxService.stop();
		});
  }

  public getMyTeam() {
    this.ngxService.start();
		const params = {
			pagination: true,
			limit: 10,
			is_active: true
		};
    this.http.get(`our-team`, params).subscribe((response) => {
			if (response) {
        this.ngxService.stop();
				this.myTeam = response['data'];
			}
		}, (error) => {
      this.ngxService.stop();
			// console.log(error);
		});
	}

}
