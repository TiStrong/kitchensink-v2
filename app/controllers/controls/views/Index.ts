import Alloy from 'alloy';
import { logger } from '/logger';
import { IndexAbstract } from './IndexAbstract';

export default class Index extends IndexAbstract {
	public openComponent(e: Ti.UI.ListView_itemclick_Event): void {
		if (!e.section) {
			return;
		}
		const item = e.section.getItemAt(e.itemIndex);
		if (!item || !item.properties) {
			return;
		}
		const identifier = 'controls/views/' + item.properties.itemId;
		const component = Alloy.createController(identifier).getView();

		Alloy.Globals.setAndroidBackButton(component);
		Alloy.CFG.tabGroup.activeTab.open(component);

		logger.log('Ti.UI.TabGroup.activeTab.open', identifier);
	}
}
