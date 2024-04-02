import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../common/shared.module';
import { CustomDirective } from '../../../directive/directive';
import { TicketRoutingModule } from './ticket-routing.module';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketReplyModalComponent } from './ticket-reply-modal/ticket-reply-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
@NgModule({
  imports: [
    CommonModule,
    CustomDirective,
    TicketRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedModule,
    MomentModule,
    NgbModule
  
  ],
  declarations: [TicketCreateComponent, TicketListComponent, TicketReplyModalComponent],
 
})
export class TicketModule { }
