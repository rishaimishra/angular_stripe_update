import { Component, OnInit, Input } from '@angular/core';
import {
	NgbModal,
	ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-wallet-details',
	templateUrl: './wallet-details.component.html',
	styleUrls: ['./wallet-details.component.scss']
})
export class WalletDetailsComponent implements OnInit {

	@Input() transactionDetails: any;
	constructor(
		public activeModal: NgbActiveModal,
		private modalService: NgbModal,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();	
	}

}
