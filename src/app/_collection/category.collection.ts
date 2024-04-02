export class CategoryCollection {
	constructor(
		public name: string = null,
		public description: string = null,
		public slug: string = null,
		public parent_id: number = null,
		public category_id: any = [],
	) { }
}
