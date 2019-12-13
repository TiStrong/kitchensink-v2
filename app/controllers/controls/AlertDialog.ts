import { logger } from '/logger';
import { AlertDialogAbstract } from './AlertDialogAbstract';

export default class AlertDialog extends AlertDialogAbstract {
	public showAlertDialog(): void {
		this.alert.show();
	}

	public alertDialogClicked({ index }: { index: number }): void {
		alert(`Selected button at index: ${index}`);
		logger.log(`Ti.UI.AlertDialog selected button at index: ${index}`);
	}
}
