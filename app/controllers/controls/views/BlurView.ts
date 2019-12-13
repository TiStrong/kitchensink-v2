import { BlurViewAbstract } from './BlurViewAbstract';

export default class BlurView extends BlurViewAbstract {
	public applyBlur(): void {
		this.blurView.effect = Ti.UI.iOS.BLUR_EFFECT_STYLE_LIGHT;
	}
}
