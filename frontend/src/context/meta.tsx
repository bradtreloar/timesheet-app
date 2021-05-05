import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Meta {
  version: string;
};

const isNewerVersion = (latestVersion: string, currentVersion: string) => {
  const versionsA = latestVersion.split(/\./g);
  const versionsB = currentVersion.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());
    const b = Number(versionsB.shift());
    if (a !== b) {
      return a > b || isNaN(b);
    }
  }
  return false;
};

interface MetaContextState {
  isLoadingMeta: boolean;
  hasNewVersion: boolean;
  currentVersion: string | null;
}

const MetaContext = createContext<MetaContextState | undefined>(undefined);

/**
 * Custom hook. Returns the neta context. Only works inside components wrapped
 * by MetaProvider.
 */
export const useMeta = () => {
  const netaContext = useContext(MetaContext);
  if (netaContext === undefined) {
    throw new Error("MetaContext is undefined");
  }
  return netaContext;
};

const MetaProvider: React.FC = ({ children }) => {
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [currentVersion] = useState(localStorage.getItem("version"));
  
  useEffect(() => {
    (async () => {
      const response = await axios.get("/meta.json");
      const meta = (await response.data) as Meta;
      const latestVersion = meta.version;

      if (currentVersion !== null) {
        setHasNewVersion(isNewerVersion(latestVersion, currentVersion));
      } else {
        setHasNewVersion(false);
      }
      localStorage.setItem("version", latestVersion);
      setIsLoadingMeta(false);
    })();
  }, []);

  const value = {
    isLoadingMeta,
    hasNewVersion,
    currentVersion,
  };

  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>;
};

export { MetaProvider };
