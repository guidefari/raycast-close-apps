import {
	Action,
	ActionPanel,
	List,
	showToast,
	Toast,
	Icon,
	Color,
} from "@raycast/api";
import { getOpenApps, closeNotWhitelisted } from "./scripts";
import type { Application } from "./types";
import { useLocalStorage, usePromise } from "@raycast/utils";

// type ListState = "whitelisted" | "open" | "all";

export default function AppList() {
	const { value: whitelistedApps, setValue: setWhitelistedApps } =
		useLocalStorage<string[]>("whitelistedApps", []);

	const {
		data: openApps,
		isLoading: openAppsLoading,
		revalidate,
	} = usePromise(
		async (whitelistedApps: string[] | undefined) => {
			const apps = await getOpenApps();
			if (!whitelistedApps) {
				return apps.map((app) => ({
					name: app,
					isWhitelisted: false,
				}));
			}

			return apps.map((app) => ({
				name: app,
				isWhitelisted: whitelistedApps?.includes(app) || app === "Raycast",
			}));
		},
		[whitelistedApps],
	);

	const toggleWhitelist = (application: Application) => {
		const newWhitelist = application.isWhitelisted
			? whitelistedApps?.filter((app) => app !== application.name) || []
			: [...(whitelistedApps || []), application.name];

		setWhitelistedApps(newWhitelist);
		revalidate();

		showToast({
			style: Toast.Style.Success,
			title: `${application.name} ${application.isWhitelisted ? "removed from" : "added to"} whitelist`,
		});
	};

	const closeAllNonWhitelisted = async () => {
		try {
			await closeNotWhitelisted();
			showToast({
				style: Toast.Style.Success,
				title: "Closed all non-whitelisted apps",
			});
			revalidate();
		} catch (error) {
			showToast({
				style: Toast.Style.Failure,
				title: "Failed to close apps",
				message: String(error),
			});
		}
	};

	return (
		<List isLoading={openAppsLoading} searchBarPlaceholder="Filter apps...">
			<List.Section title="Running Apps" subtitle={`${openApps?.length} apps`}>
				{openApps?.map((app) => (
					<List.Item
						key={app.name}
						title={app.name}
						icon={{ fileIcon: `/Applications/${app.name}.app` }}
						accessories={[
							{
								icon: app.isWhitelisted
									? { source: Icon.Check, tintColor: Color.Green }
									: { source: Icon.Xmark, tintColor: Color.SecondaryText },
								tooltip: app.isWhitelisted ? "Whitelisted" : "Not whitelisted",
							},
						]}
						actions={
							<ActionPanel>
								<Action
									title={
										app.isWhitelisted
											? "Remove from Whitelist"
											: "Add to Whitelist"
									}
									icon={app.isWhitelisted ? Icon.Shield : Icon.Shield}
									onAction={() => toggleWhitelist(app)}
								/>
								<Action
									title="Close Non-whitelisted Apps"
									icon={Icon.XMarkCircle}
									onAction={closeAllNonWhitelisted}
								/>
								<Action
									title="Refresh"
									icon={Icon.ArrowClockwise}
									onAction={revalidate}
									shortcut={{ modifiers: ["cmd"], key: "r" }}
								/>
							</ActionPanel>
						}
					/>
				))}
			</List.Section>
		</List>
	);
}
