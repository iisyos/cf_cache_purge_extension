import {
  AWSCredentials,
  InvalidationParams,
  ExecuteInvalidationParameter,
} from "../types";

export class StorageHandler {
  async getExecuteInvalidationParameter(
    storageKey: string
  ): Promise<ExecuteInvalidationParameter | null> {
    return new Promise((resolve) => {
      chrome.storage.sync.get([storageKey], (result) => {
        resolve(result[storageKey] as ExecuteInvalidationParameter);
      });
    });
  }

  async setExecuteInvalidationParameter({
    storageKey,
    executeInvalidationParameter,
  }: {
    storageKey: string;
    executeInvalidationParameter: ExecuteInvalidationParameter;
  }): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(
        { [storageKey]: executeInvalidationParameter },
        () => {
          resolve();
        }
      );
    });
  }
}
