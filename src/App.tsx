import { useState } from "react";
import "./App.css";

function App() {
  const [content, setContent] = useState<string>("");
  const saveContent = () => {
    // chromeの拡張機能のストレージに保存する
    chrome.storage.sync.set({ key: content }, function () {
      console.log("Value is set to " + content);
    });
  };

  const retrieveContent = () => {
    // chromeの拡張機能のストレージから取得する
    chrome.storage.sync.get(["key"], function (result) {
      console.log("Value currently is " + result.key);
    });
  };
  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          className="text-center w-1/2 p-3 my-3 text-gray-600"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={() => saveContent()}>save</button>
        <button onClick={retrieveContent}>retrieve</button>
      </header>
    </div>
  );
}

export default App;
