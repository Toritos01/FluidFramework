import { IDocumentManager, IDocument } from "@fluidframework/server-services-core";

export class KeyRetriever {
	static cosmosCache: Map<[string, string], IDocument> = new Map<[string, string], IDocument>();

	public constructor(
		private readonly redis: any,
		private readonly documentManager: IDocumentManager | undefined,
	) {}

	public async getKeyCosmos<ValType>(
		keyName: string,
		tenantId: string,
		documentId: string,
		useCosmosCache: boolean = true,
	): Promise<ValType> {
		// Try getting result from cache, if flag allows it
		let cachedDetails: IDocument;
		let val: ValType;
		if (
			useCosmosCache &&
			(cachedDetails = this.getCachedDocumentDetails(tenantId, documentId)) !== undefined
		) {
			val = cachedDetails?.[keyName];
			return val;
		}

		// Otherwise, call cosmosDB, and cache the result
		const documentDetails: IDocument = await this.documentManager.readDocument(
			tenantId,
			documentId,
		);
		KeyRetriever.cosmosCache.set([tenantId, documentId], documentDetails);

		val = documentDetails?.[keyName];
		return val;
	}

	public async getKeyRedis<ValType>(keyName: string): Promise<ValType> {
		const val: ValType = this.redis.get(keyName);
		return val;
	}

	public async getKeyRedisFallback<ValType>(
		keyName: string,
		tenantId: string,
		documentId: string,
		useCosmosCache: boolean = true,
	): Promise<ValType> {
		let val: ValType;
		if ((val = await this.getKeyRedis<ValType>(keyName)) !== undefined) {
			// Return the value if redis has it
			return val;
		} else {
			// Otherwise, get the value from cosmos and cache the result in redis
			val = await this.getKeyCosmos<ValType>(keyName, tenantId, documentId, useCosmosCache);
			await this.redis.set(keyName, val);
			return val;
		}
	}

	public getCachedDocumentDetails(tenantId: string, documentId: string): IDocument {
		return KeyRetriever.cosmosCache.get([tenantId, documentId]);
	}
}
