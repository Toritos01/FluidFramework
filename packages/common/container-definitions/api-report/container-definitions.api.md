## API Report File for "@fluidframework/container-definitions"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { EventEmitter } from 'events';
import { FluidObject } from '@fluidframework/core-interfaces';
import { IAnyDriverError } from '@fluidframework/driver-definitions';
import { IClient } from '@fluidframework/protocol-definitions';
import { IClientConfiguration } from '@fluidframework/protocol-definitions';
import { IClientDetails } from '@fluidframework/protocol-definitions';
import { IDisposable } from '@fluidframework/core-interfaces';
import { IDocumentMessage } from '@fluidframework/protocol-definitions';
import { IDocumentStorageService } from '@fluidframework/driver-definitions';
import { IErrorBase } from '@fluidframework/core-interfaces';
import { IErrorEvent } from '@fluidframework/core-interfaces';
import { IEvent } from '@fluidframework/core-interfaces';
import { IEventProvider } from '@fluidframework/core-interfaces';
import { IFluidRouter } from '@fluidframework/core-interfaces';
import { IGenericError } from '@fluidframework/core-interfaces';
import { IQuorumClients } from '@fluidframework/protocol-definitions';
import { IRequest } from '@fluidframework/core-interfaces';
import { IResolvedUrl } from '@fluidframework/driver-definitions';
import { IResponse } from '@fluidframework/core-interfaces';
import { ISequencedDocumentMessage } from '@fluidframework/protocol-definitions';
import { ISequencedProposal } from '@fluidframework/protocol-definitions';
import { ISignalMessage } from '@fluidframework/protocol-definitions';
import { ISnapshotTree } from '@fluidframework/protocol-definitions';
import { ISummaryContent } from '@fluidframework/protocol-definitions';
import { ISummaryTree } from '@fluidframework/protocol-definitions';
import { ITelemetryBaseLogger } from '@fluidframework/core-interfaces';
import { IThrottlingWarning } from '@fluidframework/core-interfaces';
import { ITokenClaims } from '@fluidframework/protocol-definitions';
import { IUsageError } from '@fluidframework/core-interfaces';
import { IVersion } from '@fluidframework/protocol-definitions';
import { MessageType } from '@fluidframework/protocol-definitions';

// @public
export enum AttachState {
    Attached = "Attached",
    Attaching = "Attaching",
    Detached = "Detached"
}

// @public
export namespace ConnectionState {
    export type CatchingUp = 1;
    export type Connected = 2;
    export type Disconnected = 0;
    export type EstablishingConnection = 3;
}

// @public
export type ConnectionState = ConnectionState.Disconnected | ConnectionState.EstablishingConnection | ConnectionState.CatchingUp | ConnectionState.Connected;

// @public @deprecated
export enum ContainerErrorType {
    clientSessionExpiredError = "clientSessionExpiredError",
    dataCorruptionError = "dataCorruptionError",
    dataProcessingError = "dataProcessingError",
    genericError = "genericError",
    throttlingError = "throttlingError",
    usageError = "usageError"
}

// @public
export const ContainerErrorTypes: {
    readonly clientSessionExpiredError: "clientSessionExpiredError";
    readonly genericError: "genericError";
    readonly throttlingError: "throttlingError";
    readonly dataCorruptionError: "dataCorruptionError";
    readonly dataProcessingError: "dataProcessingError";
    readonly usageError: "usageError";
};

// @public (undocumented)
export type ContainerErrorTypes = (typeof ContainerErrorTypes)[keyof typeof ContainerErrorTypes];

// @public
export interface ContainerWarning extends IErrorBase {
    logged?: boolean;
}

// @public
export interface IAudience extends EventEmitter {
    getMember(clientId: string): IClient | undefined;
    getMembers(): Map<string, IClient>;
    on(event: "addMember" | "removeMember", listener: (clientId: string, client: IClient) => void): this;
}

// @public
export interface IAudienceOwner extends IAudience {
    addMember(clientId: string, details: IClient): void;
    removeMember(clientId: string): boolean;
}

// @public
export interface IBatchMessage {
    // (undocumented)
    compression?: string;
    // (undocumented)
    contents?: string;
    // (undocumented)
    metadata: Record<string, unknown> | undefined;
    // (undocumented)
    referenceSequenceNumber?: number;
}

// @public
export interface ICodeDetailsLoader extends Partial<IProvideFluidCodeDetailsComparer> {
    load(source: IFluidCodeDetails): Promise<IFluidModuleWithDetails>;
}

// @public
export interface IConnectionDetails {
    checkpointSequenceNumber: number | undefined;
    // (undocumented)
    claims: ITokenClaims;
    // (undocumented)
    clientId: string;
    // (undocumented)
    serviceConfiguration: IClientConfiguration;
}

// @public
export interface IContainer extends IEventProvider<IContainerEvents>, IFluidRouter {
    attach(request: IRequest): Promise<void>;
    readonly attachState: AttachState;
    readonly audience: IAudience;
    readonly clientId?: string | undefined;
    close(error?: ICriticalContainerError): void;
    readonly closed: boolean;
    connect(): void;
    readonly connectionState: ConnectionState;
    deltaManager: IDeltaManager<ISequencedDocumentMessage, IDocumentMessage>;
    disconnect(): void;
    dispose(error?: ICriticalContainerError): void;
    readonly disposed?: boolean;
    // @alpha
    forceReadonly?(readonly: boolean): any;
    getAbsoluteUrl(relativeUrl: string): Promise<string | undefined>;
    getEntryPoint(): Promise<FluidObject | undefined>;
    getLoadedCodeDetails(): IFluidCodeDetails | undefined;
    getQuorum(): IQuorumClients;
    getSpecifiedCodeDetails(): IFluidCodeDetails | undefined;
    // @deprecated (undocumented)
    readonly IFluidRouter: IFluidRouter;
    readonly isDirty: boolean;
    proposeCodeDetails(codeDetails: IFluidCodeDetails): Promise<boolean>;
    readonly readOnlyInfo: ReadOnlyInfo;
    // @deprecated (undocumented)
    request(request: {
        url: "/";
        headers?: undefined;
    }): Promise<IResponse>;
    // @deprecated
    request(request: IRequest): Promise<IResponse>;
    resolvedUrl: IResolvedUrl | undefined;
    serialize(): string;
}

// @public
export interface IContainerContext {
    readonly attachState: AttachState;
    // (undocumented)
    readonly audience: IAudience | undefined;
    // (undocumented)
    readonly baseSnapshot: ISnapshotTree | undefined;
    // (undocumented)
    readonly clientDetails: IClientDetails;
    // (undocumented)
    readonly clientId: string | undefined;
    // (undocumented)
    readonly closeFn: (error?: ICriticalContainerError) => void;
    // (undocumented)
    readonly connected: boolean;
    // (undocumented)
    readonly deltaManager: IDeltaManager<ISequencedDocumentMessage, IDocumentMessage>;
    // (undocumented)
    readonly disposeFn?: (error?: ICriticalContainerError) => void;
    getAbsoluteUrl?(relativeUrl: string): Promise<string | undefined>;
    // (undocumented)
    getLoadedFromVersion(): IVersion | undefined;
    // @deprecated (undocumented)
    getSpecifiedCodeDetails?(): IFluidCodeDetails | undefined;
    // @deprecated
    readonly id: string;
    // (undocumented)
    readonly loader: ILoader;
    // (undocumented)
    readonly options: ILoaderOptions;
    // (undocumented)
    pendingLocalState?: unknown;
    // (undocumented)
    readonly quorum: IQuorumClients;
    readonly scope: FluidObject;
    // (undocumented)
    readonly storage: IDocumentStorageService;
    // (undocumented)
    readonly submitBatchFn: (batch: IBatchMessage[], referenceSequenceNumber?: number) => number;
    // @deprecated (undocumented)
    readonly submitFn: (type: MessageType, contents: any, batch: boolean, appData?: any) => number;
    // (undocumented)
    readonly submitSignalFn: (contents: any) => void;
    // (undocumented)
    readonly submitSummaryFn: (summaryOp: ISummaryContent, referenceSequenceNumber?: number) => number;
    // (undocumented)
    readonly supportedFeatures?: ReadonlyMap<string, unknown>;
    // (undocumented)
    readonly taggedLogger: ITelemetryBaseLogger;
    // (undocumented)
    updateDirtyContainerState(dirty: boolean): void;
}

// @public
export interface IContainerEvents extends IEvent {
    (event: "readonly", listener: (readonly: boolean) => void): void;
    (event: "connected", listener: (clientId: string) => void): any;
    (event: "codeDetailsProposed", listener: (codeDetails: IFluidCodeDetails, proposal: ISequencedProposal) => void): any;
    (event: "disconnected", listener: () => void): any;
    (event: "attaching", listener: () => void): any;
    (event: "attached", listener: () => void): any;
    (event: "closed", listener: (error?: ICriticalContainerError) => void): any;
    (event: "disposed", listener: (error?: ICriticalContainerError) => void): any;
    (event: "warning", listener: (error: ContainerWarning) => void): any;
    (event: "op", listener: (message: ISequencedDocumentMessage) => void): any;
    (event: "dirty", listener: (dirty: boolean) => void): any;
    (event: "saved", listener: (dirty: boolean) => void): any;
}

// @public (undocumented)
export interface IContainerLoadMode {
    // (undocumented)
    deltaConnection?: "none" | "delayed" | undefined;
    // (undocumented)
    opsBeforeReturn?: undefined | "sequenceNumber" | "cached" | "all";
    pauseAfterLoad?: boolean;
}

// @public
export type ICriticalContainerError = IErrorBase;

// @public
export interface IDeltaManager<T, U> extends IEventProvider<IDeltaManagerEvents>, IDeltaSender {
    readonly active: boolean;
    readonly clientDetails: IClientDetails;
    readonly hasCheckpointSequenceNumber: boolean;
    readonly inbound: IDeltaQueue<T>;
    readonly inboundSignal: IDeltaQueue<ISignalMessage>;
    readonly initialSequenceNumber: number;
    readonly lastKnownSeqNumber: number;
    readonly lastMessage: ISequencedDocumentMessage | undefined;
    readonly lastSequenceNumber: number;
    readonly maxMessageSize: number;
    readonly minimumSequenceNumber: number;
    readonly outbound: IDeltaQueue<U[]>;
    // (undocumented)
    readonly readOnlyInfo: ReadOnlyInfo;
    readonly serviceConfiguration: IClientConfiguration | undefined;
    submitSignal(content: any): void;
    readonly version: string;
}

// @public
export interface IDeltaManagerEvents extends IEvent {
    // @deprecated (undocumented)
    (event: "prepareSend", listener: (messageBuffer: any[]) => void): any;
    // @deprecated (undocumented)
    (event: "submitOp", listener: (message: IDocumentMessage) => void): any;
    (event: "op", listener: (message: ISequencedDocumentMessage, processingTime: number) => void): any;
    (event: "pong", listener: (latency: number) => void): any;
    (event: "connect", listener: (details: IConnectionDetails, opsBehind?: number) => void): any;
    (event: "disconnect", listener: (reason: string, error?: IAnyDriverError) => void): any;
    (event: "readonly", listener: (readonly: boolean, readonlyConnectionReason?: {
        reason: string;
        error?: IErrorBase;
    }) => void): any;
}

// @public
export interface IDeltaQueue<T> extends IEventProvider<IDeltaQueueEvents<T>>, IDisposable {
    idle: boolean;
    length: number;
    pause(): Promise<void>;
    paused: boolean;
    peek(): T | undefined;
    resume(): void;
    toArray(): T[];
    waitTillProcessingDone(): Promise<{
        count: number;
        duration: number;
    }>;
}

// @public
export interface IDeltaQueueEvents<T> extends IErrorEvent {
    (event: "push", listener: (task: T) => void): any;
    (event: "op", listener: (task: T) => void): any;
    (event: "idle", listener: (count: number, duration: number) => void): any;
}

// @public
export interface IDeltaSender {
    flush(): void;
}

export { IErrorBase }

// @public
export interface IFluidBrowserPackage extends IFluidPackage {
    // (undocumented)
    fluid: {
        browser: IFluidBrowserPackageEnvironment;
        [environment: string]: IFluidPackageEnvironment;
    };
}

// @public
export interface IFluidBrowserPackageEnvironment extends IFluidPackageEnvironment {
    umd: {
        files: string[];
        library: string;
    };
}

// @public
export interface IFluidCodeDetails {
    readonly config?: IFluidCodeDetailsConfig;
    readonly package: string | Readonly<IFluidPackage>;
}

// @public (undocumented)
export const IFluidCodeDetailsComparer: keyof IProvideFluidCodeDetailsComparer;

// @public
export interface IFluidCodeDetailsComparer extends IProvideFluidCodeDetailsComparer {
    compare(a: IFluidCodeDetails, b: IFluidCodeDetails): Promise<number | undefined>;
    satisfies(candidate: IFluidCodeDetails, constraint: IFluidCodeDetails): Promise<boolean>;
}

// @public
export interface IFluidCodeDetailsConfig {
    // (undocumented)
    readonly [key: string]: string;
}

// @public
export interface IFluidCodeResolver {
    resolveCodeDetails(details: IFluidCodeDetails): Promise<IResolvedFluidCodeDetails>;
}

// @public (undocumented)
export interface IFluidModule {
    // (undocumented)
    fluidExport: FluidObject<IRuntimeFactory & IProvideFluidCodeDetailsComparer>;
}

// @public
export interface IFluidModuleWithDetails {
    details: IFluidCodeDetails;
    module: IFluidModule;
}

// @public
export interface IFluidPackage {
    [key: string]: unknown;
    fluid: {
        [environment: string]: undefined | IFluidPackageEnvironment;
    };
    name: string;
}

// @public
export interface IFluidPackageEnvironment {
    [target: string]: undefined | {
        files: string[];
        [key: string]: unknown;
    };
}

export { IGenericError }

// @public
export interface IHostLoader extends ILoader {
    createDetachedContainer(codeDetails: IFluidCodeDetails): Promise<IContainer>;
    rehydrateDetachedContainerFromSnapshot(snapshot: string): Promise<IContainer>;
}

// @public
export interface ILoader extends Partial<IProvideLoader> {
    // @deprecated (undocumented)
    readonly IFluidRouter: IFluidRouter;
    // @deprecated (undocumented)
    request(request: IRequest): Promise<IResponse>;
    resolve(request: IRequest, pendingLocalState?: string): Promise<IContainer>;
}

// @public
export interface ILoaderHeader {
    // @deprecated (undocumented)
    [LoaderHeader.cache]: boolean;
    // (undocumented)
    [LoaderHeader.clientDetails]: IClientDetails;
    // (undocumented)
    [LoaderHeader.reconnect]: boolean;
    [LoaderHeader.sequenceNumber]: number;
    // (undocumented)
    [LoaderHeader.loadMode]: IContainerLoadMode;
    // (undocumented)
    [LoaderHeader.version]: string | undefined;
}

// @public (undocumented)
export type ILoaderOptions = {
    [key in string | number]: any;
} & {
    cache?: boolean;
    provideScopeLoader?: boolean;
    maxClientLeaveWaitTime?: number;
};

// @public @deprecated (undocumented)
export interface IPendingLocalState {
    // (undocumented)
    pendingRuntimeState: unknown;
    // (undocumented)
    url: string;
}

// @public (undocumented)
export interface IProvideFluidCodeDetailsComparer {
    // (undocumented)
    readonly IFluidCodeDetailsComparer: IFluidCodeDetailsComparer;
}

// @public (undocumented)
export interface IProvideLoader {
    // (undocumented)
    readonly ILoader: ILoader;
}

// @public (undocumented)
export interface IProvideRuntimeFactory {
    // (undocumented)
    readonly IRuntimeFactory: IRuntimeFactory;
}

// @public
export interface IResolvedFluidCodeDetails extends IFluidCodeDetails {
    readonly resolvedPackage: Readonly<IFluidPackage>;
    readonly resolvedPackageCacheId: string | undefined;
}

// @public
export interface IRuntime extends IDisposable {
    createSummary(blobRedirectTable?: Map<string, string>): ISummaryTree;
    getEntryPoint(): Promise<FluidObject | undefined>;
    getPendingLocalState(props?: {
        notifyImminentClosure?: boolean;
    }): unknown;
    // @deprecated
    notifyAttaching(snapshot: ISnapshotTreeWithBlobContents): void;
    notifyOpReplay?(message: ISequencedDocumentMessage): Promise<void>;
    process(message: ISequencedDocumentMessage, local: boolean): any;
    processSignal(message: any, local: boolean): any;
    // @deprecated
    request(request: IRequest): Promise<IResponse>;
    setAttachState(attachState: AttachState.Attaching | AttachState.Attached): void;
    setConnectionState(connected: boolean, clientId?: string): any;
}

// @public (undocumented)
export const IRuntimeFactory: keyof IProvideRuntimeFactory;

// @public
export interface IRuntimeFactory extends IProvideRuntimeFactory {
    instantiateRuntime(context: IContainerContext, existing: boolean): Promise<IRuntime>;
}

// @public
export const isFluidBrowserPackage: (maybePkg: unknown) => maybePkg is Readonly<IFluidBrowserPackage>;

// @public
export const isFluidCodeDetails: (details: unknown) => details is Readonly<IFluidCodeDetails>;

// @public
export const isFluidPackage: (pkg: unknown) => pkg is Readonly<IFluidPackage>;

// @public
export interface ISnapshotTreeWithBlobContents extends ISnapshotTree {
    // (undocumented)
    blobsContents: {
        [path: string]: ArrayBufferLike;
    };
    // (undocumented)
    trees: {
        [path: string]: ISnapshotTreeWithBlobContents;
    };
}

export { IThrottlingWarning }

export { IUsageError }

// @public
export enum LoaderHeader {
    // @deprecated (undocumented)
    cache = "fluid-cache",
    // (undocumented)
    clientDetails = "fluid-client-details",
    loadMode = "loadMode",
    // (undocumented)
    reconnect = "fluid-reconnect",
    sequenceNumber = "fluid-sequence-number",
    version = "version"
}

// @public (undocumented)
export type ReadOnlyInfo = {
    readonly readonly: false | undefined;
} | {
    readonly readonly: true;
    readonly forced: boolean;
    readonly permissions: boolean | undefined;
    readonly storageOnly: boolean;
    readonly storageOnlyReason?: string;
};

```