/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from "path";
import nconf from "nconf";
import { IDocumentManager } from "@fluidframework/server-services-core";
import { Lumberjack } from "@fluidframework/server-services-telemetry";
import { DocumentManager, TenantManager } from "../../services";

export class DocumentKeyRetriever {
	private loggingEnabled: boolean;
	private readonly documentManager: IDocumentManager;

	public constructor(
		private readonly redis: any,
		documentManager?: IDocumentManager,
		loggingEnabled: boolean = true,
	) {
		// If no document manager is passed to the constructor, a new one will be created
		if (documentManager) {
			this.documentManager = documentManager;
		} else {
			const config = nconf
				.argv()
				.env({ separator: "__", parseValues: true })
				.file(path.join(__dirname, "../../routerlicious/config/config.json"))
				.use("memory");

			const alfredEndpoint: string = config.get("worker:alfredUrl");
			const tenantManager = new TenantManager(
				config.get("auth:endpoint"),
				undefined /* internalHistorianUrl */,
			);
			this.documentManager = new DocumentManager(alfredEndpoint, tenantManager);
		}

		this.loggingEnabled = loggingEnabled;
	}

	public async getKeyCosmos<ValType>(
		keyName: string,
		tenantId: string,
		documentId: string,
		useCosmosCache: boolean = true,
	): Promise<ValType> {
		this.infoLog(
			`Retrieving value of ${keyName} from cosmosDB for tenant ${tenantId} and document ${documentId}.`,
		);

		// Retrieve the cached document details, if it exists for this document
		const cachedDetails: Record<string, any> | undefined = await this.getCachedDocumentDetails(
			documentId,
		);

		let val: ValType = cachedDetails?.[keyName];
		if (useCosmosCache && val) {
			// If the cached document details contain the key and useCosmosCache is true, use the cached value
			this.infoLog("Using cached cosmosDB document details.");
		} else {
			// Otherwise, call cosmosDB, and cache the result
			this.infoLog("Querying cosmosDB and caching the results.");
			const documentDetails: Record<string, any> = await this.documentManager.readDocument(
				tenantId,
				documentId,
			);
			await this.setCachedDocumentDetails(documentId, documentDetails);
			val = documentDetails?.[keyName];
		}

		return val;
	}

	public async getKeyRedis<ValType>(keyName: string): Promise<ValType> {
		this.infoLog(`Retrieving value of ${keyName} from redis`);
		const val: ValType = await this.redis.get(keyName);
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
			this.infoLog(`Found value for ${redisKeyName} in redis.`);
			return val;
		} else {
			// Otherwise, get the value from cosmos and cache the result in redis
			this.infoLog(
				`Could not find value for ${redisKeyName} in redis. Falling back to cosmosDB for keyname ${cosmosKeyName}.`,
			);

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
		// Check if redis has a cache of cosmosDB document details
		const documentDetailsKey: string = DocumentKeyRetriever.getDocumentDetailsKey(documentId);
		const documentDetails: any = await this.redis.get(documentDetailsKey);
		if (documentDetails) {
			return documentDetails as Record<string, any> | undefined;
		}
		return undefined;
	}

	public async setCachedDocumentDetails(
		documentId: string,
		documentDetails: Record<string, any>,
	): Promise<void> {
		// Set the redis cache for cosmosDB document details
		await this.redis.set(
			DocumentKeyRetriever.getDocumentDetailsKey(documentId),
			documentDetails,
		);
	}

	private static getDocumentDetailsKey(documentId: string): string {
		return `documentDetails:${documentId}`;
	}

	public enableLogging() {
		this.loggingEnabled = true;
	}

	public disableLogging() {
		this.loggingEnabled = false;
	}

	private infoLog(message: string) {
		if (this.loggingEnabled) {
			Lumberjack.info(message);
		}
	}
}
