import { logger } from '/logger';
import { GradientsAbstract } from './GradientsAbstract';

enum GradientType {
	RADIAL = 0,
	LINEAR = 1,
}

const gradientTypes = ['radial', 'linear'];

export default class Gradients extends GradientsAbstract {
	normalizedCenterX: number;
	normalizedCenterY: number;
	colors: string[];
	selectedGradient: GradientType;

	constructor() {
		super();
		this.normalizedCenterX = 0.5;
		this.normalizedCenterY = 0.5;
		this.colors = ['red', 'blue'];

		this.selectedGradient = GradientType.RADIAL;
	}

	public updateGradient(): void {
		const size = this.gradientView.rect;
		if (!size || !size.width || !size.height) {
			return;
		}
		const minDimension = Math.min(size.width, size.height);
		const centerPoint = {
			x: size.width * this.normalizedCenterX,
			y: size.height * this.normalizedCenterY,
		};

		const startRadius = (minDimension / 2) * (this.startRadiusSlider.value / 100);
		const endRadius = (minDimension / 2) * (this.endRadiusSlider.value / 100);

		const gradient = {
			type: gradientTypes[this.selectedGradient],
		} as Gradient;

		// Linear gradients support colors with offsets and start-point / end-point
		// Radial gradients support raw colors, start-radius / end-radius and backfill-start / backfill-end
		// Read more: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.View-property-backgroundGradient
		if (this.selectedGradient === GradientType.LINEAR) {
			const startPoint = { x: Gradients.precisionRound(this.startRadiusSlider.value, -1) + '%', y: '50%' };
			const endPoint = { x: Gradients.precisionRound(this.endRadiusSlider.value, -1) + '%', y: '50%' };

			gradient.colors = [
				{ color: this.colors[0], offset: 0.0 },
				{ color: this.colors[1], offset: 1.0 },
			];
			gradient.startPoint = startPoint;
			gradient.endPoint = endPoint;

			logger.log(
				'Linear gradient updated: ' +
					JSON.stringify(centerPoint) +
					', start-point: ' +
					JSON.stringify(startPoint) +
					', end-point: ' +
					JSON.stringify(endPoint),
			);
		} else {
			gradient.startPoint = centerPoint;
			gradient.endPoint = centerPoint;
			gradient.startRadius = startRadius;
			gradient.endRadius = endRadius;
			gradient.backfillStart = this.startFillSwitch.value;
			gradient.backfillEnd = this.endFillSwitch.value;
			gradient.colors = this.colors;

			logger.log(
				'Radial gradient updated: ' +
					JSON.stringify(centerPoint) +
					', start-radius: ' +
					startRadius +
					', end-radius: ' +
					endRadius,
			);
		}

		this.gradientView.backgroundGradient = gradient;
	}

	public handleTouchMove(e: Ti.UI.View_touchmove_Event): void {
		const size = this.gradientView.rect;
		if (!size || !size.width || !size.height) {
			return;
		}

		this.normalizedCenterX = size.width > 0 ? e.x / size.width : 0.5;
		this.normalizedCenterY = size.height > 0 ? e.y / size.height : 0.5;

		this.updateGradient();
	}

	public pickRandomColor(): void {
		this.colors = [Gradients.generateRandomColor(), Gradients.generateRandomColor()];
		this.updateGradient();
	}

	// CREDITS: https://stackoverflow.com/a/1484514/5537752

	public static generateRandomColor(): string {
		const letters = '0123456789ABCDEF';
		let color = '#';

		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}

		return color;
	}

	public handleGradientType(e: Ti.UI.TabbedBar_click_Event & Ti.UI.Switch_click_Event): void {
		let isLinear;
		if (OS_IOS) {
			isLinear = e.index === GradientType.LINEAR;
			this.selectedGradient = e.index;
		} else if (this.gradientTypeSwitch && this.gradientTypeLabel) {
			if (this.gradientTypeSwitch.value) {
				isLinear = true;
				this.selectedGradient = GradientType.LINEAR;
				this.gradientTypeLabel.text = 'Linear';
			} else {
				isLinear = false;
				this.selectedGradient = GradientType.RADIAL;
				this.gradientTypeLabel.text = 'Radial';
			}
		}
		this.startFillSwitch.enabled = !isLinear;
		this.endFillSwitch.enabled = !isLinear;
		this.startRadiusLabel.text = isLinear ? 'Start Point:' : 'Start Radius:';
		this.endRadiusLabel.text = isLinear ? 'End Point' : 'End Radius';

		this.updateGradient();
	}

	public static precisionRound(number: number, precision: number): number {
		const factor = Math.pow(10, precision);
		return Math.round(number * factor) / factor;
	}
}
