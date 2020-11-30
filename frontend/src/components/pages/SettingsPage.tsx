import React, { useEffect, useMemo } from "react";
import classnames from "classnames";
import { useSelector } from "react-redux";
import PageTitle from "components/PageTitle";
import DefaultLayout from "components/layouts/DefaultLayout";
import { selectSettings, updateSettings } from "store/settings";
import useFormController from "hooks/useFormController";
import { Settings } from "types";
import store from "store";
import SettingsForm from "components/forms/SettingsForm";
import { Alert } from "react-bootstrap";

const SettingsPage = () => {
  const { settings, error: settingsStoreError } = useSelector(selectSettings);
  
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

      await store.dispatch(updateSettings(updatedSettings));
    }
  );

  return (
    <DefaultLayout>
      <PageTitle>Settings</PageTitle>
      <div className="container">
        {settingsStoreError && <Alert variant="danger">{settingsStoreError}</Alert>}
        {formError && <Alert variant="danger">{formError}</Alert>}
        <SettingsForm
          className={classnames(formPending && "is-pending")}
          defaultValues={settingsObject}
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;
