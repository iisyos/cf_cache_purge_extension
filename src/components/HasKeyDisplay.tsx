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
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="access-key"
              className="text-white-600 text-center block"
            >
              access key
            </label>
            <input
              id="access-key"
              type="text"
              placeholder="access key"
              className="text-gray-600 text-center"
              value={credentials.accessKeyId || ""}
              onChange={(e) =>
                setCredentials({ ...credentials, accessKeyId: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="secret-key"
              className="text-white-600 text-center block"
            >
              secret key
            </label>
            <input
              id="secret-key"
              type="password"
              placeholder="secret key"
              className="text-gray-600 text-center"
              value={credentials.secretAccessKey || ""}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  secretAccessKey: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label
              htmlFor="distribution-id"
              className="text-white-600 text-center block"
            >
              distribution id
            </label>
            <input
              id="distribution-id"
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
          </div>
          <div>
            <button
              disabled={
                !canExecuteInvalidation({
                  ...credentials,
                  ...invalidationParams,
                })
              }
              className="bg-blue-500 text-white-600 px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSave}
            >
              update
            </button>
          </div>
        </div>
      </details>
    </>
  );
};
