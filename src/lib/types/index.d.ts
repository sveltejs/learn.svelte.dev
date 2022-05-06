export interface File {
	type: 'file';
	name: string;
	contents: string;
}

export interface Directory {
	type: 'directory';
	name: string;
}

export interface Adapter {
	update(files: File[]): Promise<void>;
	destroy(): Promise<void>;
}
