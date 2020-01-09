import { logger } from 'logger';
import { MapAbstract } from './MapAbstract';
import TiMap from 'ti.map';

export default class Map extends MapAbstract {
	constructor() {
		super();

		/* Right now Alloy doesn't add circles/polylines/polygons to map properly when they're created in Alloy
		 * See https://jira.appcelerator.org/browse/ALOY-1608 for more info
		 * For now, either create them in the controller or add them manually
		 */
		this.mapview.addCircle(this.mapCircle);
		this.mapview.addPolylines([this.mapLineOne, this.mapLineTwo, this.mapLineThree]);
		this.mapview.addPolygon(this.mapPolygon);
	}
	handleMapClick(e: TiMap.View_click_Event) {
		let clickedAnnotation = null;

		// check if annotation was clicked
		if (e.hasOwnProperty('annotation')) {
			// check if the annotation was selected or deselected based on previous state
			if (e.annotation.id === clickedAnnotation) {
				logger.log('annotation deselected', e.annotation);
				clickedAnnotation = null;
			} else {
				logger.log('annotation selected', e.annotation);
				clickedAnnotation = e.annotation.id;
			}
		} else if (e.clicksource === 'circle') {
			logger.log('circle clicked', e.latitude, e.longitude);
		}
	}
}
