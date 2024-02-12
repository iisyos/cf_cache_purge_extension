export type AWSCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

export type InvalidationParams = {
  distributionId: string;
  paths?: string[];
};

export type ExecuteInvalidationParameter = AWSCredentials & InvalidationParams;
