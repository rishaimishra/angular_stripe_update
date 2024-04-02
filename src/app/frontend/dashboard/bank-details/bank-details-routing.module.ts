import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankDetailsIndexComponent } from './bank-details-index/bank-details-index.component';
import { BankDetailsManageComponent } from './bank-details-manage/bank-details-manage.component';

import { RoleGuard } from '../../../services/role-guard.service';
const routes: Routes = [
  {
		path: '',
		canActivate: [RoleGuard],
		data: { role: 'vendor' },
		children: [
			{ path: '', component: BankDetailsIndexComponent },
			{ path: 'create', component: BankDetailsManageComponent },
			{ path: 'edit/:id', component: BankDetailsManageComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankDetailsRoutingModule { }
