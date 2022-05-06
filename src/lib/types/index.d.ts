export interface File {
	type: 'file';
	name: string;
	basename: string;
	contents: string;
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
