import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketCreateComponent } from './ticket-create/ticket-create.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { RoleGuard } from '../../../services/role-guard.service';
import { TicketReplyModalComponent } from './ticket-reply-modal/ticket-reply-modal.component';

const routes: Routes = [
  	{
		path: '',
		canActivate: [RoleGuard],
		data: { role: 'customer|vendor|reseller' },
		children: [
			{ path: '', component: TicketListComponent },
			{ path: 'create', component: TicketCreateComponent },
			{ path: 'reply/:id', component: TicketReplyModalComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
