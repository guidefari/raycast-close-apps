import { Detail } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
// import { usePromise } from "@raycast/utils";


export default  function Command() {
	const { value: whitelistedApps, isLoading: isLoadingWhitelistedApps } = useLocalStorage<string[]>("whitelistedApps", []);

	const markdownString = `${whitelistedApps?.map((app) => `- ${app}`).join('\n')}` || 'No apps whitelisted, yet...'
	
  return (
    <Detail markdown={markdownString} isLoading={isLoadingWhitelistedApps} />
  );
}