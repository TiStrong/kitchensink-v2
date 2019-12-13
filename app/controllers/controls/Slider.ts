import { logger } from '/logger';
import { SliderAbstract } from './SliderAbstract';

export default class Slider extends SliderAbstract {
	public sliderValueChanged({ source, value }: Ti.UI.Slider_change_Event): void {
		this.state.text = `Current value: ${value.toFixed(2)} / ${source.max}`;
		logger.log(`Ti.UI.Slider value changed to ${value}`);
	}
}
