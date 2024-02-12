import { ExecuteInvalidationParameter } from "../types";

export interface StorageHandlerInterface {
  getExecuteInvalidationParameter(
    storageKey: string
  ): Promise<ExecuteInvalidationParameter | null>;
  setExecuteInvalidationParameter({
    storageKey,
    executeInvalidationParameter,
  }: {
    storageKey: string;
    executeInvalidationParameter: ExecuteInvalidationParameter;
  }): Promise<void>;
}
