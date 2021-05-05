import React, { useEffect, useState } from "react";
import axios from "axios";
import packageJson from "../../package.json";

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

interface Meta {
  version: string;
};

const useMeta = () => {
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

  return {
    isLoadingMeta,
    hasNewVersion,
    version: currentVersion,
  };
};

export default useMeta;
