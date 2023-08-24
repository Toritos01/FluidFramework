import { IDocumentManager } from "@fluidframework/server-services-core";
import { Lumberjack } from "@fluidframework/server-services-telemetry";

export class DocumentKeyRetriever {
	public constructor(
		private readonly redis: any,
		private readonly documentManager: IDocumentManager,
	) {}

	public async getKeyCosmos<ValType>(
		keyName: string,
		tenantId: string,
		documentId: string,
		useCosmosCache: boolean = true,
	): Promise<ValType> {
		// Try getting result from cache, if flag allows it
		const cachedDetails: Record<string, any> | undefined = await this.getCachedDocumentDetails(
			documentId,
		);
		let val: ValType = cachedDetails?.[keyName];
		if (useCosmosCache && val) {
			Lumberjack.info(
				`Using cached data from CosmosDB for tenant ${tenantId} and document ${documentId}.`,
			);
			return val;
		}

		// Otherwise, call cosmosDB, and cache the result
		Lumberjack.info("Cached details val: ", cachedDetails);
		Lumberjack.info(`Querying CosmosDB for tenant ${tenantId} and document ${documentId}.`);
		const documentDetails: Record<string, any> = await this.documentManager.readDocument(
			tenantId,
			documentId,
		);
		Lumberjack.info("Document details from cosmos: ", documentDetails);
		await this.setCachedDocumentDetails(documentId, documentDetails);

		val = documentDetails?.[keyName];
		Lumberjack.info(`Cosmos key ${keyName} had the value ${val}`);
		return val;
	}

	public async getKeyRedis<ValType>(keyName: string): Promise<ValType> {
		Lumberjack.info(`Keyname for redis query is ${keyName}`);
		const val: ValType = await this.redis.get(keyName);
		Lumberjack.info(`Getting key ${keyName} with value ${val}`);
		return val;
	}

	public async getKeyRedisFallback<ValType>(
		redisKeyName: string,
		cosmosKeyName: string,
		tenantId: string,
		documentId: string,
		useCosmosCache: boolean = true,
	): Promise<ValType> {
		let val: ValType = await this.getKeyRedis<ValType>(redisKeyName);
		if (val !== undefined && val !== null) {
			// Return the value if redis has it
			return val;
		} else {
			// Otherwise, get the value from cosmos and cache the result in redis
			val = await this.getKeyCosmos<ValType>(
				cosmosKeyName,
				tenantId,
				documentId,
				useCosmosCache,
			);
			await this.redis.set(redisKeyName, val);
			return val;
		}
	}

	public async getCachedDocumentDetails(
		documentId: string,
	): Promise<Record<string, any> | undefined> {
		const documentDetailsKey: string = DocumentKeyRetriever.getDocumentDetailsKey(documentId);
		const documentDetails: any = await this.redis.get(documentDetailsKey);
		Lumberjack.info(
			`Checking for cached doc details with redis key ${documentDetailsKey}, result is ${documentDetails}`,
		);
		if (documentDetails) {
			Lumberjack.info("Redis cache of doc details found.");
			return /* JSON.parse */ documentDetails as Record<string, any> | undefined;
		}
		return undefined;
	}

	public async setCachedDocumentDetails(
		documentId: string,
		documentDetails: Record<string, any>,
	): Promise<void> {
		await this.redis.set(
			DocumentKeyRetriever.getDocumentDetailsKey(documentId),
			/* JSON.stringify */ documentDetails,
		);
	}

	private static getDocumentDetailsKey(documentId: string): string {
		return `documentDetails:${documentId}`;
	}
}
