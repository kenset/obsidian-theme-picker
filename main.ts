import { Plugin } from 'obsidian';
import ThemePickerPluginModal from 'theme-picker-modal';

export default class ThemePicker extends Plugin {
	DARK_MODE_THEME_KEY = "obsidian";
	LIGHT_MODE_THEME_KEY = "moonstone";

	colorSchemeIcon: SVGSVGElement;
	moonIconSvg = `<path fill="none" d="M0 0h24v24H0z"/><path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"/>`;
	sunIconSvg = `<path fill="none" d="M0 0h24v24H0z"/><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>`;

	async onload() {
		this.colorSchemeIcon = this.initializeColorSchemeIcon();
		const themePickerStatusBarItem: HTMLElement = this.addStatusBarItem();

		const changeThemeButton: HTMLElement = themePickerStatusBarItem.createDiv({
			cls: "status-bar-item mod-clickable",
			text: "Change Theme"
		});
		changeThemeButton.addEventListener("click", () => {
			new ThemePickerPluginModal(this.app).open();
		});

		const changeColorSchemeButton: HTMLElement = themePickerStatusBarItem.createDiv({
			cls: "status-bar-item mod-clickable theme-picker-color-scheme-icon",
		});
		changeColorSchemeButton.addEventListener("click", () => this.toggleColorScheme());
		changeColorSchemeButton.appendChild(this.colorSchemeIcon);

		this.addCommand({
			id: 'open-theme-picker',
			name: 'Open Theme Picker',
			callback: () => new ThemePickerPluginModal(this.app).open()
		});

		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				this.colorSchemeIcon.innerHTML = this.getColorSchemeIcon();
			})
		);
	}

	initializeColorSchemeIcon(): SVGSVGElement {
		const colorSchemeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		colorSchemeIcon.setAttribute("viewBox", "0 0 22 22");
		colorSchemeIcon.setAttribute("width", "14");
		colorSchemeIcon.setAttribute("height", "14");
		colorSchemeIcon.innerHTML = this.getColorSchemeIcon();

		return colorSchemeIcon;
	}

	getColorSchemeIcon() {
		return this.isDarkMode() ? this.sunIconSvg : this.moonIconSvg;
	}

	toggleColorScheme(): void {
		let colorSchemeKey;
		if (this.isDarkMode()) {
			colorSchemeKey = this.LIGHT_MODE_THEME_KEY;
			this.colorSchemeIcon.innerHTML = this.moonIconSvg;
		} else {
			colorSchemeKey = this.DARK_MODE_THEME_KEY;
			this.colorSchemeIcon.innerHTML = this.sunIconSvg;
		}

		//@ts-ignore
		this.app.changeTheme(colorSchemeKey);
	}

	isDarkMode(): boolean {
		//@ts-ignore
		return this.app.vault.getConfig("theme") === this.DARK_MODE_THEME_KEY;
	}
}
