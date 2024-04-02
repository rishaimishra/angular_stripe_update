import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-logout-msg',
  templateUrl: './logout-msg.component.html',
  styleUrls: ['./logout-msg.component.scss']
})
export class LogoutMsgComponent implements OnInit {

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

}
