import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment as env } from '../../../../environments/environment';
import { EncrDecrService } from '../../../services/encr-decr.service';
@Component({
  selector: 'app-kyc-modal',
  templateUrl: './kyc-modal.component.html',
  styleUrls: ['./kyc-modal.component.scss']
})
export class KycModalComponent implements OnInit {
  @Input() entityType: string;
  public kycUrl: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).kycUrl : env.kycUrl;
  public kycReferenceVideoUrl: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).kycReferenceVideoUrl : env.kycReferenceVideoUrl;
  constructor(
    public activeModal: NgbActiveModal,
    private EncrDecr: EncrDecrService 
  ) { }

  ngOnInit() {
  }

}
