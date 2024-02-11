import { useState, useEffect } from "react";
import "./App.css";
import { getHashedDomain, canExecuteInvalidation } from "./utils";
import { StorageHandler } from "./services/storage-handler";
import { CloudfrontHandler } from "./services/cloudfront-handler";
import {
  AWSCredentials,
  InvalidationParams,
  ExecuteInvalidationParameter,
} from "./types";
import { HasKeyDisplay } from "./components/HasKeyDisplay";

function App() {
  const [credentials, setCredentials] = useState<Partial<AWSCredentials>>({});
  const [invalidationParams, setInvalidationParams] = useState<
    Partial<InvalidationParams>
  >({});
  const [storageKey, setStorageKey] = useState<string>();
  const [executeInvalidationParameter, setExecuteInvalidationParameter] =
    useState<ExecuteInvalidationParameter>();

  const storageHandler = new StorageHandler();

  useEffect(() => {
    (async () => {
      const storageKey = await getHashedDomain();
      setStorageKey(storageKey);

      const executeInvalidationParameter =
        await storageHandler.getExecuteInvalidationParameter(storageKey);
      if (executeInvalidationParameter) {
        setExecuteInvalidationParameter(executeInvalidationParameter);
        const { accessKeyId, secretAccessKey } = executeInvalidationParameter;
        const { distributionId, paths } = executeInvalidationParameter;
        const cloudfrontHandler = new CloudfrontHandler({
          accessKeyId,
          secretAccessKey,
        });
        // await cloudfrontHandler.createInvalidation({ distributionId, paths });
      }
    })();
  });

  if (!storageKey) return <div>loading...</div>;

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
    <div className="App">
      <header className="App-header">
        {!!executeInvalidationParameter ? (
          <>
            <h2>This domain is already configured</h2>
            <HasKeyDisplay
              executeInvalidationParameter={executeInvalidationParameter}
              storageHandler={storageHandler}
              storageKey={storageKey}
            />
          </>
        ) : (
          <>
            <h2>Configure this domain</h2>
            <input
              type="text"
              placeholder="access key"
              className="text-gray-600 text-center"
              onChange={(e) =>
                setCredentials({ ...credentials, accessKeyId: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="secret key"
              className="text-gray-600 text-center"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  secretAccessKey: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="distribution id"
              className="text-gray-600 text-center"
              onChange={(e) =>
                setInvalidationParams({
                  ...invalidationParams,
                  distributionId: e.target.value,
                })
              }
            />
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
              save
            </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
