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
	/** Returns `false` if the reset was in such a way that a reload of the iframe isn't needed */
	reset(files: Array<Stub>): Promise<boolean>;
	update(file: FileStub): Promise<boolean>;
}

export interface Scope {
	prefix: string;
	name: string;
}

export interface Exercise {
	part: {
		slug: string;
		title: string;
		label: string;
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
	markdown: string;
	html: string;
	dir: string;
	editing_constraints: {
		create: Set<string>;
		remove: Set<string>;
	};
	a: Record<string, Stub>;
	b: Record<string, Stub>;
	has_solution: boolean;
}

export interface ExerciseStub {
	title: string;
	slug: string;
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
	create: Set<string>;
	remove: Set<string>;
}

// TODO replace with `Warning` from `svelte/compiler`
export interface Warning {
	code: string;
	start: { line: number; column: number; character: number };
	end: { line: number; column: number; character: number };
	pos: number;
	filename: string;
	frame: string;
	message: string;
}

export interface MenuItem {
	icon: string;
	label: string;
	fn: () => void;
}
