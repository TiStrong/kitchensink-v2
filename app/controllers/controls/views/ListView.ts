import { logger } from '/logger';
import { ListViewAbstract } from './ListViewAbstract';

export default class ListView extends ListViewAbstract {
	public fetchData(): void {
		// You would usually fetch your remote data here
		setTimeout(() => {
			if (this.refresh) {
				this.refresh.endRefreshing();
			}
			logger.log('Ti.UI.RefreshControl finished refreshing');
		}, 1000);
	}

	public handleListViewClick(e: Ti.UI.ListView_itemclick_Event): void {
		logger.log('Ti.UI.ListView clicked cell at index', e.sectionIndex + ' / ' + e.itemIndex);
		if (OS_IOS) {
			e.source.deselectItem(e.sectionIndex, e.itemIndex);
		}
	}
}
