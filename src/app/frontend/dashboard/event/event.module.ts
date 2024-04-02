import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GlobalModule } from '../../../global/global.module';

import { EventRoutingModule } from './event-routing.module';
import { EventIndexComponent } from './event-index/event-index.component';
import { EventManageComponent } from './event-manage/event-manage.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { environment } from '../../../../environments/environment';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
	imports: [
		CommonModule,
		NgSelectModule,
		NgbModule,
		GlobalModule,
		EventRoutingModule,
		SweetAlert2Module.forRoot(environment.notificationConfig),
		ImageCropperModule,
		CKEditorModule,
	],
	declarations: [
		EventIndexComponent,
		EventManageComponent,
	],
	providers: [
		DecimalPipe
	]
})
export class EventModule { }
