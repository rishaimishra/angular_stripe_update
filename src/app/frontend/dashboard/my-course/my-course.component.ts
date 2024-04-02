import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { bounceOutRight} from '../../../common/animation';
import { $ } from 'protractor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoursePromoteModalComponent } from '../course-promote-modal/course-promote-modal.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { KycModalComponent } from '../kyc-modal/kyc-modal.component';
import { SeoServiceService }  from '../../../services/seo-service.service';
import { EncrDecrService } from '../../../services/encr-decr.service';
@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.scss']
})
export class MyCourseComponent implements OnInit {
  public error_messages: any = [];
  public user: any;
  public pagination: any = [];
  public limit: Number = 10;
  public data: any = [];
  private toasterService: ToasterService;

  public featureYes = "<i class='fa fa-check-circle' aria-hidden='true'></i>";
  public featureNo = "<i class='fa fa-circle-thin' aria-hidden='true'></i>";
  public trashBtn = "<i class='fa fa-trash'></i>";

	public categories: Array<any> = [];
  searchForm: FormGroup;
	public searchParams: any = {
		categories: true,
		user: true,
    is_delete: true,
    course_promotion:true,
    fetch_price:true,
    order_count: true
  };
  public price: Array<any> = [
		{
			label: 'Paid',
			value: 'total_price'
		},
		{
			label: 'Free',
			value: 'free'
		},
		{
			label: 'All',
			value: '-id'
		},

	];
	public publishOptions: Array<any> = [
		{
			label: 'Yes',
			value: 'publish',
		},
		{
			label: 'No',
			value: 'draft',
		},

	];
	public featureOptions: Array<any> = [
		{
			label: 'Yes',
			value: '1',
		},
		{
			label: 'No',
			value: '0',
		},

	];

  constructor(
    private commonService: CommonService,
    toasterService: ToasterService,
    protected http: HttpRequestService,
    protected activeRoute: ActivatedRoute,
    private render: Renderer,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public SeoService:SeoServiceService,
    private EncrDecr: EncrDecrService 
  ) { 
    this.toasterService = toasterService;
    this.searchForm = this.fb.group({
			string: [],
			category: [],
			is_publish: [],
			is_featured: [],
			price_filter: []
    });
    
  }

  ngOnInit() {
    window.scroll(0,0);
    this.SeoService.getMetaInfo();
    this.user = this.http.getUser();
    // console.log(this.user,'user info');
    this.searchParams.created_by = this.user.id,
    

    this.activeRoute.queryParams.subscribe((response) => {
    const page = response.page ? response.page : 1;
    this.getCourses(page);
  
    this.getCategories();
    });
  }

  public getCategories() {
    
		this.http.get('category?parent=true&is_active=true&type=courses').subscribe((response:any) => {
      // console.log(response,'Response');
      // let dycryptData= JSON.parse(this.EncrDecr.get('123456$#@$^@1ERF', response));
     // console.log(dycryptData,'Dycriptdata');
      
			if (response['status'] === 'success') {
				const itemsDate = [];
				response['data'].forEach(item => {
					itemsDate.push(item);
				});
				this.categories = itemsDate;
      }

      // 03.05.19
      // if (dycryptData['status'] === 'success') {
			// 	const itemsDate = [];
			// 	dycryptData['data'].forEach(item => {
			// 		itemsDate.push(item);
			// 	});
			// 	this.categories = itemsDate;
      // }
      


		});
	}
  groupValueFn = (_: string, children: any[]) => ({ name: children[0].parent.name, total: children.length });
  
  search() {

		const form_data = this.searchForm.value;
		// console.log(form_data);
		this.searchParams.string = form_data['string'];
		this.searchParams.category = form_data['category'];
		this.searchParams.is_publish = form_data['is_publish'];
		this.searchParams.is_featured = form_data['is_featured'];
		this.searchParams.price_filter = form_data['price_filter'];
		this.getCourses();
	}

  public getCourses(page: number= 1, limit: number = 1) {
    this.ngxService.start();
      this.http.getUserObservable().pipe(
        mergeMap((user) => {
          if (user) {
            return this.http.setModule('course').search(this.searchParams);
          }
        })
      ).subscribe((response) => {
        this.ngxService.stop();
        if (response) {
          window.scroll(0,0);
          this.data = response['data'];
          //03.05.19
        //  let dycryptData=JSON.parse(this.EncrDecr.get('123456$#@$^@1ERF', response));
        //  console.log(dycryptData['data'],'course data');
        //  this.data = dycryptData['data'];

        }
      }, (error) => {
        this.ngxService.stop();
        this.commonService.showErrors(error);
      });
  }

  
  promoteCourseModal(courseId) {
    const modalRef = this.modalService.open(CoursePromoteModalComponent);
    modalRef.componentInstance.courseId = courseId;
    modalRef.result.then((result) => {
   //  this.myRoute.navigate(['/dashboard', 'course-promote-checkout']);
      this.myRoute.navigate(['/dashboard', 'course-promote-checkout-address']);
		}).catch((error) => {
			//  console.log(error);
		});
  }

  kycModal(courseId) {
    const modalRef = this.modalService.open(KycModalComponent);
    modalRef.componentInstance.entityType = 'course';
    
  }


  public editCourse(course): void {
    localStorage.removeItem('courseEditId');
    localStorage.setItem('courseEditId', course.id.toString());
    this.http.get(`utility/course-order-status/${localStorage.getItem('courseEditId')}`).subscribe((response) => {
			if (response['status'] === 'success') {
        this.myRoute.navigate(['/dashboard/course-edit']);
			}
    }, (errors) => { 
      this.commonService.showMessage({type: 'error',title:'',message:'Someone has already purchased this course'});
    });
  }

  public changeStatus(statusType, courseId, index,item) {
    // console.log(statusType);
        let status;
        if (statusType=='draft') {
          status = 'publish';
        } else {
          status = 'draft';
        }
        const formdata= {
          status: status,
          course_id: courseId,
          user_id: this.user.id,
        };
        this.http.post(`utility/course/status`, formdata).subscribe((response) => {
          if (response['status'] === 'success') {
          const updateData = response['data'];
          // this.data[index].status = updateData.status;

          this.data.find(function(element) {
            if(element.id==updateData.id) {
              element.approved_status=updateData.approved_status;
              element.status=updateData.status;
            }
          });
          
          }
        }
        , (errors) => {
          this.toasterService.pop('error', 'Error', errors.error.message);
        // this.error_messages = errors;
        });

  }

  deleteCourse(course) {
    this.ngxService.start();
    let params = {
      course_id: course.id,
    };
    this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('courseUser').search(params);
				}
			})
		).subscribe((response) => {
      if (response['status'] === 'success') {
          if (response['data'].length > 0) {
            this.ngxService.stop();
            this.toasterService.pop('error', 'Course Already purches by some consumer');
          } else {
              //  if (confirm('Are you sure?')) {

                this.http.get(`utility/soft-delete/courses/${course.id}/vendor/${this.user.id}` ).subscribe((response) => {
                   
                    if (response) {
                      this.ngxService.stop();
                      this.toasterService.pop('success', 'Course deleted');
          
                      const idx = this.data.findIndex((el) => {
                        return (el.id === course.id);
                      });
                      if (idx > -1) {
                        this.data.splice(idx, 1);
                      }
                    }
                  }, (error) => {
                    this.ngxService.stop();
                    this.toasterService.pop('error', 'Failed to delete course');
                  });
              //  }
          }
      }
     
		}, (error) => {
      this.commonService.showErrors(error);
      this.ngxService.stop();
		});
  }

  public goToTop() {
		window.scroll(0,0);
	}

}
