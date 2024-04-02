import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventAttendeeInfoRoutingModule } from './event-attendee-info-routing.module';
import { EventAttendeeInfoComponent } from './event-attendee-info/event-attendee-info.component';
import { NgSelectModule } from '@ng-select/ng-select';
/*******Import Dirtective list ********/
import { CustomDirective } from '../../directive/directive';

/*******Import Pipe list ********/
import { CustomPipes } from '../../pipe/pipe';
import { environment } from '../../../environments/environment';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SharedModule } from '../../common/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EventAttendeeInfoRoutingModule,
    SharedModule,
		CustomDirective,
    CustomPipes,
    NgSelectModule,
    SweetAlert2Module.forRoot(environment.notificationConfig),
  ],
  declarations: [EventAttendeeInfoComponent]
})
export class EventAttendeeInfoModule { }
