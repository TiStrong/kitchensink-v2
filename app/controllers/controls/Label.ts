import { LabelAbstract } from './LabelAbstract';

export default class Label extends LabelAbstract {
	public changeToCenterAlignment(): void {
		this.myLabel.textAlign = 'center';
	}

	public changeToLeftAlignment(): void {
		this.myLabel.textAlign = 'left';
	}

	public changeToRightAlignment(): void {
		this.myLabel.textAlign = 'right';
	}

	public changeToJustifyAlignment(): void {
		this.myLabel.textAlign = 3; // or 'justify' in Titanium 6.1.0 and later (TIMOB-3408)
	}

	public changeColor(): void {
		this.myLabel.color = 'red'; // or: '#ff0', '#ff0000', rgba('255, 0,0 , 1.0')
	}
}
