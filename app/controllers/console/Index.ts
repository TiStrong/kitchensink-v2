import { logger } from '/logger';
import { IndexAbstract } from './IndexAbstract';

export default class Index extends IndexAbstract {
	constructor(protected args?: any) {
		super();
		logger.on('change', this.showLogs.bind(this));
	}

	public showLogs(): void {
		this.log.text = logger.history;
		this.scrollView.scrollToBottom();
	}

	public clearLogs(): void {
		logger.clearHistory();
		this.showLogs();
	}
	public getViewEx(opts: { recurse: boolean }): Ti.UI.Tab {
		return this.Index;
	}
}
