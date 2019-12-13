import { PeekAndPopAbstract } from './PeekAndPopAbstract';

export default class PeekAndPop extends PeekAndPopAbstract {
	constructor() {
		super();
		// Assign the 'pop' feature to the button
		this.button.previewContext = this.context;
	}

	public alertActionTitle(e: Ti.UI.iOS.PreviewAction_click_Event): void {
		// WTF?
		alert('Title: ' + /*e.title +*/ ' / Style: ' + /*e.style +*/ ' / Index: ' + e.index);
	}

	public alertAction(e: Ti.UI.iOS.PreviewAction_click_Event): void {
		// WTF?
		alert('Title: ' + /*e.title +*/ ' / Style: ' + /*e.style +*/ ' / Index: ' + e.index);
	}

	public alertSubAction(e: Ti.UI.iOS.PreviewAction_click_Event): void {
		// WTF?
		alert('Title: ' + /*e.title +*/ ' / Style: ' + /*e.style +*/ ' / Subindex: ' + e.index);
	}

	// Pop the preview
	public pop(): void {
		this.detailWin.add(this.detailText);
		this.detailWin.add(this.buttonBack);
		this.detailWin.open();
	}

	public goBack(): void {
		this.detailWin.close();
	}
}
