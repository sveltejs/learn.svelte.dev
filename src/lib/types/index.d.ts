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
	part: {
		slug: string;
		title: string;
		index: number;
	};
	chapter: {
		slug: string;
		title: string;
	};
	scope: {
		prefix: string;
		depth: number;
		name: string;
	};
	focus: string;
	title: string;
	slug: string;
	prev: { slug: string; title: string } | null;
	next: { slug: string; title: string } | null;
	html: string;
	dir: string;
	a: Record<string, Stub>;
	b: Record<string, Stub>;
}

export interface SectionRaw {
	title: string;
	slug: string;
	prev: { slug: string; title: string } | null;
	next: { slug: string; title: string } | null;
	markdown: string;
	dir: string;
}

export interface SectionStub {
	title: string;
	slug: string;
	prev: { slug: string; title: string } | null;
	next: { slug: string; title: string } | null;
}

export interface ChapterStub {
	slug: string;
	title: string;
	sections: SectionStub[];
}

export interface PartStub {
	slug: string;
	title: string;
	chapters: ChapterStub[];
}
