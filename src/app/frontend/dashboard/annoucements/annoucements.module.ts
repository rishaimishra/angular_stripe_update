import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../../../global/global.module';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AnnoucementsRoutingModule } from './annoucements-routing.module';
import { AnnoucementIndexComponent } from './annoucement-index/annoucement-index.component';
import { AnnoucementManageComponent } from './annoucement-manage/annoucement-manage.component';

@NgModule({
  imports: [
    CommonModule,
    AnnoucementsRoutingModule,
    GlobalModule,
    FormsModule,
		ReactiveFormsModule,
  ],
  declarations: [
    AnnoucementIndexComponent, 
    AnnoucementManageComponent
  ],
  providers: [
    FormBuilder,
  ]
})
export class AnnoucementsModule { }
