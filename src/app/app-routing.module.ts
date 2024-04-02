import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

import { AuthGuard } from './services/auth-guard.service';
import { RoleGuard } from './services/role-guard.service';
import { TutorialComponent } from './tutorial/tutorial.component';


const routes: Routes = [

	{ path: '', loadChildren: './frontend/frontend.module#FrontendModule' },
	{ path: 'video-tutorial',  component: TutorialComponent},
	{ path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard, RoleGuard], data: { role: 'admin' } },
	{ path: 'reset', redirectTo: '' },
	{ path: 'token', redirectTo: '' },
	{ path: '**', component: NotFoundComponent },
];


@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	declarations: [
		
	]
})
export class AppRoutingModule { }
