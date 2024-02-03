import { AWSCredential } from "../types";

export class StorageHandler {
  async getAccessKey(storageKey: string): Promise<AWSCredential> {
    return new Promise((resolve) => {
      chrome.storage.local.get([storageKey], (result) => {
        resolve(result[storageKey]);
      });
    });
  }

  async setAccessKey({
    storageKey,
    credential,
  }: {
    storageKey: string;
    credential: AWSCredential;
  }): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [storageKey]: credential }, () => {
        resolve();
      });
    });
  }
}
