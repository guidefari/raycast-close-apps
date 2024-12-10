import { showHUD } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import fs from "node:fs";
import path from "node:path";

export default async function () {
	try {
		const filePath = await showInput({
			title: "Enter the file path to save the list",
			placeholder: "e.g., /path/to/your/file.txt",
		});

		if (!filePath) return;

		const textList = await showInput({
			title: "Edit your text list",
			placeholder: "Enter items separated by commas",
		});

		if (textList) {
			fs.writeFileSync(
				filePath,
				textList
					.split(",")
					.map((item) => item.trim())
					.join("\n"),
			);
			await showHUD("Text list saved successfully!");
		}
	} catch (error) {
		showFailureToast(error, { title: "Could not save the text list" });
	}
}
