import { CloudfrontHandler } from "../services/cloudfront-handler";
import { getHashedDomain } from "../utils";
import { StorageHandler } from "../services/storage-handler";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "waitPurgeComplete") {
    const { credentials, distributionId, invalidationId } = request;
    const cloudfrontHandler = new CloudfrontHandler(credentials);
    await checkPurgeComplete(cloudfrontHandler, distributionId, invalidationId);
  }
});

chrome.commands.onCommand.addListener(async function (command) {
  if (command === "hyper_reload") {
    const storageHandler = new StorageHandler();
    const storageKey = await getHashedDomain();
    const executeInvalidationParameter =
      await storageHandler.getExecuteInvalidationParameter(storageKey);
    if (executeInvalidationParameter) {
      const { accessKeyId, secretAccessKey, region, distributionId, paths } =
        executeInvalidationParameter;
      const cloudfrontHandler = new CloudfrontHandler({
        accessKeyId,
        secretAccessKey,
        region,
      });
      const invalidationId = await cloudfrontHandler.createInvalidation({
        distributionId,
        paths,
      });
      await checkPurgeComplete(
        cloudfrontHandler,
        distributionId,
        invalidationId!
      );
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icon48.png"),
        title: "No purge target",
        message: "There is no purge target. Please register this site first",
        priority: 2,
      });
    }
  }
});

const checkPurgeComplete = async (
  cloudfrontHandler: CloudfrontHandler,
  distributionId: string,
  invalidationId: string
) => {
  const isCompleted = await cloudfrontHandler.checkInvalidationConditions({
    distributionId,
    invalidationId,
  });
  if (isCompleted) {
    // キャッシュ削除が完了したら通知
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icon48.png"),
      title: "Purge completed",
      message: `Purge for distribution ${distributionId} has been completed.`,
      priority: 2,
    });
  } else {
    // 5秒後に再度確認
    setTimeout(async () => {
      await checkPurgeComplete(
        cloudfrontHandler,
        distributionId,
        invalidationId
      );
    }, 5000);
  }
};
