import { logger } from '/logger';
import { TabbedBarAbstract } from './TabbedBarAbstract';

export default class TabbedBar extends TabbedBarAbstract {
	public tabbedBarSelectedIndex({ index }: Ti.UI.TabbedBar_click_Event): void {
		const message = `Ti.UI.TabbedBar changed to index: ${index}`;

		alert(message);
		logger.log(message);
	}
}
