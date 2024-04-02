import { Component, OnInit } from '@angular/core';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss']
})
export class RegistrationSuccessComponent implements OnInit {
  title = 'Registration Success';
  constructor(
    public SeoService:SeoServiceService
  ) { }

  ngOnInit() {
    this.SeoService.getMetaInfo();
  }

}
