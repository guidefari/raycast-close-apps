import { showHUD } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { closeNotWhitelisted } from "./scripts";

export default async function () {
  try {
    const res = await closeNotWhitelisted();
    // await showHUD(res);
  } catch (error) {
    showFailureToast(error, { title: "Could not run AppleScript" });
  }
}
