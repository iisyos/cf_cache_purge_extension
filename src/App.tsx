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
  const [credentials, setCredentials] = useState<Partial<AWSCredentials>>({
    region: "ap-northeast-1",
  });
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
      if (executeInvalidationParameter)
        setExecuteInvalidationParameter(executeInvalidationParameter);
    })();
  });

  if (!storageKey) return <div>loading...</div>;

  const purgeCache = async () => {
    if (executeInvalidationParameter) {
      const { accessKeyId, secretAccessKey, region, distributionId, paths } =
        executeInvalidationParameter;
      const cloudfrontHandler = new CloudfrontHandler({
        accessKeyId,
        secretAccessKey,
        region,
      });
      await cloudfrontHandler.createInvalidation({ distributionId, paths });
    }
  };

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
      setExecuteInvalidationParameter(executeInvalidationParameter);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!!executeInvalidationParameter ? (
          <>
            <h2>This domain is already configured</h2>
            <button
              className="bg-red-500 text-white-600 px-2 py-2 rounded hover:bg-red-700"
              onClick={purgeCache}
            >
              purge cache
            </button>
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
              className="text-gray-600 text-left pl-2"
              onChange={(e) =>
                setCredentials({ ...credentials, accessKeyId: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="secret key"
              className="text-gray-600 text-left pl-2"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  secretAccessKey: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="ap-northeast-1"
              className="text-gray-600 text-left pl-2"
              value="ap-northeast-1"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  region: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="distribution id"
              className="text-gray-600 text-left pl-2"
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
              className="bg-blue-500 text-white-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
