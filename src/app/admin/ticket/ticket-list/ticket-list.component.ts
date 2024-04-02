import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { ToasterService } from 'angular2-toaster';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  public selector: string = 'tbody';
  public records: Array<any> = [];
  public recordsFetchStatus: boolean =true;
  public paginationObj: any;
  public searchParams: any = {
    limit: this.httpService.adminPerPage,
    page: 1,
    pagination:true,
    status:'',
    priority:''
  };
  searchForm: FormGroup;
  public statusList: Array<any> =[
   
    {
      label:'Open',
      value:'2',
      color:'#e80707',
    },
    {
      label:'Pending',
      value:'3',
      color:'#FF4500',
    },
    {
      label:'Resolved',
      value:'4',
      color:'#001fff',
    },
    {
      label:'Closed',
      value:'5',
      color:'#28a745',
    },
    {
      label: 'Waiting on Customer',
      value: '6',
      color:'#969609',
    },
    {
      label: 'Waiting on Third Party',
      value: '7',
      color:'#ffc107',
    }
  
];

public priorities: Array<any> =[
 
  {
    label:'Low',
    value:'1',
    color:'#a0d76a',
  },
  {
    label:'Medium',
    value:'2',
    color:'#4da1ff',
  },
  {
    label:'High',
    value:'3',
    color:'#ffd012',
  },
  {
    label:'Urgent',
    value:'4',
    color:'#ff5959',
  },

];
  constructor(
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private httpService: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.searchForm = this.fb.group({
			status: [],
			priority: [],
		});
    this.getAllTickets();
  }

  getAllTickets() {
    this.ngxService.start();

    this.httpService.getUserObservable().pipe(
      mergeMap((user) => {
        if (user) {
          //this.searchParams.vendor_id = user.user.id;
          // return this.httpService.setModule('orders').search(this.searchParams);
          return this.httpService.setModule('supportTicket').search(this.searchParams);
        }
      })
    ).subscribe((response) => {
      this.ngxService.stop();
      if (response) {
          // console.log(response.data);
        //this.records = response.data;
        if(response.data.length==0){
          this.recordsFetchStatus = false;
        }
        if(this.searchParams.page == 1){
          this.records = response.data;
        } else {
          this.records = this.records.concat(response.data);
        }

        this.records.map((el)=>{
          el.selectedStatus= this.statusList.find((statEl)=>{
            if(statEl.value == el.status) { 
              return statEl;
            }
          });
          el.selectedPriority =this.priorities.find((priorityEl)=>{
            if(priorityEl.value == el.priority) { 
              return priorityEl;
            }
          });
        });
       // console.log(this.records);
        this.searchParams.status = '';
        this.searchParams.priority = '';
        this.searchForm.reset();
        
      }
    }, (error) => {
      this.ngxService.stop();
      this.commonService.showErrors(error);
    });
  } 
  onScroll() {
    if(this.recordsFetchStatus){
      this.searchParams.page += 1;
      if(this.searchParams.status || this.searchParams.priority) {
        this.getSearchResult();
      } else {
        this.getAllTickets();
      }
     
    }
   
  }

  statusChange(curStatus, ticket) {
     //console.log(curStatus,'curStatus',ticket,'ticket');
    this.ngxService.start();
    let params = {
      id: ticket.id,
      requester_id: ticket.requester.id,
	    email: ticket.requester.email,
	    status: parseInt(curStatus),
	    priority: ticket.priority,
	    source: ticket.source,
    };
    this.httpService.setModule('supportTicket').update(params).subscribe((response) => {
      this.ngxService.stop();
      		if (response) {
            this.toasterService.pop('success', 'Ticket status updated');
            this.records.find( (element) =>{
              if (element.id === ticket.id) {
                element.status = curStatus;

                element.selectedStatus= this.statusList.find((statEl)=>{
                  if(statEl.value == element.status) { 
                    return statEl;
                  }
                });

                return true;
              }
            });
      		}
      	}, (error) => {
          this.ngxService.stop();
      	//	console.log(error);
      		this.commonService.showErrors(error);
      	});
  }
  

  priorityChange(curPriority, ticket) {
   // console.log(curPriority,'curStatus',ticket,'ticketId');
    this.ngxService.start();
    let params = {
      id: ticket.id,
      requester_id: ticket.requester.id,
	    email: ticket.requester.email,
	    status: ticket.status,
	    priority: parseInt(curPriority),
	    source: ticket.source,
    };

    this.httpService.setModule('supportTicket').update(params).subscribe((response) => {
      this.ngxService.stop();
      		if (response) {
            this.toasterService.pop('success', 'Ticket status updated');
            this.records.find( (element) => {
              if (element.id === ticket.id) {
                element.priority = curPriority;

                element.selectedPriority= this.priorities.find((priorityEl)=>{
                  if(priorityEl.value == element.priority) { 
                    return priorityEl;
                  }
                });

                return true;
              }
            });
      		}
      	}, (error) => {
          this.ngxService.stop();
      	//	console.log(error);
      	//	this.commonService.showErrors(error);
      	});


  }


  search() {

		const form_data = this.searchForm.value;
		// console.log(form_data);
		this.searchParams.status = form_data['status'];
    this.searchParams.priority = form_data['priority'];
    this.searchParams.page = 1;
    if(this.searchParams.status || this.searchParams.priority){
      this.getSearchResult();
    } else {
      this.getAllTickets();
    }
	
  }
  
  getSearchResult() {
    this.ngxService.start();

    this.httpService.getUserObservable().pipe(
      mergeMap((user) => {
        if (user) {
          //this.searchParams.vendor_id = user.user.id;
          // return this.httpService.setModule('orders').search(this.searchParams);
          return this.httpService.setModule('supportTicketSearch').search(this.searchParams);
        }
      })
    ).subscribe((response) => {
      this.ngxService.stop();
      if (response) {
          // console.log(response.data);
        //this.records = response.data;
        if(response.data.length==0){
          this.recordsFetchStatus = false;
        }
        if(this.searchParams.page == 1 ){
          this.records = response.data.results;
        } else {
          this.records = this.records.concat(response.data.results);
        }

        this.records.map((el)=>{
          el.selectedStatus= this.statusList.find((statEl)=>{
            if(statEl.value == el.status) { 
              return statEl;
            }
          });
          el.selectedPriority =this.priorities.find((priorityEl)=>{
            if(priorityEl.value == el.priority) { 
              return priorityEl;
            }
          });
        });
      }
       
    }, (error) => {
      this.ngxService.stop();
     // this.commonService.showErrors(error);
    });
  }


}
