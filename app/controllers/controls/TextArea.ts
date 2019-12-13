import { logger } from '/logger';
import { TextAreaAbstract } from './TextAreaAbstract';

export default class TextArea extends TextAreaAbstract {
	public textAreaValueChanged({ value }: Ti.UI.TextArea_change_Event): void {
		logger.log(`Ti.UI.TextArea changed value to ${value}`);
	}

	public textAreaFocussed(): void {
		logger.log('Ti.UI.TextArea focussed!');
	}

	public textAreaBlurred(): void {
		logger.log('Ti.UI.TextArea blurred!');
	}
}
