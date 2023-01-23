import type { Writable } from 'svelte/store';

export interface FileStub {
	type: 'file';
	name: string;
	basename: string;
	contents: string;
	text: boolean;
}

export interface DirectoryStub {
	type: 'directory';
	name: string;
	basename: string;
}

export type Stub = FileStub | DirectoryStub;

export interface AdapterInternal {
	base: string;
	/** Returns `false` if the reset was in such a way that a reload of the iframe isn't needed */
	reset(files: Array<Stub>): Promise<boolean>;
	update(file: Array<FileStub>): Promise<boolean>;
	destroy(): Promise<void>;
}

export interface Adapter extends AdapterInternal {
	reset(files: Array<Stub>): Promise<boolean | 'cancelled'>;
	update(file: Array<FileStub>): Promise<boolean | 'cancelled'>;
	init: Promise<void>;
}

export interface Scope {
	prefix: string;
	depth: number;
	name: string;
}

export interface Exercise {
	part: {
		slug: string;
		title: string;
		index: number;
	};
	chapter: {
		slug: string;
		title: string;
	};
	scope: Scope;
	focus: string;
	title: string;
	/** the initial path to navigate to */
	path: string;
	slug: string;
	prev: { slug: string } | null;
	next: { slug: string; title: string } | null;
	html: string;
	dir: string;
	editing_constraints: {
		create: string[];
		remove: string[];
	};
	a: Record<string, Stub>;
	b: Record<string, Stub>;
}

export interface ExerciseRaw {
	title: string;
	path: string;
	focus: string;
	slug: string;
	prev: { slug: string } | null;
	next: { slug: string; title: string } | null;
	meta: any;
	markdown: string;
	dir: string;
}

export interface ExerciseStub {
	title: string;
	slug: string;
	prev: { slug: string } | null;
	next: { slug: string; title: string } | null;
}

export interface ChapterStub {
	slug: string;
	title: string;
	exercises: ExerciseStub[];
}

export interface PartStub {
	slug: string;
	title: string;
	chapters: ChapterStub[];
}

export interface EditingConstraints {
	create: string[];
	remove: string[];
}
