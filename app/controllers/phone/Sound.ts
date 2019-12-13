import Alloy from 'alloy';
import { logger } from '/logger';
import { SoundAbstract } from './SoundAbstract';

export default class Sound extends SoundAbstract {
	public openSoundComponent(e: Ti.UI.ListView_itemclick_Event): void {
		const item = e.section.getItemAt(e.itemIndex);
		if (!item || !item.properties) {
			return;
		}
		const identifier = 'phone/' + item.properties.itemId;
		const component = Alloy.createController(identifier).getView();

		Alloy.CFG.tabGroup.activeTab.open(component);
		logger.log('Ti.UI.TabGroup.activeTab.open', identifier);
	}
}
