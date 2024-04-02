import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VariableDirective } from './variable.directive';
import { PermissionDirective } from './permission.directive';
import { RoleDirective } from './role.directive';


@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [
        VariableDirective,
        PermissionDirective,
        RoleDirective
    ],
    exports : [
        VariableDirective,
        PermissionDirective,
        RoleDirective
    ]
   
})
export class CustomDirective { }
