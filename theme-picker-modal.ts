import { App, FuzzySuggestModal, KeymapEventListener } from "obsidian";

export default class ThemePickerPluginModal extends FuzzySuggestModal<string> {
	DEFAULT_THEME_KEY = "";
	DEFAULT_THEME_TEXT = "None";

	initialTheme: string;
	previewing = false;

	constructor(app: App) {
		super(app);
		
		//@ts-ignore
		this.bgEl.setAttribute("style", "background-color: transparent");
		this.modalEl.classList.add("theme-picker-modal");

		//@ts-ignore
		const originalArrowUpEvent = this.scope.keys.find((key) => key.key === "ArrowUp");
		//@ts-ignore
		const originalArrowDownEvent = this.scope.keys.find((key) => key.key === "ArrowDown")

		const newFunction = function(originalFunc: KeymapEventListener, modal: ThemePickerPluginModal) {
			function newCallback(e: KeyboardEvent) {
				originalFunc(e, null);
				//@ts-ignore
				modal.setTheme(modal.chooser.values[modal.chooser.selectedItem].item);
				modal.previewing = true;
			}

			return newCallback;
		}

		originalArrowUpEvent.func = newFunction(originalArrowUpEvent.func, this);
		originalArrowDownEvent.func = newFunction(originalArrowDownEvent.func, this);
	}

	onOpen() {
		super.onOpen();
		
		//@ts-ignore
		this.initialTheme = this.getItems().find(theme => theme === app.customCss.theme)
		//@ts-ignore
		this.chooser.setSelectedItem(this.getItems().findIndex(theme => theme === app.customCss.theme));
		//@ts-ignore
		this.chooser.suggestions[this.chooser.selectedItem].scrollIntoViewIfNeeded();
	}

	onClose() {
		super.onClose();
		if (this.previewing) {
			this.setTheme(this.initialTheme);
		}
	}

	getItems(): any[] {
		//@ts-ignore
		return [this.DEFAULT_THEME_KEY, ...Object.keys(this.app.customCss.themes), ...this.app.customCss.oldThemes];
	}

	getItemText(item: any): string {
		if (item === this.DEFAULT_THEME_KEY) {
			return this.DEFAULT_THEME_TEXT;
		} else {
			return item;
		}
	}

	onChooseItem(item: any, evt: MouseEvent | KeyboardEvent): void {
		this.previewing = false;
		this.setTheme(item);
	}

	setTheme(themeName: string) {
		//@ts-ignore
		this.app.customCss.setTheme(themeName);
	}
}