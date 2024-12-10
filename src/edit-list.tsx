import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { useForm, usePromise, useLocalStorage } from "@raycast/utils";
import { getOpenApps } from "./scripts";
// import { usePromise } from "@raycast/utils";

interface SignUpFormValues {
  selectedApps: string[];
}

export default function Command() {
  const {
    isLoading: isLoadingOpenApps,
    data: openApps,
    //  revalidate
  } = usePromise(getOpenApps, []);
  const {
    value: whitelistedApps,
    setValue: setWhitelistedApps,
    // isLoading: isLoadingWhitelistedApps,
  } = useLocalStorage<string[]>("whitelistedApps", []);

  console.log('whitelistedApps:', typeof whitelistedApps)
  console.log('whitelistedApps:', whitelistedApps)
  
  const { handleSubmit } = useForm<SignUpFormValues>({
    onSubmit(values) {
      setWhitelistedApps(values.selectedApps);

      showToast({
        style: Toast.Style.Success,
        title: "Whitelisted! These apps will not be closed when you run the main script:",
        message: `${values.selectedApps.map((app) => `${app} `)}`,
      });
    },
    validation: {
      //   firstName: FormValidation.,
      //   lastName: FormValidation.Required,
      //   password: (value) => {
      //     if (value && value.length < 8) {
      //       return "Password must be at least 8 symbols";
      //     } else if (!value) {
      //       return "The item is required";
      //     }
      //   },
      //   number: (value) => {
      //     if (value && value !== "2") {
      //       return "Please select '2'";
      //     }
      //   },
    },
  });
  return (
    <>
      <Form
        navigationTitle={isLoadingOpenApps ? "Getting Open Apps..." : "Whitelisted Apps"}
        isLoading={isLoadingOpenApps}
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        {/* <Form.TextField title="First Name" placeholder="Enter first name" {...itemProps.firstName} />
      <Form.TextField title="Last Name" placeholder="Enter last name" {...itemProps.lastName} />
      <Form.DatePicker title="Date of Birth" {...itemProps.birthday} />
      <Form.PasswordField
        title="Password"
        placeholder="Enter password at least 8 characters long"
        {...itemProps.password}
      /> */}
        {!isLoadingOpenApps && (
          <Form.TagPicker title="Whitelisted Apps" id="selectedApps" defaultValue={whitelistedApps}>
            {openApps?.map((app) => {
              return <Form.TagPicker.Item value={String(app)} title={String(app)} key={app} />;
            })}
          </Form.TagPicker>
        )}
        {/* <Form.FilePicker onChange={(value) => setSelectedFolder(`${value[0]}/`)} id="folders" allowMultipleSelection={false} canChooseDirectories canChooseFiles={false} /> */}
      </Form>
    </>
  );
}
