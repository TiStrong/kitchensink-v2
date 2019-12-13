import { logger } from '/logger';
import { AccelerometerAbstract } from './AccelerometerAbstract';

export default class Accelerometer extends AccelerometerAbstract {
	constructor() {
		super();
		const accelerometerCallback = (e: Ti.Accelerometer_update_Event): void => {
			const { x, y, z } = e;
			this.accel_x.text = `x: ${x.toFixed(3)}`;
			this.accel_y.text = `y: ${y.toFixed(3)}`;
			this.accel_z.text = `z: ${z.toFixed(3)}`;
		};

		if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1) {
			alert('Accelerometer does not work on a virtual device');
			return;
		}

		Ti.Accelerometer.addEventListener('update', accelerometerCallback);

		if (OS_ANDROID) {
			this.Accelerometer.addEventListener('open', () => {
				this.Accelerometer.activity.addEventListener('pause', () => {
					logger.log('Ti.Accelerometer', 'removing accelerometer callback on pause');
					Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
				});
				this.Accelerometer.activity.addEventListener('resume', () => {
					logger.log('Ti.Accelerometer', 'adding accelerometer callback on resume');
					Ti.Accelerometer.addEventListener('update', accelerometerCallback);
				});
			});
		}
	}
}
