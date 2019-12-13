import { DrawerAbstract } from './DrawerAbstract';

export default class Drawer extends DrawerAbstract {
	constructor() {
		super();
		this.Drawer.addEventListener('open', () => {
			const activity = this.Drawer.activity;
			const actionbar = activity.actionBar;

			if (actionbar) {
				actionbar.displayHomeAsUp = true;
				actionbar.onHomeIconItemSelected = (): void => {
					if (this.drawerLayout) {
						this.drawerLayout.toggleLeft();
					}
				};
			}
		});
	}

	public onClickLeft(): void {
		if (this.drawerLayout) {
			this.drawerLayout.toggleLeft();
		}
	}

	public onClickRight(): void {
		if (this.drawerLayout) {
			this.drawerLayout.toggleRight();
		}
	}

	public onClickClose(): void {
		this.Drawer.close();
	}
}
