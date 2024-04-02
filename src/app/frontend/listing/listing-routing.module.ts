import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchListComponent } from './search-list/search-list.component';
import { EventsLandingPageComponent } from './events-landing-page/events-landing-page.component';
const routes: Routes = [
	{
		path: 'live-events',
		component: EventsLandingPageComponent,
		data: { listMode: 'liveEvent' }
	},
	{
		path: 'products',
		component: SearchListComponent,
		data: { listType: 'products', listMode: 'general' }
	},
	{
		path: 'products/:category',
		component: SearchListComponent,
		data: { listType: 'products', listMode: 'general' }
	},
	{
		path: 'events',
		component: SearchListComponent,
		data: { listType: 'events', listMode: 'general' }
	},
	{
		path: 'events/:category',
		component: SearchListComponent,
		data: { listType: 'events', listMode: 'general' }
	},
	{
		path: 'courses',
		component: SearchListComponent,
		data: { listType: 'courses', listMode: 'general' }
	},
	{
		path: 'affiliate/:reseller/courses',
		component: SearchListComponent,
		data: { listType: 'courses', listMode: 'reseller' }
	},
	{
		path: 'courses/:category',
		component: SearchListComponent,
		data: { listType: 'courses', listMode: 'general' }
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ListingRoutingModule { }
