import { logger } from '/logger';
import { PickerAbstract } from './PickerAbstract';

export default class Picker extends PickerAbstract {
	public pickerValueChanged({ selectedValue }: Ti.UI.Picker_change_Event): void {
		this.state.text = `Picker value changed to ${selectedValue}`;
		logger.log(`Ti.UI.Picker changed value to: ${selectedValue}`);
	}
}
