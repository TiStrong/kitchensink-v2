import { logger } from '/logger';
import { TextFieldAbstract } from './TextFieldAbstract';

export default class TextField extends TextFieldAbstract {
	private focussedTextfield?: string;

	public textFieldValueChanged({ source, value }: Ti.UI.TextField_change_Event): void {
		logger.log(`${source.id} changed value to ${value}`);
	}

	public textFieldFocussed({ source }: Ti.UI.TextField_focus_Event): void {
		this.focussedTextfield = source.id;
		logger.log(`${source.id} focussed!`);
	}

	public textFieldBlurred({ source }: Ti.UI.TextField_blur_Event): void {
		this.focussedTextfield = void 0;
		logger.log(`${source.id} blurred!`);
	}

	public blurTextfield(): void {
		if (this.focussedTextfield) {
			const view = this.getView(this.focussedTextfield) as Ti.UI.TextField;
			if (view) {
				view.blur();
			}
		}
	}
}
