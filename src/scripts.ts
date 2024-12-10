import { runAppleScript } from "@raycast/utils";

export const closeAll = async () => {
	return await runAppleScript(`
		tell application "System Events"
			set open_apps to name of (every process whose background only is false)
			return open_apps
		end tell
	`);
};

// # const res = await runAppleScript(
// # 			`
// #     on run argv
// #     tell application "System Events"
// #         set appList to name of (processes where background only is false)
// #         repeat with appName in appList
// #             try
// #                 tell application appName to quit
// #             on error errMsg
// #                 tell application "System Events"
// #                     display notification "App " & appName & " refused to quit: " & errMsg
// #                 end tell
// #             end try
// #         end repeat
// #     end tell

// #     end run
// #     `,
// # 			["world"],
// # 		);
