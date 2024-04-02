import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { HttpRequestService } from './http-request.service';
import { environment as env} from '../../environments/environment';
import { EncrDecrService } from './encr-decr.service';
@Injectable({
  providedIn: 'root'
})
export class SeoServiceService {

  constructor(
    private meta:Meta,
    private titleService: Title,
    private router: Router,
    private httpRequest:HttpRequestService,
    private EncrDecr: EncrDecrService 
  ) {

   }
   getMetaInfo() {
    // console.log('call');
		// console.log(this.router.url.split("/"),'activated route');
    let urlArray = this.router.url.split("/");
    let lastparam = urlArray[urlArray.length-1];
    // console.log(urlArray);
    // console.log(localStorage.getItem('siteSettings'));
    if(localStorage.getItem('siteSettings')=== null) {
      // console.log('fire');
      this.httpRequest.getSiteSettings();
    } else {
    //   console.log('not fire');
    }
    if(urlArray[1]=='admin' || urlArray[1]=='dashboard'){
    
      this.titleService.setTitle(JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaTitel ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaTitel : env.metaTitel );
      this.meta.addTag({ name: 'description', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaDescription : env.metaDescription });
      this.meta.updateTag({ name: 'description', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaDescription : env.metaDescription});
      this.meta.addTag({ name: 'Keywords', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaKeywords : env.metaKeywords});
      this.meta.updateTag({ name: 'Keywords', content:  localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaKeywords : env.metaKeywords });
    } else {
      if(lastparam!='') {
      
        this.httpRequest.get(`cms-page/${lastparam}`).subscribe((response) => {
          if (response['status'] === 'success') {
          //  console.log(response,'seo data');
            if(response['data']){
            //  console.log('set');
              this.titleService.setTitle('Successlife | '+response['data'].title);
              this.meta.addTag({ name: 'description', content: response['data'].description });

              this.meta.updateTag({ name: 'description', content:  response['data'].description });
              this.meta.addTag({ name: 'Keywords', content: response['data'].Keywords });
              this.meta.updateTag({ name: 'Keywords', content:  response['data'].Keywords });
            } else {
            //  console.log('set2');
              this.titleService.setTitle(localStorage.getItem('siteSettings') != null ?JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaTitel : env.metaTitel);
              this.meta.addTag({ name: 'description', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaDescription : env.metaDescription });
              this.meta.updateTag({ name: 'description', content:  localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaDescription : env.metaDescription});
              this.meta.addTag({ name: 'Keywords', content:localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaKeywords : env.metaKeywords});
              this.meta.updateTag({ name: 'Keywords', content:  localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaKeywords : env.metaKeywords});
            }
          
          }
        }, (errors) => {
          //  console.log(errors,'errors');
          
        });
      } else {
        // console.log('call2');

        this.titleService.setTitle(localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaTitel : env.metaTitel );
        this.meta.addTag({ name: 'description', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaDescription : env.metaDescription});
        this.meta.updateTag({ name: 'description', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaDescription : env.metaDescription});
        this.meta.addTag({ name: 'Keywords', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaKeywords : env.metaKeywords});
        this.meta.updateTag({ name: 'Keywords', content: localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).metaKeywords : env.metaKeywords});
      }
    }
  }	
}
