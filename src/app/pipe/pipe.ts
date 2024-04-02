import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupByPipe } from './group-by.pipe';
import { StringToSlug } from './string-slug.pipe';
import { StringLimit } from './string-limit.pipe';
import { toArray } from './to-array.pipe';
import { KeysPipe } from './keys.pipe';
import { FilterPipe } from './filter.pipe';
import { RemoveModulePipe } from './remove-module.pipe';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { SearchStringPipe } from './search-string.pipe';
@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GroupByPipe,
        StringToSlug,
        StringLimit,
        toArray,
        KeysPipe,
        FilterPipe,
        RemoveModulePipe,
        SanitizeHtmlPipe,
        SearchStringPipe
    ],
    exports : [
        GroupByPipe,
        StringToSlug,
        StringLimit,
        toArray,
        KeysPipe,
        FilterPipe,
        RemoveModulePipe,
        SanitizeHtmlPipe,
        SearchStringPipe
    ]
})
export class CustomPipes { }
