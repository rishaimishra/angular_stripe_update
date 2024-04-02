import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  public copeidTooltip = 0;
  BASE_URL: string = environment.base_url;
  public shareUrl: any=`${this.BASE_URL}`;
 
  constructor(
    public SeoService:SeoServiceService
  ) { }

  ngOnInit() {
    window.scrollTo(0,0);
    this.SeoService.getMetaInfo();
  }
  copyInputMessage(inputElement) {
    // console.log(inputElement.value);
    this.shareUrl=inputElement.value;
		this.copeidTooltip = 1;
		inputElement.focus();
		inputElement.select();
		document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    setTimeout(() => { 
      this.copeidTooltip = 0;
    }, 2000);
	}

}
