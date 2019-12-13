import { ActivityIndicatorAbstract } from './ActivityIndicatorAbstract';
import * as _ from 'underscore';

export default class ActivityIndicator extends ActivityIndicatorAbstract {
	public showIndicator(): void {
		this.indicatorLight.show();
		this.indicatorDark.show();
		this.indicatorBig.show();
		this.indicatorMessage.show();
		this.indicatorNavBar.show();
	}

	public changeTintColor(): void {
		const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

		this.indicatorLight.indicatorColor = colors[_.random(0, colors.length - 1)];
		this.indicatorDark.indicatorColor = colors[_.random(0, colors.length - 1)];
		this.indicatorBig.indicatorColor = colors[_.random(0, colors.length - 1)];
		this.indicatorMessage.indicatorColor = colors[_.random(0, colors.length - 1)];
		this.indicatorNavBar.indicatorColor = colors[_.random(0, colors.length - 1)];
	}
}
