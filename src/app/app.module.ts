import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { OwlModule } from 'ngx-owl-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { HttpRequestService } from './services/http-request.service';
import { HttpClientModule } from '@angular/common/http';
import { GlobalConstantService } from './services/global-constant.service';
import { EncrDecrService } from './services/encr-decr.service';
/*******Import component list ********/
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component';


import { SharedModule } from './common/shared.module';
import { AuthGuard } from './services/auth-guard.service';
import { RoleGuard } from './services/role-guard.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TutorialComponent } from './tutorial/tutorial.component';

import { NgxStripeModule } from 'ngx-stripe';






@NgModule({
	declarations: [
		AppComponent,
		NotFoundComponent,
		LoaderComponent,
		TutorialComponent,
	
		
	
	
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ToasterModule,
		OwlModule,
		NgbModule,
		AppRoutingModule,
		NgxGalleryModule,
		NgxUiLoaderModule,
		HttpClientModule,
		SharedModule,
		CKEditorModule,
		NgxStripeModule.forRoot('pk_test_wOJGE0BgiZwCKu3qyPCpBlFp00WW7jBLW5'),
	],
	providers: [
		HttpRequestService,
		GlobalConstantService,
		ToasterService,
		AuthGuard,
		RoleGuard,
		EncrDecrService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
