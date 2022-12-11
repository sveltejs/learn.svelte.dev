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

export interface Adapter {
	base: string;
	/** Returns `false` if the reset was in such a way that a reload of the iframe isn't needed */
	reset(files: Array<Stub>): Promise<boolean>;
	update(file: Array<FileStub>): Promise<boolean>;
	destroy(): Promise<void>;
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
	scope: {
		prefix: string;
		depth: number;
		name: string;
	};
	focus: string;
	title: string;
	slug: string;
	prev: { slug: string } | null;
	next: { slug: string; title: string } | null;
	html: string;
	dir: string;
	a: Record<string, Stub>;
	b: Record<string, Stub>;
}

export interface ExerciseRaw {
	title: string;
	slug: string;
	prev: { slug: string } | null;
	next: { slug: string; title: string } | null;
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

export interface FileTreeContext {
	select: (file: FileStub) => void;
	add: (name: string, type: 'file' | 'directory') => Promise<void>;
	edit: (stub: Stub, name: string) => Promise<void>;
	remove: (stub: Stub) => Promise<void>;
	selected: Writable<FileStub | null>;
}

export interface EditingConstraints {
	create: string[];
	remove: string[];
}
