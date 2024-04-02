import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ProductIndexComponent } from './product-index/product-index.component';
import { ProductManageComponent } from './product-manage/product-manage.component';

import { RoleGuard } from '../../../services/role-guard.service';

const routes: Routes = [
	{
		path: '',
		canActivate: [RoleGuard],
		data: { role: 'customer|vendor|reseller' },
		children: [
			{ path: '', component: ProductIndexComponent },
			{ path: 'create', component: ProductManageComponent },
			{ path: 'edit/:id', component: ProductManageComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProductRoutingModule { }
