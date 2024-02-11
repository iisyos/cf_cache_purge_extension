import { useState, useEffect } from "react";
import { getHashedDomain, canExecuteInvalidation } from "../utils";
import { StorageHandlerInterface } from "../interfaces/storage-handler-interface";
import { CloudfrontHandler } from "../services/cloudfront-handler";
import {
  AWSCredentials,
  InvalidationParams,
  ExecuteInvalidationParameter,
} from "../types";

export const HasKeyDisplay = ({
  executeInvalidationParameter,
  storageHandler,
  storageKey,
}: {
  executeInvalidationParameter: ExecuteInvalidationParameter;
  storageHandler: StorageHandlerInterface;
  storageKey: string;
}) => {
  const [credentials, setCredentials] = useState<Partial<AWSCredentials>>({
    accessKeyId: executeInvalidationParameter.accessKeyId,
    secretAccessKey: executeInvalidationParameter.secretAccessKey,
  });
  const [invalidationParams, setInvalidationParams] = useState<
    Partial<InvalidationParams>
  >({
    distributionId: executeInvalidationParameter.distributionId,
    paths: executeInvalidationParameter.paths,
  });

  const handleSave = async () => {
    const executeInvalidationParameter = {
      ...credentials,
      ...invalidationParams,
    };
    if (storageKey && canExecuteInvalidation(executeInvalidationParameter)) {
      await storageHandler.setExecuteInvalidationParameter({
        storageKey,
        executeInvalidationParameter,
      });
    }
  };

  return (
    <>
      <details>
        <summary>Parameters</summary>
        <input
          type="text"
          placeholder="access key"
          className="text-gray-600 text-center"
          value={credentials.accessKeyId || ""}
          onChange={(e) =>
            setCredentials({ ...credentials, accessKeyId: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="secret key"
          className="text-gray-600 text-center"
          value={credentials.secretAccessKey || ""}
          onChange={(e) =>
            setCredentials({ ...credentials, secretAccessKey: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="distribution id"
          className="text-gray-600 text-center"
          value={invalidationParams.distributionId || ""}
          onChange={(e) =>
            setInvalidationParams({
              ...invalidationParams,
              distributionId: e.target.value,
            })
          }
        />
        <div>
          <button
            disabled={
              !canExecuteInvalidation({
                ...credentials,
                ...invalidationParams,
              })
            }
            onClick={handleSave}
          >
            update
          </button>
        </div>
      </details>
    </>
  );
};
