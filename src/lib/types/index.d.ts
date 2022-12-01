import type { Writable } from 'svelte/store';

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
	/** Returns `false` if the reset was in such a way that a reload of the iframe isn't needed */
	reset(files: Array<Stub>): Promise<boolean>;
	update(file: Array<FileStub>): Promise<void>;
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

export interface FileTreeContext {
	select: (file: FileStub) => void;
	add: (stubs: Stub[]) => Promise<void>;
	edit: (stub: Stub, name: string) => Promise<void>;
	remove: (stub: Stub) => Promise<void>;
	selected: Writable<FileStub | null>;
}

export interface EditingConstraints {
	create: string[];
	remove: string[];
}
