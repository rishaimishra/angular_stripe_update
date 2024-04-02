import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrivacypolicyComponent implements OnInit {

  constructor(
    private http: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    public SeoService:SeoServiceService
    ) { 
      this.SeoService.getMetaInfo();
    }

  title: any;
  content: any;
  ngOnInit() {
    this.getData();
    window.scroll(0,0);
  }

  getData() {
    this.ngxService.start();
    this.http.get('cms-page/privacy-policy').subscribe((response) => {
      this.ngxService.stop();
      if (response['status'] === 'success') {
        this.title = response['data'].title;
        this.content = response['data'].content;
      }
    },(errors) => {
			this.ngxService.stop();
			// this.commonService.showErrors(errors);
			});
  }

}
