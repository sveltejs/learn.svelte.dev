export interface FileStub {
	type: 'file';
	name: string;
	basename: string;
	contents: string;
	text: boolean;
	depth: number;
}

export interface DirectoryStub {
	type: 'directory';
	name: string;
	basename: string;
	depth: number;
}

export type Stub = FileStub | DirectoryStub;

export interface Adapter {
	base: string;
	reset(files: Array<Stub>): Promise<void>;
	update(files: Array<Stub>): Promise<void>;
	destroy(): Promise<void>;
}

export interface Section {
	chapter: {
		title: string;
		scope: {
			prefix: string;
			depth: number;
			name: string;
		};
	};
	title: string;
	slug: string;
	prev: string | null;
	next: string | null;
	html: string;
	dir: string;
	a: Record<string, Stub>;
	b: Record<string, Stub>;
}

export type SectionIndex = Array<{
	slug: string;
	title: string;
	chapters: Array<{
		title: string;
		sections: SectionStub[];
	}>;
}>;

export interface SectionStub {
	title: string;
	slug: string;
	prev: string | null;
	next: string | null;
}
