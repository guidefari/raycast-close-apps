import { showHUD } from "@raycast/api";
import { runAppleScript, showFailureToast } from "@raycast/utils";
import { closeAll } from "./scripts";

export default async function () {
	try {
		const res = await closeAll();
		await showHUD(res);
	} catch (error) {
		showFailureToast(error, { title: "Could not run AppleScript" });
	}
}
