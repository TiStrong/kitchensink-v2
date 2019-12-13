import { logger } from '/logger';
import { SwitchControlAbstract } from './SwitchControlAbstract';

export default class SwitchControl extends SwitchControlAbstract {
	public switchChanged({ value }: Ti.UI.Switch_change_Event): void {
		this.state.text = `The switch value changed to ${value}`;
		logger.log(`Ti.UI.Switch value changed to ${value}`);
	}
}
