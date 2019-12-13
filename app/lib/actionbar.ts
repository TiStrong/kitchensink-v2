/*
 * ActionBar Helper Class for Appcelerator Titanium
 * Author: Ricardo Alcocer
 *
 * Licensed under the MIT License (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://alco.mit-license.org/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default class ActionBarHelper {
	public win: Ti.UI.Window;
	public activity: Ti.Android.Activity;
	public actionBar: Ti.Android.ActionBar;

	constructor(window: Ti.UI.Window) {
		if (Ti.Platform.osname !== 'android') {
			throw Error('Unsupported platform');
		}

		this.win = window;
		this.activity = this.win.activity;
		this.actionBar = this.activity.actionBar;
	}

	public setTitle(title: string): void {
		if (!this._isValidActivity()) {
			return;
		}

		this.actionBar.title = title;
	}

	public setUpAction(action: (...args: any[]) => void): void {
		if (!this._isValidActivity()) {
			return;
		}

		if (action) {
			this.actionBar.displayHomeAsUp = true;
			this.actionBar.onHomeIconItemSelected = action;
		} else {
			this.actionBar.displayHomeAsUp = false;
			this.actionBar.onHomeIconItemSelected = (): void => void 0;
		}
	}

	public setBackgroundImage(image: string): void {
		if (!this._isValidActivity()) {
			return;
		}

		this.actionBar.backgroundImage = image;
	}

	public setIcon(icon: string): void {
		if (!this._isValidActivity()) {
			return;
		}

		this.actionBar.icon = icon;
		this.actionBar.logo = icon;
	}

	public hide(): void {
		if (!this._isValidActivity()) {
			return;
		}

		this.actionBar.hide();
	}

	public show(): void {
		if (!this._isValidActivity()) {
			return;
		}

		this.actionBar.show();
	}

	public reloadMenu(): void {
		if (!this._isValidActivity()) {
			return;
		}

		this.activity.invalidateOptionsMenu();
	}

	private _isValidActivity(): boolean {
		if (!this.activity) {
			Ti.API.error('Unable to get activity. Did you open your window alread?');
			return false;
		}

		if (!this.actionBar) {
			Ti.API.error('No ActionBar available');
			return false;
		}

		return true;
	}
}
