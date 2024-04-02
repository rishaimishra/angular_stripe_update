import { Component, OnInit } from '@angular/core';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-reset-password-success',
  templateUrl: './reset-password-success.component.html',
  styleUrls: ['./reset-password-success.component.scss']
})
export class ResetPasswordSuccessComponent implements OnInit {

  title = 'Reset Password Success';
  constructor(
    public SeoService:SeoServiceService
  ) { }

  ngOnInit() {
    this.SeoService.getMetaInfo();
  }

}
