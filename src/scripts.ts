import { LocalStorage } from "@raycast/api";
import { runAppleScript } from "@raycast/utils";

export const closeAll = async () => {
	return await runAppleScript(`
		tell application "System Events"
			set open_apps to name of (every process whose background only is false)
			return open_apps
		end tell
	`);
};

export const getAllApps = async (): Promise<string[]> => {
	const openApps = await runAppleScript(`
		tell application "System Events"
			set open_apps to name of (every process whose background only is false)
		end tell
		
		set appNames to {}
		tell application "Finder"
			set appList to (name of every application file in (path to applications folder) as alias list)
			repeat with appName in appList
				set end of appNames to appName
			end repeat
		end tell
		
		return open_apps & appNames
	`);

	const openAppsArray = openApps
		.split(",")
		.map((app) => app.replace(/\.app$/, "").trim());

	// Deduplicate the list
	const dedupedAppsArray: string[] = [];
	for (const app of openAppsArray) {
		if (!dedupedAppsArray.includes(app)) {
			dedupedAppsArray.push(app);
		}
	}

	return dedupedAppsArray;
};

export const closeNotWhitelisted = async () => {
	const whitelistedApps = await LocalStorage.getItem<string>("whitelistedApps");

	if (!whitelistedApps) {
		return;
	}

	// Parse the whitelisted apps and ensure Raycast is included
	const whitelistedAppsArray = JSON.parse(whitelistedApps.replace(/'/g, '"'));
	if (!whitelistedAppsArray.includes("Raycast")) {
		whitelistedAppsArray.push("Raycast");
	}

	const allowedApps = convertStringToAppleScriptFormat(
		JSON.stringify(whitelistedAppsArray),
	);
	console.log("allowedApps:", allowedApps);

	const script = `
	set allowedApps to ${allowedApps} -- Add the names of the apps you want to keep open here
	
	tell application "System Events"
	set activeApps to name of (every process whose background only is false and name is not "stable")
	end tell
	
	repeat with appName in activeApps
	if (allowedApps does not contain appName) and (appName is not "Finder") then
		try
			tell application appName
				quit
			end tell
		on error
			-- Handle the error or log it if necessary
		end try
	end if
	end repeat
	`;
	return await runAppleScript(script, { timeout: 30000 });
};

function convertStringToAppleScriptFormat(input: string): string {
	// Step 1: Parse the string to an array
	const array = JSON.parse(input.replace(/'/g, '"'));

	// Step 2: Trim spaces and format each element
	const formattedArray = array.map((app: string) => `"${app.trim()}"`);

	// Step 3: Join the elements into the desired format
	return `{${formattedArray.join(", ")}}`;
}
