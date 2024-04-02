import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventAttendeeInfoComponent } from './event-attendee-info/event-attendee-info.component';
const routes: Routes = [
  {
    path:'',
    component:EventAttendeeInfoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventAttendeeInfoRoutingModule { }
