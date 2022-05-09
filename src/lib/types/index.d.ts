export interface File {
	type: 'file';
	name: string;
	basename: string;
	contents: string;
	text: boolean;
	depth: number;
}

export interface Directory {
	type: 'directory';
	name: string;
	basename: string;
	depth: number;
}

export interface Adapter {
	base: string;
	update(files: Array<File | Directory>): Promise<void>;
	destroy(): Promise<void>;
}

export interface Section {
	group: string;
	title: string;
	slug: string;
	prev: string | null;
	next: string | null;
	html: string;
	a: Record<string, File | Directory>;
	b: Record<string, File | Directory>;
}

export type SectionIndex = Array<{
	title: string;
	sections: SectionStub[];
}>;

export interface SectionStub {
	title: string;
	slug: string;
	prev: string | null;
	next: string | null;
}
