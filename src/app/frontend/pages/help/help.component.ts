import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(
    private ngxService: NgxUiLoaderService,
    public SeoService:SeoServiceService
    ) { }

  ngOnInit() {
    this.SeoService.getMetaInfo();
    this.ngxService.start();
    this.ngxService.stop();
  }

}
