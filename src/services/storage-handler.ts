import {
  AWSCredentials,
  InvalidationParams,
  ExecuteInvalidationParameter,
} from "../types";
import { StorageHandlerInterface } from "../interfaces/storage-handler-interface";

export class StorageHandler implements StorageHandlerInterface {
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
