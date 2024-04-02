import { Component, OnInit } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import { HttpRequestService } from './services/http-request.service';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	title = 'successLife';

	// public config: ToasterConfig = new ToasterConfig({ timeout: 3600000 });

	constructor(
		private httpService: HttpRequestService,
	) {
	
	}

	ngOnInit() {
		this.httpService.getSiteSettings();
	}

}
