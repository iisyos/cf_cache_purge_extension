import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { AWSCredentials, InvalidationParams } from "../types";
import { CacheHandlerInterface } from "../interfaces/cache-handler-interface";

export class CloudfrontHandler implements CacheHandlerInterface {
  credentials: AWSCredentials;
  constructor(credentials: AWSCredentials) {
    this.credentials = credentials;
  }

  async createInvalidation({
    distributionId,
    paths = ["/*"],
  }: {
    distributionId: string;
    paths: string[] | undefined;
  }): Promise<void> {
    const credentials = this.credentials;

    const client = new CloudFrontClient({
      credentials,
      region: credentials.region,
    });

    const command = new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
      },
    });

    await client.send(command);
  }
}
