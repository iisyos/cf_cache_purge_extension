import { AWSCredentials, ExecuteInvalidationParameter } from "./types";

export const getHashedDomain = async () => {
  const promise = new Promise((resolve: (value: string) => void) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      let url = activeTab.url;
      if (!url) throw new Error("No URL found in active tab.");
      const domain = new URL(url).hostname;
      const hash = domain
        .split("")
        .reduce((acc, char) => acc + `${char.charCodeAt(0)}`, "");
      resolve(hash);
    });
  });
  return await promise;
};

export const canExecuteInvalidation = (
  executeInvalidationParameter: Partial<ExecuteInvalidationParameter>
): executeInvalidationParameter is ExecuteInvalidationParameter => {
  return (
    !!executeInvalidationParameter.accessKeyId &&
    !!executeInvalidationParameter.secretAccessKey &&
    !!executeInvalidationParameter.secretAccessKey
  );
};
