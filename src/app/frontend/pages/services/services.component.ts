import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicesComponent implements OnInit {

  constructor(private http: HttpRequestService) { }
  title: any;
  content: any;
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http.get('cms-page/services').subscribe((response) => {
      if (response['status'] === 'success') {
        this.title = response['data'].title;
        this.content = response['data'].content;
      }
    });
  }


}
