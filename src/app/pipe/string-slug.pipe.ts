import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'strToSlug' })

export class StringToSlug implements PipeTransform {

	transform(input_value: string) {

		if (!input_value) {
			return null;
		}

		return input_value.toString().toLowerCase()
			.replace(/\s+/g, '-')           // Replace spaces with -
			.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
			.replace(/\-\-+/g, '-')         // Replace multiple - with single -
			.replace(/^-+/, '')             // Trim - from start of text
			.replace(/-+$/, '');            // Trim - from end of text

	}
}
