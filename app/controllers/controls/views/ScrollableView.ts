import { logger } from '/logger';
import * as _ from 'underscore';
import { ScrollableViewAbstract } from './ScrollableViewAbstract';

export default class ScrollableView extends ScrollableViewAbstract {
	public scrollToView(): void {
		this.scrollable.scrollToView(1); // Index or view
	}

	public addNewView(): void {
		const newView = Ti.UI.createView({
			backgroundColor: 'rgba(' + _.random(0, 255) + ',' + _.random(0, 255) + ',' + _.random(0, 255) + ', 1.0)', // Generate rgba-color
		});

		this.scrollable.addView(newView);
		logger.log('Ti.UI.ScrollableView added new view at index ' + (this.scrollable.views.length - 1));

		this.validateButtons();
	}

	public removeLastView(): void {
		this.scrollable.removeView(this.scrollable.views[this.scrollable.views.length - 1]);
		logger.log('Ti.UI.ScrollableView deleted last view');

		this.validateButtons();
	}

	public scrollableViewDidScroll(e: Ti.UI.ScrollableView_scrollend_Event): void {
		logger.log('Ti.UI.ScrollableView did scroll to index ' + e.currentPage);
	}

	public validateButtons(): void {
		if (this.remove && this.scrollTo) {
			this.remove.enabled = this.scrollable.views.length > 0;
			this.scrollTo.enabled = this.scrollable.views.length >= 2;
		}
	}
}
