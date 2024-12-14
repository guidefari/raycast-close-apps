import { List, Icon, Color } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";

export default function WhitelistView() {
	const { value: whitelistedApps, isLoading } = useLocalStorage<string[]>(
		"whitelistedApps",
		[],
	);

	return (
		<List
			isLoading={isLoading}
			searchBarPlaceholder="Search whitelisted apps..."
		>
			<List.Section
				title="Whitelisted Apps"
				subtitle={`${whitelistedApps?.length || 0} apps`}
			>
				{whitelistedApps?.map((app) => (
					<List.Item
						key={app}
						title={app}
						icon={{ fileIcon: `/Applications/${app}.app` }}
						accessories={[
							{
								icon: { source: Icon.Shield, tintColor: Color.Green },
								tooltip: "Whitelisted",
							},
						]}
					/>
				))}
			</List.Section>
		</List>
	);
}
