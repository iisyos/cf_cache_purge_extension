import { CloudfrontHandler } from "../services/cloudfront-handler";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "waitPurgeComplete") {
    const { credentials, distributionId, invalidationId } = request;
    const cloudfrontHandler = new CloudfrontHandler(credentials);
    const checkPurgeComplete = async () => {
      const isCompleted = await cloudfrontHandler.checkInvalidationConditions({
        distributionId,
        invalidationId,
      });

      if (isCompleted) {
        // キャッシュ削除が完了したら通知
        chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.runtime.getURL("icon.jpg"),
          title: "Purge completed",
          message: `Purge for distribution ${distributionId} has been completed.`,
          priority: 2,
        });
      } else {
        // 5秒後に再度確認
        setTimeout(checkPurgeComplete, 5000);
      }
    };

    checkPurgeComplete();
  }
});
