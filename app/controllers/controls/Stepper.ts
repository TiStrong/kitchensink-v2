import { logger } from '/logger';
import { StepperAbstract } from './StepperAbstract';

export default class Stepper extends StepperAbstract {
	public stepperValueChanged({ value }: Ti.UI.iOS.Stepper_change_Event): void {
		this.state.text = `The stepper value changed to ${value}`;
		logger.log(`Ti.UI.Stepper value changed to ${value}`);
	}
}
