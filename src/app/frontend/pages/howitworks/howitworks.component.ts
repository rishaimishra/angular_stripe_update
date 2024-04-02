import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';

@Component({
  selector: 'app-howitworks',
  templateUrl: './howitworks.component.html',
  styleUrls: ['./howitworks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HowitworksComponent implements OnInit {

  public pageType = 'how-it-works';
  public banner: any = [];

  constructor(
    protected activeRoute: ActivatedRoute,
    private myRoute: Router,
    private ngxService: NgxUiLoaderService,
    private http: HttpRequestService,
    public SeoService:SeoServiceService
    ) { }
  title: any;
  content: any;
  ngOnInit() {
    this.SeoService.getMetaInfo();
    // console.log(this.activeRoute.snapshot.url[0].path);
    this.getData();
    this.getSlides(this.pageType);
    window.scroll(0,0);
  }

  public getSlides(pageType) {
    this.ngxService.start();
    this.http.get(`page-slider?page=${pageType}&is_active=true`).subscribe((response) => {
      this.ngxService.stop();
      if (response['status'] === 'success') {
        
        this.banner = response['data'];
      }
    }, (errors) => {
      // console.log(errors);
    });
  } 

  getData() {
    this.http.get('cms-page/how-it-works').subscribe((response) => {
      if (response['status'] === 'success') {
        this.title = response['data'].title;
        this.content = response['data'].content;
      }
    });
  }

}
