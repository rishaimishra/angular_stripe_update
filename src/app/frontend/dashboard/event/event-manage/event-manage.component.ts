import { Component, OnInit, AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { mergeMap } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';
import { NgbDate, NgbDateStruct, NgbDateParserFormatter,NgbTimeStruct,NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonService } from '../../../../global/services/common.service';
import { HttpRequestService } from '../../../../services/http-request.service';
import { S3BucketService } from '../../../../services/s3-bucket.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { ImageCroppedEvent } from 'ngx-image-cropper';

/**
 * Interface for the structure of the native model of NgbTimepicker
 */
interface TimeStructure {
	hour: number;
	minute: number;
  }
@Component({
	selector: 'app-event-manage',
	templateUrl: './event-manage.component.html',
	styleUrls: ['./event-manage.component.scss']
})
export class EventManageComponent implements OnInit, AfterViewInit {

	@ViewChild('basicInfo') basicInfo: ElementRef<HTMLElement>;
	@ViewChild('priceInfo') priceInfo: ElementRef<HTMLElement>;
	public formObj: FormGroup;
	public isCreateMode: boolean;
	public id: string;
	private toasterService: ToasterService;

	public ticketDetails: any = null;

	public loggedUser: any;
	public isCompletedProfile: Boolean = false;

	imageChangedEvent: any = '';
	croppedImage: any = '';


	public imageType = ['png','jpeg','jpg','gif'];
	public imageSrc: string;
	public originalFile: any;
	public newImage:boolean = false;
	public newCourseImageFile: boolean = false;
	public fileInstance: any  = null;
	public thumbnail: any= '';
	public image_edited = 0;
	public originalFileSrc: any;

	public showStateLoading:boolean = false;
	public showCityLoading:boolean = false;

	
	private _formErrorMessage = {
		user_id: {
			required: 'User is required',
		},
		title: {
			required: 'Title is required',
		},
		slug: {
			required: 'Slug is required',
		},
		description: {
			required: 'Description is required',
		},
		short_description: {
			required: 'Short Description is required',
		},
		quantity: {
			required: 'Quantity is required',
		},
		discount: {
			required: 'Discount is required',
		},
		price: {
			required: 'Price is required',
		},
		product_type: {
			required: 'Product Type is required',
		},
		currency: {
			required: 'Currency is required',
		},
		status: {
			required: 'Status is required',
		},
		address: {
			required: 'Address is required',
		},
		country_id: {
			required: 'Country is required',
		},
		state_id: {
			required: 'State is required',
		},
		city_id: {
			required: 'City is required',
		},
		post_code:{
			required:'Pincode is required'
		},
		images_field_count: {
			required: 'Please upload one image',
		},
		categories: {
			required: 'Categories are required',
		},
		speakers: {
			required: 'Speakers are required',
		},
		start_time_show: {
			required: 'Start time are required',
		},
		end_time_show: {
			required: 'End time are required',
		},
		type: {
			required: 'Type of venu required',
		},

		
	};
	public formError: any = {};
	public formErrorMsg: string;

	public paymentFormErrorArr: Array<any> = [];

	public priceFormArr: Array<FormGroup> = [];

	public categories: Array<any> = [];
	public paymentCategories: Array<any> = [];
	public selectedPaymentCategoryArr: Array<number> = [];
	public paymentTypes: Array<any> = [];
	public countries: Array<any> = [];
	public states: Array<any> = [];
	public cities: Array<any> = [];
	public categoriesTree: Array<any> = [];
	public eventUploadFileArr: Array<any> = [];
	public eventUploadUrlArr: Array<any> = [];
	public eventUploadedUrlArr: Array<any> = [];

	public isUploadedAll: Boolean = false;
	public speakers: Array<any> = [];
	public statusArr: Array<any> = [
		{
			code: 'draft',
			name: 'Draft',
			cssClass: 'badge badge-warning'
		},
		{
			code: 'publish',
			name: 'Publish',
			cssClass: 'badge badge-success'
		},
		{
			code: 'unpublish',
			name: 'Unpublish',
			cssClass: 'badge badge-danger'
		}
	];

	public paymentTypeArr: Array<any> = [
		{ id: 1, name: 'USD' },
		{ id: 2, name: 'SXL' },
		{ id: 3, name: 'USDSXL' },
		{ id: 4, name: 'FREE' },
	];

	minStartDate: NgbDateStruct;
	maxStartDate: NgbDateStruct;
	minEndDate: NgbDateStruct;
	maxEndDate: NgbDateStruct;

	public formLoading: Boolean = false;
	public pricingFormLoadingArr: Array<boolean> = [];

	private _paymentCategoryWatcher: BehaviorSubject<any> = new BehaviorSubject(null);
	public paymentCategoryObserver$ = this._paymentCategoryWatcher.asObservable();
	public Editor = ClassicEditor;
	public editorConfig: any;

	constructor(
		toasterService: ToasterService,
		private httpService: HttpRequestService,
		private s3Service: S3BucketService,
		private commonService: CommonService,
		public formBuilder: FormBuilder,
		public ngDateFormatter: NgbDateParserFormatter,
		public router: Router,
		public route: ActivatedRoute,
		public decimalPipe: DecimalPipe,
		public validatorService: NgReactiveFormValidatorService,
		public ngbTimeAdapter:NgbTimeAdapter<'hh:mm:ss.ffffff'>,
		public SeoService:SeoServiceService,
		private ngxService: NgxUiLoaderService,
	) {
		this.toasterService = toasterService;
		this.editorConfig ={ 
			label: 'Foo',
			alignment: {
								options: [ 'left', 'right' ]
			} ,
			toolbar: [ 'heading', '|', 'bold', 'italic','link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'] 
		};

		
	}
	public onReady( editor ) {
		editor.ui.view.element.childNodes[0].innerHTML='';
		// console.log(editor.ui.view.element.childNodes[0]);
	  }
	  
	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		if (this.route.snapshot.params['id']) {
			this.id = this.route.snapshot.params['id'];
			this.isCreateMode = false;
		} else {
			this.isCreateMode = true;
		}
		this.route.fragment.subscribe(fragment => {
		//	console.log(fragment,'fragments'); // undefined expecting the fragment route on load
		if(fragment == 'priceInfo'){
			let el: HTMLElement = this.priceInfo.nativeElement;
			el.click();
		}
	})
		this.formObj = this.formBuilder.group({
			id: [null],
			user_id: [null, Validators.required],
			title: [null, Validators.required],
			slug: [null, Validators.required],
			description: [null, Validators.required],
			//short_description: [null, Validators.required],
			// quantity: [null, [Validators.required, Validators.min(1)]],
			// discount: [0, [Validators.max(100)]],
			// price: [null, Validators.required],
			product_type: [null, Validators.required],
			currency: [null, Validators.required],
			status: ['draft', Validators.required],
			is_featured: [0, Validators.required],
			categories: [null, Validators.required],
			speakers:[null, Validators.required],
			address: [null, Validators.required],
			state_id: [null, Validators.required],
			country_id: [null, Validators.required],
			city_id: [null, Validators.required],
			post_code:[null, Validators.required],
			start_date_show: [null, Validators.required],
			start_date: [null, Validators.required],
			end_date_show: [null, Validators.required],
			end_date: [null, Validators.required],
			type: [null,Validators.required],
			// start_time:['00:00'],
			// start_time_show:[{hour: 0, minute: 0},Validators.required],
			// end_time:['00:00'],
			// end_time_show:[{hour: 0, minute: 0},Validators.required],
			images_field_count: [null],
			images: this.formBuilder.array([]),
			meta_description: [null],
			meta_keywords: [null],
			logged_in_user_id:[null]
		});

		this.httpService.getUserObservable().subscribe((user) => {
			if (user) {
				this.loggedUser = user;
				if (Object.keys(user.user.profile).length > 0) {
					this.isCompletedProfile = true;
				}

				this.formObj.patchValue({
					user_id: user.user.id,              // user create events
					logged_in_user_id: user.user.id,		// current logged in user
					product_type: 'event_ticket',
					currency: 'USD'
				});
			}
		});

		if (!this.isCreateMode) {
			this.setFormData();
			this.getPaymentCategories();
			this.getPaymentTypes();
			
		}

		if (this.isCreateMode) {
			this.statusArr.pop();
		}

		const dtObj = new Date();
		if (this.isCreateMode) {
			this.minStartDate = this.ngDateFormatter.parse(dtObj.toISOString()) as NgbDateStruct;
			this.minEndDate = this.ngDateFormatter.parse(dtObj.toISOString()) as NgbDateStruct;
		}
		this.maxStartDate = null;
		this.maxStartDate = null;

		// console.log(moment('2019-01-23T11:25:42.000Z').format('YYYY-MM-DD, h:mm:ss a'));

		this.paymentCategoryObserver$.subscribe((categoryArr) => {
			if (categoryArr) {
				categoryArr.forEach((category) => {
					this.paymentFormErrorArr.push(null);
					this.pricingFormLoadingArr.push(false);
					const fg = this.formBuilder.group({
						pricable_id: [null, Validators.required],
						pricable_type: ['products', Validators.required],
						payment_type_id: ['', Validators.required],
						total_price: [null],
						categoryPrice: this.formBuilder.array([
							this.formBuilder.group({
								product_price_id: [null],
								payment_category_id: [category.id, Validators.required],
								quantity: [null, [Validators.required, Validators.min(1)]],
								sxl_price: [{ value: null, disabled: true }, Validators.required],
								usd_price: [{ value: null, disabled: true }, Validators.required]
							})
						])
					});
					//fg.disable();
					this.priceFormArr.push(fg);
				});
			}
		});
	}

	ngAfterViewInit() {
		this.getCategories();
		this.getCountries();
		this.getSpeakers();
	}
	keyPress(event: any) {
	
		const pattern = /[0-9\+\-\ ]/;
	
		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode !== 8 && !pattern.test(inputChar)) {
		  event.preventDefault();
		}
	  } 
	onStartDateSelection(date: NgbDateStruct, dp) {
		
		this.minEndDate = date;
		const dateStr = this.ngDateFormatter.format(date);
		// console.log(dateStr);
		const dtObj = new Date(dateStr);
		this.formObj.patchValue({
			// start_date: dtObj.toISOString()
			start_date: moment(dtObj.toISOString()).format('YYYY-MM-DD')
		});
		dp.close();
	}

	onEndDateSelection(date: NgbDateStruct, dp) {
		// console.log(date);
		this.maxStartDate = date;
		const dateStr = this.ngDateFormatter.format(date);

		const dtObj = new Date(dateStr);
		this.formObj.patchValue({
			// end_date: dtObj.toISOString()
			end_date: moment(dtObj.toISOString()).format('YYYY-MM-DD')
		});
		dp.close();
	}

	setFormData() {
		this.route.params.pipe(
			mergeMap((params) => {
				if (params) {
					const bindModel = {
						images: true,
						event_country: true,
						event_state: true,
						event_city: true,
						categories: true,
						event: true,
						fetch_price: true,
						event_speaker: true
					};
					return this.httpService.setModule('event').findOne(params.id, bindModel);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {								
				const data = Object.assign({}, response.data);
				//console.log(response.data.event.type);
				// console.log(data,'data');
				data.images_field_count = data.images.length || 0;
				data.categories = response.data.categories.map(el => el.id);
				 data.speakers = response.data.event_speakers.map(el => el.id);
				data.address = response.data.event.address;
				data.country_id = response.data.event.country_id;
				data.state_id = response.data.event.state_id;
				data.city_id = response.data.event.city_id;
				data.post_code = response.data.event.post_code;
				// data.type = response.data.event.type; 
				data.type = response.data.event.type;

				this.thumbnail = response.data.event.banner_image;
				this.croppedImage = response.data.event.banner_image;


				if (response.data.event.country) {
					this.onCountryChange(response.data.event.country);
				}

				if (response.data.event.state) {
					this.onStateChange(response.data.event.state);
				}

				if (response.data.event.start_date) {
					data.start_date_show = this.ngDateFormatter.parse(response.data.event.start_date);
					// data.start_date = response.data.event.start_date;
					data.start_date = moment(response.data.event.start_date).format('YYYY-MM-DD');
					this.minStartDate = data.start_date_show;
					this.minEndDate = data.start_date_show;
				}

				if (response.data.event.end_date) {
					data.end_date_show = this.ngDateFormatter.parse(response.data.event.end_date);
					// data.end_date = response.data.event.end_date;
					data.end_date = moment(response.data.event.end_date).format('YYYY-MM-DD');
					this.maxStartDate = data.end_date_show;
				}
				// console.log(response.data.start_time,'start time');
				// console.log(response.data.end_time,'end time');
				// if(response.data.event.start_time)
				// data.start_time_show = this.toStructure(response.data.event.start_time);
				// data.end_time_show = this.toStructure(response.data.event.end_time);

				// console.log(data);
				// console.log(response);
				this.formObj.patchValue(data);
				this.eventUploadedUrlArr = response.data.images;

				const itemArr = this.formObj.get('images') as FormArray;
				response.data.images.forEach((item) => {
					itemArr.push(this.createNewImageItem(item));
				});

				this.ticketDetails = data;



				// Set Value for price

				if (this.ticketDetails.pricable.length > 0) {

					this.priceFormArr.forEach((priceFormObj, frmIdx) => {
						const formValues = priceFormObj.value;
						const idx = this.ticketDetails.pricable.findIndex((el) => {
							return (parseInt(el.payment_category.id, 10) === parseInt(formValues.categoryPrice[0].payment_category_id, 10));
						});


						if (idx > -1) {

							this.selectedPaymentCategoryArr.push(this.ticketDetails.pricable[idx].payment_category_id);
							const paymentObj = {
								pricable_id: this.ticketDetails.id,
								pricable_type: 'products',
								payment_type_id: this.ticketDetails.pricable[idx].payment_type.id,
								total_price: this.ticketDetails.pricable[idx].total_price
							};

							priceFormObj.patchValue(paymentObj);
							const paymentCategoryArr = priceFormObj.get('categoryPrice') as FormArray;

							const selectedPaymentType = this.paymentTypeArr.find((el) => {
								return (parseInt(this.ticketDetails.pricable[idx].payment_type.id, 10) === el.id);
							});

							paymentCategoryArr.controls.forEach((el) => {
								if (!this.isDisableSXL(frmIdx)) {
									el.get('sxl_price').enable();
								}
								if (!this.isDisableUSD(frmIdx)) {
									el.get('usd_price').enable();
								}


								el.patchValue({
									product_price_id: this.ticketDetails.pricable[idx].product_price_id,
									payment_category_id: this.ticketDetails.pricable[idx].payment_category.id,
									quantity: this.ticketDetails.pricable[idx].quantity,
									sxl_price: this.decimalPipe.transform(this.ticketDetails.pricable[idx].sxl_price, '1.2-2'),
									usd_price: this.decimalPipe.transform(this.ticketDetails.pricable[idx].usd_price, '1.2-2')
								});
							});
						}
					});


				}
			}
		}, (error) => {
		//	console.log(error);
		});
	}

	getSpan(item) {
		return {
			'margin-left': (item.label * 20) + 'px'
		};
	}

	getCategories() {
		const params = {
			tree: true,
			is_active: true,
			type: 'events'
		};
		this.httpService.setModule('category').search(params).subscribe((response) => {
			if (response) {
				this.prepareCategoryArr(response.data);
			}
		}, (error) => {
		//	console.log(error);
		});
	}

	getSpeakers() {
		const params = {
			is_active: true
		};
		this.httpService.setModule('speaker').search(params).subscribe((response) => {
			if (response) {
				this.speakers = response.data;
			//	console.log(this.speakers);
			}
		}, (error) => {
		//	console.log(error);
		});
	}

	getPaymentTypes() {
		this.httpService.setModule('paymentType').list({}).subscribe((response) => {
			if (response) {
				this.paymentTypes = response.data;
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	getPaymentCategories() {
		this.httpService.setModule('paymentCategory').search({}).subscribe((response) => {
			if (response) {
				this.paymentCategories = response.data;
				this._paymentCategoryWatcher.next(this.paymentCategories);
			}
		}, (error) => {
		//	console.log(error);
		});
	}

	getCountries() {
		this.httpService.setModule('country').search({}).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.countries = response.data;
				}
			}
		}, (error) => {
		//	console.log(error);
		});
	}

	onCountryChange(event) {
		this.showStateLoading =true;
		this.formObj.patchValue({
			state_id: null,
			city_id: null
		});
		this.states = [];
		this.cities = [];

		if (event) {
			this.httpService.setModule('state').findOne(event.id).subscribe((response) => {
				this.showStateLoading = false;
				if (response) {
					if (response.data) {
						this.states = response.data;
					}
				}
			}, (error) => {
				this.showStateLoading = false;
			//	console.log(error);
			});
		}
	}

	onStateChange(event) {
		this.showCityLoading =true;
		this.formObj.patchValue({
			city_id: null
		});
		this.cities = [];

		if (event) {
			this.httpService.setModule('city').findOne(event.id).subscribe((response) => {
				if (response) {
					this.showCityLoading= false;
					if (response.data) {
						this.cities = response.data;
					}
				}
			}, (error) => {
				this.showCityLoading= false;
			//	console.log(error);
			});
		}
	}

	isStatusChecked(code) {
		let flag = false;
		const selectedStatus = this.formObj.controls['status'].value;
		if (selectedStatus === code) {
			flag = true;
		}
		return flag;
	}

	isFeaturedChecked() {
		const featureValue = this.formObj.value['is_featured'];
		return (featureValue === 1) ? true : false;
	}

	changeFeatured(event) {
		if (event) {
			const featureValue = this.formObj.value['is_featured'];
			this.formObj.patchValue({
				is_featured: (featureValue === 0) ? 1 : 0
			});
		}
	}

	changeStatus(code) {
		if (code) {
			this.formObj.patchValue({
				status: code
			});
		}
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

	onSelectEventFiles(event) { // called each time file input changes
		if (event.target.files && event.target.files[0]) {
			this.isUploadedAll = true;
			Object.keys(event.target.files).forEach((k) => {
				const reader = new FileReader();

				reader.readAsDataURL(event.target.files[k]); // read file as data url

				reader.onload = () => { // called once readAsDataURL is completed
					// this.url = event.target.result;
					// console.log(event.target.files[k]);
					this.eventUploadFileArr.push(event.target.files[k]);

					const item = {
						url: reader.result,
						uploaded: false,
						uploading: false,
						uploadingPer: 0,
						uploadingPercentage: '0%',
						error: ''
					};
					this.eventUploadUrlArr.push(item);
				};
			});
		}
	}

	createNewImageItem(item): FormGroup {
		const fg = this.formBuilder.group({
			id: new FormControl(0),
			imagable_type: new FormControl(null, Validators.required),
			original: new FormControl(null, Validators.required),
		});
		fg.patchValue(item);
		return fg;
	}

	uploadEventImages(event) {
		if (event) {
			this.formObj.patchValue({
				images_field_count: (this.eventUploadUrlArr.length + this.eventUploadedUrlArr.length)
			});
			this.isUploadedAll = false;
			this.eventUploadFileArr.forEach((file, k) => {
				if (!this.eventUploadUrlArr[k].uploaded) {
					this.eventUploadUrlArr[k].uploading = true;
					const prgPer = setInterval(() => {
						if (this.eventUploadUrlArr[k].uploadingPer < 90) {
							this.eventUploadUrlArr[k].uploadingPer += 9;
							this.eventUploadUrlArr[k].uploadingPercentage = this.eventUploadUrlArr[k].uploadingPer + '%';
						}
					}, 30);

					this.s3Service.uploadS3(file).subscribe((response) => {
						if (response) {
							clearInterval(prgPer);
							const item = {
								imagable_type: 'event_ticket',
								original: response.Location
							};

							const itemArr = this.formObj.get('images') as FormArray;
							itemArr.push(this.createNewImageItem(item));

							this.eventUploadUrlArr[k].url = response.Location;
							this.eventUploadUrlArr[k].uploaded = true;
							this.eventUploadUrlArr[k].uploading = false;
						}
					}, (error) => {
						this.eventUploadUrlArr[k].error = 'Failed to upload image in S3';
						console.error(error);
					});
				}
			});
		}
	}

	deleteUploadedImage(imgRec) {
		if (imgRec) {
			if (confirm('Are you sure?')) {
				const idx = this.eventUploadedUrlArr.findIndex((el) => {
					return (el.id === imgRec.id);
				});
				if (idx > -1) {
					this.eventUploadedUrlArr.splice(idx, 1);
				}

				// Form image remove
				const itemArr = this.formObj.get('images') as FormArray;
				itemArr.removeAt(idx);

				const params = {
					id: this.id,
					image: true,
					image_id: imgRec.id
				};

				this.httpService.setModule('event').deleteOne(params).subscribe((response) => {
					if (response) {
						this.toasterService.pop('success', 'Image deleted');
					}
				}, (error) => {
					this.toasterService.pop('success', 'Failed to delete image');
				});
			}
		}
	}
	toStructure(timeAsString: string): TimeStructure {
		
			// console.log(timeAsString);
		  const parts = timeAsString.split(':');
		  const newValue = {
			hour: +parts[0],
			minute: +parts[1],
			//second: +parts[2],
		  };
		  // console.log(newValue);
		  return newValue;
		
	  }
	
	  fromStructure(t: TimeStructure): string {
		return t && `${this.pad(t.hour)}:${this.pad(t.minute)}`;
	  }
	  /**
	 	* Left-pads single-digit number with 0, to format 6 as '06', for example
	 	*/
	pad(number): string {
		return number < 10 ? `0${number}` : number;
	}

	/**
 	* Tests if two TimeStructure are both falsy, or equal
 	*/
	equal(t1: TimeStructure, t2: TimeStructure): boolean {
	if (!t1) {
	  return !t2;
	}
	return (!t1 && !t2) || (t1 && t2 && t1.hour === t2.hour && t1.minute === t2.minute);
  }
  

  public uploadFile (event) {
    
    const fileName = event.target.files[0];
    const fileExt = fileName.name.split('.').slice(-1)[0];
 //  console.log(fileName);
 //  console.log(fileExt);

      if (this.imageType.indexOf(fileExt) !== -1) {
        this.imageChangedEvent = event;
        this.imageSrc = event;
        this.originalFile = event;
        this.newImage=true;
        this.newCourseImageFile = true;
      } else {
        alert('Only mp4, mkv, 3gp format are supported');
      }
  }

  imageCropped(event) {
     this.croppedImage = event.base64;
     this.fileInstance = event.file;
     this.imageSrc = event.base64;
    // console.log(this.fileInstance,'cover');
   }
   imageLoaded() {
      // show cropper
   }
   loadImageFailed() {
     // show message
     this.fileInstance = '';
     this.croppedImage = '';
   }

  public uploadToS3 () {
    this.ngxService.start();


  const file 		= this.fileInstance;
  //console.log(file, 'upload cover');
    this.s3Service.cropedImageUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
      //  console.log(err);
      } else {
        this.ngxService.stop();
      //  console.log(data.Location,'uploaded cover');
        this.thumbnail = data.Location;
        this.image_edited = 1;
        this.newCourseImageFile = false;
      }
    });


    const original = this.originalFile.target.files[0];
    // console.log(file);
    this.ngxService.start();
     this.s3Service.fileUpload(original).send((err, data) => {
       if (err) {
         this.ngxService.stop();
       //  console.log('err');
       
       } else {
       //  console.log(data.Location);
         this.ngxService.stop();
         this.originalFileSrc = data.Location;
         
       }
     });

     this.newImage=false;
  }
	saveForm() {
		this.formLoading = true;
		this.formObj.value.status = 'draft';
		// console.log(this.fromStructure(this.formObj.value.start_time_show));
		this.formObj.value.start_time =this.fromStructure(this.formObj.value.start_time_show);
		this.formObj.value.end_time= this.fromStructure(this.formObj.value.end_time_show);
	
		if (this.isCreateMode) {
			this.formObj.patchValue({
				start_time:this.fromStructure(this.formObj.value.start_time_show),
				end_time:this.fromStructure(this.formObj.value.end_time_show),
				slug: this.commonService.generateSlug(this.formObj.value['title'])
			});
		}

		if (this.formObj.valid) {
			if (this.isCreateMode) {
				this.createEvent();
			} else {
				this.updateEvent();
			}
		} else {
			this.formLoading = false;
			this.formError = this.validatorService.validationError(this.formObj, this._formErrorMessage);
			this.toasterService.pop('error', 'Error', 'Please fill all required fields');
			console.error(this.formError);
		}
	}

	createEvent() {
		// console.log(this.formObj.value);
		const form_data = this.formObj.value;
		form_data['banner_image'] = this.thumbnail;
		if(this.thumbnail!=''){

			this.httpService.setModule('event').create(form_data).subscribe((response) => {
				if (response) {
					this.formLoading = false;
					this.toasterService.pop('success', 'Event saved');
					// this.router.navigate(['/dashboard', 'ticket']);
					// let el: HTMLElement = this.priceInfo.nativeElement;
					// el.click();
					this.router.navigate(['/dashboard', 'ticket','edit',response['data'].id],{ fragment: 'priceInfo' });
				}
			}, (error) => {
				this.formLoading = false;
				this.formError = null;
				this.commonService.showErrors(error);
			});
		} else {
			this.toasterService.pop('error', 'Event banner image required');
			this.formLoading =false;
		}
	}

	updateEvent() {
		//this.router.navigate(['/dashboard', 'ticket','edit',this.formObj.value.id],{ fragment: 'priceInfo' });
		const params = this.formObj.value;
		delete params.slug;
		params['banner_image'] = this.thumbnail;
		this.httpService.setModule('event').update(params).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Event updated');
			//	this.router.navigate(['/dashboard', 'ticket']);
				let el: HTMLElement = this.priceInfo.nativeElement;
				el.click();
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}

	onChangePaymentType(event, idx) {
		const fArr = this.priceFormArr[idx].get('categoryPrice') as FormArray;
		if (event.target.value !== '') {
			const selectedType = this.paymentTypeArr.find((el) => {
				return (parseInt(event.target.value, 10) === el.id);
			});

			if (selectedType) {
				if (selectedType.name === 'USD') {
					fArr.controls[0].get('usd_price').enable();
					fArr.controls[0].get('sxl_price').disable();
				} else if (selectedType.name === 'SXL') {
					fArr.controls[0].get('usd_price').disable();
					fArr.controls[0].get('sxl_price').enable();
				} else if (selectedType.name === 'USDSXL') {
					fArr.controls[0].get('usd_price').enable();
					fArr.controls[0].get('sxl_price').enable();
				} else if (selectedType.name === 'FREE') {
					fArr.controls[0].get('usd_price').disable();
					fArr.controls[0].get('sxl_price').disable();
				}
			}
		} else {
			fArr.controls[0].get('usd_price').disable();
			fArr.controls[0].get('sxl_price').disable();
		}
	}

	isDisableSXL(idx) {
		const fg = this.priceFormArr[idx];
		const paymentTypeId = fg.get('payment_type_id').value;

		let flag = true;

		if (paymentTypeId) {
			const selectedType = this.paymentTypeArr.find((el) => {
				return ((parseInt(paymentTypeId, 10) === el.id));
			});
			flag = ((selectedType.name === 'SXL') || (selectedType.name === 'USDSXL')) ? false : true;
		}
		return flag;
	}

	isDisableUSD(idx) {
		const fg = this.priceFormArr[idx];
		const paymentTypeId = fg.get('payment_type_id').value;

		let flag = true;

		if (paymentTypeId) {
			const selectedType = this.paymentTypeArr.find((el) => {
				return ((parseInt(paymentTypeId, 10) === el.id));
			});
			flag = ((selectedType.name === 'USD') || (selectedType.name === 'USDSXL')) ? false : true;
		}
		return flag;
	}

	onChangePaymentCategory(event, frmidx) {
		const fg = this.priceFormArr[frmidx];


		//console.log(fg);

		if (event.target.checked) {			
			fg.enable();

			fg.patchValue({
				pricable_type: 'products',
				payment_type_id: ''
			});
			//console.log(fg.value);
			const paymentCategoryArr = fg.get('categoryPrice') as FormArray;
			paymentCategoryArr.controls.forEach((catFg) => {
				catFg.patchValue({
					payment_category_id: event.target.value
				});
			});
			this.selectedPaymentCategoryArr.push(parseInt(event.target.value, 10));
		} else {			

			const existingData = this.ticketDetails.pricable.find((el) => {
				return (parseInt(el.payment_category_id, 10) === parseInt(event.target.value, 10));
			});

			if (existingData) {				

				if (confirm('Are you sure?')) {
					let delData : any = existingData.product_price_id + '?type=products&product_id='+this.id;
					
					this.httpService.setModule('priceDelete').findOne(delData).subscribe((response) => {
						if (response) {
							fg.disable();
							fg.reset();
							const idx = this.selectedPaymentCategoryArr.findIndex((el) => {
								return (el === parseInt(event.target.value, 10));
							});
							this.selectedPaymentCategoryArr.splice(idx, 1);
						}
					}, (error) => {
						this.commonService.showErrors(error);
					});
				}else{					
					event.target.checked = true;
				}
			} else {
				fg.reset();
				fg.disable();
				const idx = this.selectedPaymentCategoryArr.findIndex((el) => {
					return (el === parseInt(event.target.value, 10));
				});
				this.selectedPaymentCategoryArr.splice(idx, 1);
			}
		}
	}

	isEnableForm(id) {
		let flag = false;
		const chk = this.selectedPaymentCategoryArr.findIndex((el) => {
			return (el === parseInt(id, 10));
		});
		flag = (chk > -1) ? true : false;
		// console.log(chk, flag, this.selectedPaymentCategoryArr, id);
		return flag;
	}

	savePriceForm(idx) {
		// console.log(this.priceFormArr, 'form');

		this.pricingFormLoadingArr[idx] = true;
		// console.log(this.formObj.value);
		// if (this.isCreateMode) {
		// 	this.formObj.patchValue({
		// 		slug: this.commonService.generateSlug(this.formObj.value['title'])
		// 	});
		// }

		const paymentCat = this.paymentCategories[idx];

		if (this.isEnableForm(paymentCat.id)) {
			const priceFormObj = this.priceFormArr[idx];

			priceFormObj.patchValue({
				pricable_id: this.ticketDetails.id
			});

			const paramValue = priceFormObj.value;
			if ((!this.isDisableSXL(idx)) && (!this.isDisableUSD(idx))) {
				priceFormObj.patchValue({
					total_price: null
				});
			} else if ((!this.isDisableUSD(idx))) {
				priceFormObj.patchValue({
					total_price: paramValue.categoryPrice[0].usd_price
				});
			} else if ((!this.isDisableSXL(idx))) {
				priceFormObj.patchValue({
					total_price: paramValue.categoryPrice[0].sxl_price
				});
			} else if ((this.isDisableSXL(idx)) && (this.isDisableUSD(idx))) {
				priceFormObj.patchValue({
					total_price: '0.00'
				});
			}


			if (priceFormObj.valid) {
				const params = priceFormObj.value;
				if ((!this.isDisableUSD(idx)) && this.isDisableSXL(idx)) {
					params['categoryPrice'][0]['sxl_price'] = '0.00';
				}
				if ((!this.isDisableSXL(idx)) && this.isDisableUSD(idx)) {
					params['categoryPrice'][0]['usd_price'] = '0.00';
				}
				if ((this.isDisableSXL(idx)) && (this.isDisableUSD(idx))) {
					params['categoryPrice'][0]['usd_price'] = '0.00';
					params['categoryPrice'][0]['sxl_price'] = '0.00';
				}

				this.httpService.setModule('productPrice').create(params).subscribe((response) => {
					if (response) {
						this.paymentFormErrorArr[idx] = null;
						this.setFormData();
						this.pricingFormLoadingArr[idx] = false;
						this.toasterService.pop('success', 'Product updated');
						// this.router.navigate(['/dashboard', 'product']);
					}
				}, (error) => {
					this.pricingFormLoadingArr[idx] = false;
					this.formError = null;
					this.commonService.showErrors(error);
				});
			} else {
				this.pricingFormLoadingArr[idx] = false;
				this.paymentFormErrorArr[idx] = this.validatorService.validationError(priceFormObj, this._formErrorMessage);
				this.toasterService.pop('error', 'Error', 'Please fill all required fields');
				console.error(this.paymentFormErrorArr[idx]);
			}
		} else {
			this.pricingFormLoadingArr[idx] = false;
			this.commonService.showMessage({ type: 'error', title: '', message: 'Please select the plan' });
		}

	}

}
