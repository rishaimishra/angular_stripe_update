import { Component,OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageLoaderService } from '../../services/page-loader.service';
import { LoaderState } from '../../interface/loader.state';

@Component({
    selector: 'page-loader',
    templateUrl: './page-loader.component.html',
  	styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit,OnDestroy{

	public  show = false;
  	private subscription: Subscription;

  	constructor(
		private loaderService: PageLoaderService
	){}

  	ngOnInit() {
		this.subscription = this.loaderService.loaderState.subscribe((state: LoaderState) => {
		  	this.show = state.show;
		});
	}
	  
  	ngOnDestroy(){
		this.subscription.unsubscribe();
	}

}
