import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { GlobalModule } from '../../../global/global.module';

import { ProductRoutingModule } from './product-routing.module';
import { ProductIndexComponent } from './product-index/product-index.component';
import { ProductManageComponent } from './product-manage/product-manage.component';

@NgModule({
	imports: [
		CommonModule,
		NgSelectModule,
		GlobalModule,

		ProductRoutingModule
	],
	declarations: [
		ProductIndexComponent,
		ProductManageComponent
	]
})
export class ProductModule { }
