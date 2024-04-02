import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { HttpRequestService } from '../../services/http-request.service';
import { CommonService } from '../../global/services/common.service';
import { Options } from 'ng5-slider';

import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [NgbRatingConfig] 
})
export class FilterComponent implements OnInit, OnChanges {

	@Input ()  btnFilter: Boolean;
	@Input () selectedCategory: Array<number>;
	@Input () selectedStanderd: Array<number>;
	@Input () selectedVendor: Array<number>;
	@Input () selectedDuration: number;
	@Input () selectedRating: number;
	@Input () selectedPriceValue: number;
	@Input () selectedprice: number;

	// public selectedDuration: Number = 0;

	@Output() filterShowStaus = new EventEmitter<any>();
	@Output() changeSelectedParam = new EventEmitter<any>();

	// priceValue: number = this.selectedPriceValue;

	public categories: Array<any> = [];
	public categoriesTree: Array<any> = [];
	public standerd: Array<any> = [];
	public vendors: Array<any> = [];
	public selectedValue:object={};


	
		options: Options = {
			floor: 0,
			ceil: 10000
		};


		public price: Array<any> = [
			{
				id: 1,
				name: 'Paid',
			},
			{
				id: 2,
				name: 'Free',
			},
			{
				id: 3,
				name: 'All',
			},

		];


		public duration: Array<any> = [
			{
				id: 0,
				name: 'All',
			},
			{
				id: 1,
				name: '0-2 Hours',
			
			},
			{
				id: 2,
				name: '2-6 Hours',
			
			},
			{
				id: 3,
				name: '6-16 Hours',
			
			},
			{
				id: 4,
				name: '16+ Hours',
			
			},

		];
	constructor(
		private httpService: HttpRequestService,
		private commonService: CommonService,
		config: NgbRatingConfig
	) { 
		config.max = 5;
		config.readonly = true;
	}

	ngOnInit() {
		
	//	console.log(this.selectedDuration);
			this.getCategory();
			this.getStanderd();
			this.getVendors();

	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes) {
			if ('selectedDuration' in changes) {
				//console.log(changes);
				this.selectedDuration = parseInt(changes.selectedDuration.currentValue, 10);
			}
			if ('selectedprice' in changes) {
				//console.log(changes.selectedprice.currentValue);
				this.selectedprice = parseInt(changes.selectedprice.currentValue, 10);
			}
		}
	}

	buttton_showhide() {
		this.filterShowStaus.emit(false);
		
	}

	getSpan(item) {
		return {
			'margin-left': (item.label * 20) + 'px'
		};
	}
	getCategory() {
		const params = {
			tree: true,
			is_active: true,
		};
		this.httpService.setModule('category').search(params).subscribe((response) => {
			if (response) {
				this.prepareCategoryArr(response.data);
			}
			// console.log(this.categoriesTree);
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	prepareCategoryArr(categories, label = 0) {
		const arr = [];
		categories.forEach((el) => {
			el.label = label;
			this.categoriesTree.push(el);
			if (el.children) {
				this.prepareCategoryArr(el.children, (label + 1));
			}
		});
	}
	getStanderd() {
		this.httpService.get(`course-stander`).subscribe((response) => {
		if (response['status'] === 'success') {
			this.standerd = response['data'];
			// console.log(this.standerd);
		}
		}, (errors) => {
		// console.log(errors);
		});
	}

	getVendors() {
		const params = {
			role: 'vendor',
			profile: true,
			is_active: 1
		};
		this.httpService.setModule('user').search(params).subscribe((response) => {
			if (response) {
				if (response.data) {
				
					this.vendors = response.data.filter(el => {
						if (el.profile) {
							return (Object.keys(el.profile).length > 0 && el.profile.full_name!=null);
						} else {
							return false;
						}
					});
					// console.log(this.vendors);
				}
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	onChange(type,value?) {
	//	console.log(this.selectedDuration);
		if(type=='rating') {
			this.selectedRating=value;
		}
		//console.log('call');
		// if(type=='priceValue') {
		// 	this.selectedPriceValue=this.priceValue;
		// }


		this.selectedValue={
			selectedCategory: this.selectedCategory,
			selectedStanderd: this.selectedStanderd,
			selectedVendor: this.selectedVendor,
			selectedDuration: this.selectedDuration,
			selectedRating: this.selectedRating,
			selectedPriceValue: this.selectedPriceValue,
			selectedprice:this.selectedprice
		}
		this.changeSelectedParam.emit(this.selectedValue);
	}




	changePriceType () {
		//console.log(this.selectedPriceValue);
		if(this.selectedprice==1){
			this.selectedPriceValue=10000;
		} else if(this.selectedprice==2) {
			this.selectedPriceValue=0;
		} else if(this.selectedprice==3) {
			this.selectedPriceValue=10000;
		}
		this.onChange('priceType');
	}

}
