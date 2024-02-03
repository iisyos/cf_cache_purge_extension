import { useState, useEffect } from "react";
import "./App.css";
import { getHashedDomain } from "./utils";
import { StorageHandler } from "./services/storage-handler";
import { AWSCredential } from "./types";

function App() {
  const [credential, setCredential] = useState<AWSCredential>();
  const [storageKey, setStorageKey] = useState<string>();
  const storageHandler = new StorageHandler();
  useEffect(() => {
    (async () => {
      const storageKey = await getHashedDomain();
      setStorageKey(storageKey);
    })();
  });

  if (!storageKey) return <div>loading...</div>;

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          placeholder="access key"
          className="text-gray-600 text-center"
          onChange={(e) =>
            setCredential({ ...credential, accessKey: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="secret key"
          className="text-gray-600 text-center"
          onChange={(e) =>
            setCredential({ ...credential, secretKey: e.target.value })
          }
        />
        <button
          onClick={async () =>
            credential &&
            (await storageHandler.setAccessKey({ storageKey, credential }))
          }
        >
          save
        </button>
        <button
          onClick={async () => {
            const credential = await storageHandler.getAccessKey(storageKey);
            console.log(credential);
          }}
        >
          retrieve
        </button>
      </header>
    </div>
  );
}

export default App;
