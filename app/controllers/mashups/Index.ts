import Alloy from 'alloy';
import { logger } from '/logger';
import { IndexAbstract } from './IndexAbstract';

export default class Index extends IndexAbstract {
	public openComponent(e: Ti.UI.ListView_itemclick_Event): void {
		const item = e.section.getItemAt(e.itemIndex);
		if (!item || !item.properties) {
			return;
		}
		const identifier = 'mashups/' + item.properties.itemId;
		const component = Alloy.createController(identifier).getView();

		Alloy.Globals.setAndroidBackButton(component);
		Alloy.CFG.tabGroup.activeTab.open(component);

		logger.log('Ti.UI.TabGroup.activeTab.open', identifier);
	}
	public getViewEx(opts: { recurse: boolean }): Ti.UI.Tab {
		return this.Index;
	}
}
