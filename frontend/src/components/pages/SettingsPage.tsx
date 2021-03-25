import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import { selectSettings, updateSettings } from "store/settings";
import useFormController from "hooks/useFormController";
import store from "store";
import SettingsForm from "components/forms/SettingsForm";
import { Alert } from "react-bootstrap";
import { useMessages } from "context/messages";
import Messages from "components/Messages";

const SettingsPage = () => {
  const { settings, error: settingsStoreError } = useSelector(selectSettings);
  const { setMessage } = useMessages();

  const settingsObject = useMemo(() => {
    return settings.reduce((settings, { name, value }) => {
      settings[name as keyof Settings] = value;
      return settings;
    }, {} as Settings);
  }, [settings]);

  const { formError, formPending, handleSubmit } = useFormController(
    async (values: Settings) => {
      const updatedSettings = settings.map((setting) => {
        const value = values[setting.name as keyof Settings];
        return value ? Object.assign({}, setting, { value }) : setting;
      });

      const action = await store.dispatch(updateSettings(updatedSettings));
      if (action.type === "settings/update/fulfilled") {
        setMessage("success", "Settings updated successfully.");
      }
    },
    { unmountsOnSubmit: false }
  );

  return (
    <DefaultLayout>
      <PageTitle>Settings</PageTitle>
      <Messages />
      <div className="container">
        {settingsStoreError && (
          <Alert variant="danger">{settingsStoreError}</Alert>
        )}
        {formError && <Alert variant="danger">{formError}</Alert>}
        <SettingsForm
          defaultValues={settingsObject}
          onSubmit={handleSubmit}
          pending={formPending}
        />
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;
