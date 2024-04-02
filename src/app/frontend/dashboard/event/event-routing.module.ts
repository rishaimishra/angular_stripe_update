import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventIndexComponent } from './event-index/event-index.component';
import { EventManageComponent } from './event-manage/event-manage.component';

import { RoleGuard } from '../../../services/role-guard.service';

const routes: Routes = [
	{
		path: '',
		canActivate: [RoleGuard],
		data: { role: 'customer|vendor|reseller' },
		children: [
			{ path: '', component: EventIndexComponent },
			{ path: 'create', component: EventManageComponent },
			{ path: 'edit/:id', component: EventManageComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EventRoutingModule { }
