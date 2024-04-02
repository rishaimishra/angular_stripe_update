import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlModule } from 'ngx-owl-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../common/shared.module';
import { GlobalModule } from '../../global/global.module';

import { ListingRoutingModule } from './listing-routing.module';
import { SearchListComponent } from './search-list/search-list.component';
import { BannerComponent } from './banner/banner.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
/*******Import Pipe list ********/

import { CustomPipes } from '../../pipe/pipe';
import { EventsLandingPageComponent } from './events-landing-page/events-landing-page.component';
//import { SearchStringPipe } from '../../pipe/search-string.pipe';
@NgModule({
	imports: [
		CommonModule,
		OwlModule,
		NgbModule,
		InfiniteScrollModule,
		SharedModule,
		GlobalModule,
		ListingRoutingModule,
		FormsModule,
		CustomPipes
	],
	declarations: [
		SearchListComponent, 
		BannerComponent, 
		LeftPanelComponent, 
		FilterPanelComponent, EventsLandingPageComponent,
		// SearchStringPipe
	]
})
export class ListingModule { }
