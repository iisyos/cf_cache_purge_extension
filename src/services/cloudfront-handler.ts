import {
  CloudFrontClient,
  CreateInvalidationCommand,
  GetInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import { AWSCredentials, InvalidationParams } from "../types";
import { CacheHandlerInterface } from "../interfaces/cache-handler-interface";

export class CloudfrontHandler implements CacheHandlerInterface {
  credentials: AWSCredentials;
  client: CloudFrontClient;
  constructor(credentials: AWSCredentials) {
    this.credentials = credentials;
    this.client = new CloudFrontClient({
      credentials,
      region: credentials.region,
    });
  }

  async createInvalidation({
    distributionId,
    paths = ["/*"],
  }: {
    distributionId: string;
    paths: string[] | undefined;
  }): Promise<string | undefined> {
    const credentials = this.credentials;

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

    const result = await this.client.send(command);
    return result.Invalidation?.Id;
  }

  async checkInvalidationConditions({
    distributionId,
    invalidationId,
  }: {
    distributionId: string;
    invalidationId: string | undefined;
  }): Promise<boolean> {
    const command = new GetInvalidationCommand({
      DistributionId: distributionId,
      Id: invalidationId,
    });

    const result = await this.client.send(command);
    return result.Invalidation?.Status === "Completed";
  }
}
