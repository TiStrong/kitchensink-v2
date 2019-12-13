import { logger } from '/logger';
import { ToolbarAbstract } from './ToolbarAbstract';

export default class Toolbar extends ToolbarAbstract {
	public sayHello({ source }: Ti.UI.Button_click_Event): void {
		alert(`Hello from ${source.title}`);
		logger.log(`Ti.UI.Toolbar selected button with title: ${source.title}`);
	}
}
