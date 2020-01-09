import { logger } from 'logger';
import Map from 'ti.map';
import { GeolocationAbstract } from 'controllers/phone/GeolocationAbstract';

export default class Geolocation extends GeolocationAbstract {
	constructor() {
		super();
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
		Ti.Geolocation.distanceFilter = 10;

		// Check for Google Play Services. In order to view maps, Google Play services needs to be installed on the device
		if (OS_ANDROID) {
			Ti.Geolocation.preferredProvider = Ti.Geolocation.Android.PROVIDER_GPS;
			const rc = Map.isGooglePlayServicesAvailable();
			switch (rc) {
				case Map.SUCCESS:
					Ti.API.info('Google Play services is installed.');
					break;
				case Map.SERVICE_MISSING:
					alert(
						'Google Play services is missing. Please install Google Play services from the Google Play store.',
					);
					break;
				case Map.SERVICE_VERSION_UPDATE_REQUIRED:
					alert('Google Play services is out of date. Please update Google Play services.');
					break;
				case Map.SERVICE_DISABLED:
					alert('Google Play services is disabled. Please enable Google Play services.');
					break;
				case Map.SERVICE_INVALID:
					alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
					break;
				default:
					alert('Unknown error.');
			}
		}

		// Checks for location service available
		if (Ti.Geolocation.locationServicesEnabled) {
			Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, event => {
				console.log(event);
				if (!event.success) {
					alert(`Error granting location permissions: ${event.error}`);
					return;
				}

				this.getCurrentPosition();
			});

			Ti.Geolocation.addEventListener('location', this.updatePosition.bind(this));
		} else {
			Ti.API.error('Your device has GPS turned off. Please turn it on.');
		}
	}
	updatePosition(e: Ti.Geolocation_location_Event) {
		if (!e.success || e.error) {
			Ti.API.debug(JSON.stringify(e));
			Ti.API.debug(e.toString());
			return;
		}

		const geoPackage = JSON.stringify(e),
			latitude = e.coords.latitude,
			longitude = e.coords.longitude;

		this.geoloc.value = geoPackage;
		this.geo_lat.text = 'Latitude: ' + latitude;
		this.geo_long.text = 'Longitude: ' + longitude;

		logger.log('Ti.Geolocation', 'location: ' + geoPackage);
	}
	getCurrentPosition() {
		Ti.Geolocation.getCurrentPosition((e: LocationResults) => {
			if (!e.success || e.error) {
				Ti.API.debug(JSON.stringify(e));
				Ti.API.debug(e.toString());
				alert('Error getting current position');
				return;
			}
			const latitude = e.coords && e.coords.latitude,
				longitude = e.coords && e.coords.longitude;

			const mapView = Map.createView({
				userLocation: true,
				mapType: Map.NORMAL_TYPE,
				// animate: true, /* incompatible member override, see ti.map/index.d.ts */
				region: {
					latitude: latitude,
					longitude: longitude,
					latitudeDelta: 0.1,
					longitudeDelta: 0.1,
				},
				// regionFit: true /* does not exists in Map.View */
			});

			this.map.add(mapView);

			// Handle click events on any annotations on this map.
			mapView.addEventListener('click', e => {
				Ti.API.info('Clicked ' + e.clicksource + ' on ' + e.latitude + ',' + e.longitude);
			});
		});
	}
}

