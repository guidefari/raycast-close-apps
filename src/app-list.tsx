import {
  Action,
  ActionPanel,
  List,
  showToast,
  Toast,
//   useLocalStorage,
  Icon,
  Color,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { getOpenApps, closeNotWhitelisted } from "./scripts";
import { Process } from "./types";
import { useLocalStorage } from "@raycast/utils";

export default function AppList() {
  const [openApps, setOpenApps] = useState<Process[]>([]);
  const { value: whitelistedApps, setValue: setWhitelistedApps } = useLocalStorage<string[]>("whitelistedApps", []);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = async () => {
    const apps = await getOpenApps();
    const processes = apps.map(app => ({
      name: app,
      isWhitelisted: whitelistedApps?.includes(app) || app === "Raycast",
    }));
    setOpenApps(processes);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const toggleWhitelist = (process: Process) => {
    const newWhitelist = process.isWhitelisted
      ? whitelistedApps?.filter(app => app !== process.name) || []
      : [...(whitelistedApps || []), process.name];
    
    setWhitelistedApps(newWhitelist);
    setOpenApps(openApps.map(app => ({
      ...app,
      isWhitelisted: newWhitelist.includes(app.name) || app.name === "Raycast"
    })));

    showToast({
      style: Toast.Style.Success,
      title: `${process.name} ${process.isWhitelisted ? "removed from" : "added to"} whitelist`,
    });
  };

  const closeAllNonWhitelisted = async () => {
    try {
      await closeNotWhitelisted();
      showToast({
        style: Toast.Style.Success,
        title: "Closed all non-whitelisted apps",
      });
      fetchApps();
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to close apps",
        message: String(error),
      });
    }
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Filter apps..."
      actions={
        <ActionPanel>
          <Action
            title="Close Non-whitelisted Apps"
            icon={Icon.XMarkCircle}
            onAction={closeAllNonWhitelisted}
          />
          <Action
            title="Refresh"
            icon={Icon.ArrowClockwise}
            onAction={fetchApps}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
          />
        </ActionPanel>
      }
    >
      <List.Section title="Running Apps" subtitle={`${openApps.length} apps`}>
        {openApps.map((process) => (
          <List.Item
            key={process.name}
            title={process.name}
            icon={{ fileIcon: `/Applications/${process.name}.app` }}
            accessories={[
              {
                icon: process.isWhitelisted 
                  ? { source: Icon.Shield, tintColor: Color.Green }
                  : { source: Icon.Shield, tintColor: Color.SecondaryText },
                tooltip: process.isWhitelisted ? "Whitelisted" : "Not whitelisted"
              }
            ]}
            actions={
              <ActionPanel>
                <Action
                  title={process.isWhitelisted ? "Remove from Whitelist" : "Add to Whitelist"}
                  icon={process.isWhitelisted ? Icon.Shield : Icon.Shield}
                  onAction={() => toggleWhitelist(process)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
} 