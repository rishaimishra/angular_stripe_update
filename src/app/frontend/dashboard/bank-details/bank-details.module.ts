import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../../../global/global.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { BankDetailsRoutingModule } from './bank-details-routing.module';
import { BankDetailsIndexComponent } from './bank-details-index/bank-details-index.component';
import { BankDetailsManageComponent } from './bank-details-manage/bank-details-manage.component';

@NgModule({
  imports: [
    CommonModule,
    BankDetailsRoutingModule,
    GlobalModule,
    NgSelectModule
  ],
  declarations: [
    BankDetailsIndexComponent, 
    BankDetailsManageComponent
  ]
})
export class BankDetailsModule { }
