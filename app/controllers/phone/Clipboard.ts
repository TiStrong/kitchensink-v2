import { ClipboardAbstract } from './ClipboardAbstract';

export default class Clipboard extends ClipboardAbstract {
	public copyText(): void {
		if (this.copyField.value.length > 0) {
			Ti.UI.Clipboard.setText(this.copyField.value);
			alert('Copied!');
		} else {
			alert('Enter some text before :-)');
		}
	}

	public pasteText(): void {
		if (Ti.UI.Clipboard.hasText() === true) {
			this.pasteField.value = Ti.UI.Clipboard.getText();
		} else {
			alert('No text on clipboard!');
		}
	}
}
