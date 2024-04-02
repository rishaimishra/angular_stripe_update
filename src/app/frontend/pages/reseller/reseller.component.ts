import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from '../registration/registration.component';
import { HttpRequestService } from '../../../services/http-request.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrls: ['./reseller.component.scss']
})
export class ResellerComponent implements OnInit {

  constructor(private modalService: NgbModal, public http: HttpRequestService, private myRoute: Router) { }

  ngOnInit() {
  }
  registerFormModal() {
    const modalRef = this.modalService.open(RegistrationComponent);
    modalRef.componentInstance.role = 'reseller';
    modalRef.result.then((result) => {
      //console.log(result);
     // this.myRoute.navigate([ '/reseller-registration-succcess']);

     if(result.provider=='normal'){
      this.myRoute.navigate(['/reseller-registration-succcess']);
      } else {
        this.myRoute.navigate(['/']);
      }

    }).catch((error) => {
      //console.log(error);
    });
  }

}
