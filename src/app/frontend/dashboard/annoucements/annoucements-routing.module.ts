import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnoucementIndexComponent } from './annoucement-index/annoucement-index.component';
import { AnnoucementManageComponent } from './annoucement-manage/annoucement-manage.component';

import { RoleGuard } from '../../../services/role-guard.service';
const routes: Routes = [
  {
		path: '',
		canActivate: [RoleGuard],
		data: { role: 'vendor' },
		children: [
			{ path: '', component: AnnoucementIndexComponent },
			{ path: 'create', component: AnnoucementManageComponent },
			{ path: 'edit/:id', component: AnnoucementManageComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnoucementsRoutingModule { }
