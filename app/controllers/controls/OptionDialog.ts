import { logger } from '/logger';
import { OptionDialogAbstract } from './OptionDialogAbstract';

export default class OptionDialog extends OptionDialogAbstract {
	public showOptionDialog(): void {
		this.dialog.show();
	}

	public optionDialogClicked({ index }: Ti.UI.OptionDialog_click_Event): void {
		alert(`Selected option at index: ${index}`);
		logger.log(`Ti.UI.OptionDialog selected option at index: ${index}`);
	}
}
