import { checkCameraPermission } from '/permissions';
import { logger } from '/logger';
import { CameraGalleryAbstract } from './CameraGalleryAbstract';

export default class CameraGallery extends CameraGalleryAbstract {
	public openComponent(e: Ti.UI.ListView_itemclick_Event): void {
		const action = e.itemId;

		switch (action) {
			case 'showCameraPhoto':
				this.showCamera([Ti.Media.MEDIA_TYPE_PHOTO]);
				break;
			case 'showCameraVideo':
				this.showCamera([Ti.Media.MEDIA_TYPE_VIDEO]);
				break;
			case 'showCameraPhotoVideo':
				this.showCamera([Ti.Media.MEDIA_TYPE_PHOTO, Ti.Media.MEDIA_TYPE_VIDEO]);
				break;
			case 'saveToGallery':
				this.saveToGallery();
				break;
			case 'openFromGallery':
				this.openFromGallery();
				break;
			default:
				logger.log('Ti.Media', 'Unknown action selected: ' + action);
				break;
		}

		if (OS_IOS) {
			e.source.deselectItem(e.sectionIndex, e.itemIndex);
		}
	}

	public showCamera(mediaTypes: string[]): void {
		checkCameraPermission(success => {
			if (!success) {
				alert('No permissions!');
				return;
			}
			Ti.Media.showCamera({
				mediaTypes: mediaTypes,
				success: e => {
					if (e.media) {
						logger.log('Ti.Media', 'Image taken successfully!');
						this.processImage(e.media);
					}
				},
				error: ({ error }) => {
					logger.log('Ti.Media', 'Error showing camera: ' + error);
				},
				cancel: () => {
					logger.log('Ti.Media', 'Camera was cancelled');
				},
			});
		});
	}

	public processImage(image: Ti.Blob): void {
		const imageView = Ti.UI.createImageView({
			image: image,
			opacity: 0,
		});

		// WTF?
		// const label = Ti.UI.createLabel({
		// 	text: 'Tap to close',
		// });

		imageView.addEventListener('click', () => {
			imageView.animate(
				{
					opacity: 0,
				},
				() => {
					this.window.remove(imageView);
				},
			);
		});

		// WTF?
		// if (OS_IOS) {
		// 	imageView.add(label);
		// }
		this.window.add(imageView);

		imageView.animate({
			opacity: 1,
		});
	}

	public saveToGallery(): void {
		const view = Ti.UI.createView({
			backgroundColor: 'red',
			width: 400,
			height: 400,
			borderRadius: 200,
		});

		// Convert the view to an image-blog and save it to your Gallery
		Ti.Media.saveToPhotoGallery(view.toImage(), {
			success: () => {
				logger.log('Ti.Media', 'Image saved to photo-gallery successfully!');
			},
			error: ({ error }: { error: string }) => {
				logger.log('Ti.Media', 'Error saving image to photo-gallery: ' + error);
			},
		});
	}

	public openFromGallery(): void {
		checkCameraPermission(success => {
			if (!success) {
				alert('No permissions!');
				return;
			}

			Ti.Media.openPhotoGallery({
				success: e => {
					if (e.media) {
						logger.log('Ti.Media', 'Image open successfully!');
						this.processImage(e.media);
					}
				},
				error: ({ error }) => {
					logger.log('Ti.Media', 'Error opening image: ' + error);
				},
				cancel: () => {
					logger.log('Ti.Media', 'Opening photo-gallery was cancelled');
				},
			});
		});
	}
}
