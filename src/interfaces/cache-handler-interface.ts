export interface CacheHandlerInterface {
  createInvalidation(params: unknown): Promise<void>;
}
