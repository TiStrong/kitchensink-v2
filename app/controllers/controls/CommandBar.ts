import { CommandBarAbstract } from './CommandBarAbstract';

export default class CommandBar extends CommandBarAbstract {
	public sayDelete(): void {
		alert('Hey you just deleted something!');
	}

	public sayThanks({ checked }: { checked: boolean }): void {
		if (checked) {
			alert('Thanks for liking!');
		}
	}
}
