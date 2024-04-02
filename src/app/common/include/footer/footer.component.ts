import { Component, OnInit } from '@angular/core';
import { environment as env } from '../../../../environments/environment';
import { EncrDecrService } from '../../../services/encr-decr.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // public address: string = localStorage.getItem('siteSettings') != null ? JSON.parse(localStorage.getItem('siteSettings')).address : env.address;

  public address: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).address : env.address;
  

  // public phone_number: string = localStorage.getItem('siteSettings') != null ? JSON.parse(localStorage.getItem('siteSettings')).phone_number : env.phone_number;

  public phone_number: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).phone_number : env.phone_number;
    
  constructor(
    private EncrDecr: EncrDecrService 
  ) { }

  ngOnInit() {
  }

  
}
