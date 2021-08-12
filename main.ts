import { Plugin } from 'obsidian';
import ThemePickerPluginModal from 'theme-picker-modal';

export default class ThemePicker extends Plugin {
	async onload() {
		const themePickerStatusBarItem: HTMLElement = this.addStatusBarItem();
		themePickerStatusBarItem.setText("Change Theme");
		themePickerStatusBarItem.onClickEvent((event: MouseEvent) => {
			new ThemePickerPluginModal(this.app).open();
		});
		themePickerStatusBarItem.classList.add("mod-clickable");

		this.addCommand({
			id: 'open-theme-picker',
			name: 'Open Theme Picker',
			callback: () => new ThemePickerPluginModal(this.app).open()
		});
	}
}
