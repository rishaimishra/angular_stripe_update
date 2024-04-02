import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(private http: HttpRequestService) { }

  title: any;
  content: any;
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http.get('cms-page/faq').subscribe((response) => {
      if (response['status'] === 'success') {
        this.title = response['data'].title;
        this.content = response['data'].content;
      }
    });
  }

}
