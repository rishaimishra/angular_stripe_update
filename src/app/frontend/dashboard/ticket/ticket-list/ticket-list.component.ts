import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../../global/services/common.service';

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
    limit: this.httpService.vendorPerPage,
    page: 1,
    pagination:true,
    user: this.httpService.getUser().email,
  };
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
    private httpService: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
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
        //  console.log(response.data);
        //this.records = response.data;
        if(response.data.length==0){
          this.recordsFetchStatus = false;
        }
        this.records = this.records.concat(response.data);
        this.records.map((el) => {
          this.statusList.find((statusEl) => {
              if(statusEl.value == el.status) {
                el.status = statusEl.label;
                el.statusColor = statusEl.color;
                return true;
              }
          });
          this.priorities.find((priorityEl) => {
              if(priorityEl.value == el.priority){
                el.priority = priorityEl.label;
                el.priorityColor = priorityEl.color;
                return true;
              }
          })
        });
        console.log(this.records);
      }
    }, (error) => {
      this.ngxService.stop();
      //this.commonService.showErrors(error);
    });
  } 
  onScroll() {
    if(this.recordsFetchStatus){
      this.searchParams.page += 1;
      this.getAllTickets();
    }
   
  }

  // statusChange(curStatus, ticketId) {
  //   // console.log(curStatus,'curStatus',ticketId,'ticketId');
  // }

  // priorityChange(curPriority, ticketId) {
  //   // console.log(curPriority,'curPriority',ticketId,'ticketId');
  // }

}
