import * as Backbone from 'backbone';

declare class Logger extends Backbone.EventsMixin {
	public history: string;
	public log(...args: any[]): void;
	public clearHistory(): void;
}

export const logger: Logger;
