import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
	selector: 'app-searchresult',
	templateUrl: './searchresult.component.html',
	styleUrls: ['./searchresult.component.scss']
})
export class SearchresultComponent implements OnInit {

	value: Number = 100;
	options: Options = {
		floor: 0,
		ceil: 250
	};

	public people: Array<any> = [
		{
			id: 1,
			name: 'Sankar dey',
		},
		{
			id: 2,
			name: 'Sankar',
		},
		{
			id: 3,
			name: 'San',
		},
		{
			id: 4,
			name: 'Sankar Dey',
		},
		{
			id: 5,
			name: 'SanDey',
		},
	];

	public lebel: Array<any> = [
		{
			id: 1,
			name: 'Beginner',
		},
		{
			id: 2,
			name: 'Expert',
		},
		{
			id: 3,
			name: 'Intermediate',
		},
		{
			id: 4,
			name: 'Expert',
		},
		{
			id: 5,
			name: 'Intermediate',
		},
	];

	public price: Array<any> = [
		{
			id: 1,
			name: 'Paid',
		},
		{
			id: 2,
			name: 'Free',
		},

	];

	public vendor: Array<any> = [
		{
			id: 1,
			name: 'Paid',
		},
		{
			id: 2,
			name: 'Free',
		},

	];

	public duration: Array<any> = [
		{
			id: 1,
			name: '0-2 Hours',
		},
		{
			id: 2,
			name: '3-6 Hours',
		},
		{
			id: 3,
			name: '7-16 Hours',
		},
		{
			id: 4,
			name: '17+ Hours',
		},

	];

	// filter div show hide

	btnFilter: Boolean = false;


	constructor() {


	}

	ngOnInit() {
	}

	filter_showhide() {
		this.btnFilter = true;
	}

	buttton_showhide() {
		this.btnFilter = false;
	}


}
