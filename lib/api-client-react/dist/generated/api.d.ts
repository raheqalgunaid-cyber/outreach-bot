import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Campaign, CampaignInput, CampaignUpdate, HealthStatus, ListLogsParams, ListStreamersParams, MessageTemplate, MessageTemplateInput, MessageTemplateUpdate, OutreachLog, Stats, Streamer } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all campaigns
 */
export declare const getListCampaignsUrl: () => string;
export declare const listCampaigns: (options?: RequestInit) => Promise<Campaign[]>;
export declare const getListCampaignsQueryKey: () => readonly ["/api/campaigns"];
export declare const getListCampaignsQueryOptions: <TData = Awaited<ReturnType<typeof listCampaigns>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCampaigns>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCampaigns>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCampaignsQueryResult = NonNullable<Awaited<ReturnType<typeof listCampaigns>>>;
export type ListCampaignsQueryError = ErrorType<unknown>;
/**
 * @summary List all campaigns
 */
export declare function useListCampaigns<TData = Awaited<ReturnType<typeof listCampaigns>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCampaigns>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a campaign
 */
export declare const getCreateCampaignUrl: () => string;
export declare const createCampaign: (campaignInput: CampaignInput, options?: RequestInit) => Promise<Campaign>;
export declare const getCreateCampaignMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCampaign>>, TError, {
        data: BodyType<CampaignInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCampaign>>, TError, {
    data: BodyType<CampaignInput>;
}, TContext>;
export type CreateCampaignMutationResult = NonNullable<Awaited<ReturnType<typeof createCampaign>>>;
export type CreateCampaignMutationBody = BodyType<CampaignInput>;
export type CreateCampaignMutationError = ErrorType<unknown>;
/**
 * @summary Create a campaign
 */
export declare const useCreateCampaign: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCampaign>>, TError, {
        data: BodyType<CampaignInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCampaign>>, TError, {
    data: BodyType<CampaignInput>;
}, TContext>;
/**
 * @summary Get a campaign by ID
 */
export declare const getGetCampaignUrl: (id: number) => string;
export declare const getCampaign: (id: number, options?: RequestInit) => Promise<Campaign>;
export declare const getGetCampaignQueryKey: (id: number) => readonly [`/api/campaigns/${number}`];
export declare const getGetCampaignQueryOptions: <TData = Awaited<ReturnType<typeof getCampaign>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCampaign>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCampaign>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCampaignQueryResult = NonNullable<Awaited<ReturnType<typeof getCampaign>>>;
export type GetCampaignQueryError = ErrorType<void>;
/**
 * @summary Get a campaign by ID
 */
export declare function useGetCampaign<TData = Awaited<ReturnType<typeof getCampaign>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCampaign>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a campaign
 */
export declare const getUpdateCampaignUrl: (id: number) => string;
export declare const updateCampaign: (id: number, campaignUpdate: CampaignUpdate, options?: RequestInit) => Promise<Campaign>;
export declare const getUpdateCampaignMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCampaign>>, TError, {
        id: number;
        data: BodyType<CampaignUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCampaign>>, TError, {
    id: number;
    data: BodyType<CampaignUpdate>;
}, TContext>;
export type UpdateCampaignMutationResult = NonNullable<Awaited<ReturnType<typeof updateCampaign>>>;
export type UpdateCampaignMutationBody = BodyType<CampaignUpdate>;
export type UpdateCampaignMutationError = ErrorType<unknown>;
/**
 * @summary Update a campaign
 */
export declare const useUpdateCampaign: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCampaign>>, TError, {
        id: number;
        data: BodyType<CampaignUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCampaign>>, TError, {
    id: number;
    data: BodyType<CampaignUpdate>;
}, TContext>;
/**
 * @summary Delete a campaign
 */
export declare const getDeleteCampaignUrl: (id: number) => string;
export declare const deleteCampaign: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteCampaignMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCampaign>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCampaign>>, TError, {
    id: number;
}, TContext>;
export type DeleteCampaignMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCampaign>>>;
export type DeleteCampaignMutationError = ErrorType<unknown>;
/**
 * @summary Delete a campaign
 */
export declare const useDeleteCampaign: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCampaign>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCampaign>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Start a campaign bot
 */
export declare const getStartCampaignUrl: (id: number) => string;
export declare const startCampaign: (id: number, options?: RequestInit) => Promise<Campaign>;
export declare const getStartCampaignMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startCampaign>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof startCampaign>>, TError, {
    id: number;
}, TContext>;
export type StartCampaignMutationResult = NonNullable<Awaited<ReturnType<typeof startCampaign>>>;
export type StartCampaignMutationError = ErrorType<unknown>;
/**
 * @summary Start a campaign bot
 */
export declare const useStartCampaign: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startCampaign>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof startCampaign>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Stop a campaign bot
 */
export declare const getStopCampaignUrl: (id: number) => string;
export declare const stopCampaign: (id: number, options?: RequestInit) => Promise<Campaign>;
export declare const getStopCampaignMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof stopCampaign>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof stopCampaign>>, TError, {
    id: number;
}, TContext>;
export type StopCampaignMutationResult = NonNullable<Awaited<ReturnType<typeof stopCampaign>>>;
export type StopCampaignMutationError = ErrorType<unknown>;
/**
 * @summary Stop a campaign bot
 */
export declare const useStopCampaign: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof stopCampaign>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof stopCampaign>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List message templates
 */
export declare const getListTemplatesUrl: () => string;
export declare const listTemplates: (options?: RequestInit) => Promise<MessageTemplate[]>;
export declare const getListTemplatesQueryKey: () => readonly ["/api/templates"];
export declare const getListTemplatesQueryOptions: <TData = Awaited<ReturnType<typeof listTemplates>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTemplates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTemplates>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTemplatesQueryResult = NonNullable<Awaited<ReturnType<typeof listTemplates>>>;
export type ListTemplatesQueryError = ErrorType<unknown>;
/**
 * @summary List message templates
 */
export declare function useListTemplates<TData = Awaited<ReturnType<typeof listTemplates>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTemplates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a message template
 */
export declare const getCreateTemplateUrl: () => string;
export declare const createTemplate: (messageTemplateInput: MessageTemplateInput, options?: RequestInit) => Promise<MessageTemplate>;
export declare const getCreateTemplateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTemplate>>, TError, {
        data: BodyType<MessageTemplateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTemplate>>, TError, {
    data: BodyType<MessageTemplateInput>;
}, TContext>;
export type CreateTemplateMutationResult = NonNullable<Awaited<ReturnType<typeof createTemplate>>>;
export type CreateTemplateMutationBody = BodyType<MessageTemplateInput>;
export type CreateTemplateMutationError = ErrorType<unknown>;
/**
 * @summary Create a message template
 */
export declare const useCreateTemplate: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTemplate>>, TError, {
        data: BodyType<MessageTemplateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTemplate>>, TError, {
    data: BodyType<MessageTemplateInput>;
}, TContext>;
/**
 * @summary Update a message template
 */
export declare const getUpdateTemplateUrl: (id: number) => string;
export declare const updateTemplate: (id: number, messageTemplateUpdate: MessageTemplateUpdate, options?: RequestInit) => Promise<MessageTemplate>;
export declare const getUpdateTemplateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTemplate>>, TError, {
        id: number;
        data: BodyType<MessageTemplateUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTemplate>>, TError, {
    id: number;
    data: BodyType<MessageTemplateUpdate>;
}, TContext>;
export type UpdateTemplateMutationResult = NonNullable<Awaited<ReturnType<typeof updateTemplate>>>;
export type UpdateTemplateMutationBody = BodyType<MessageTemplateUpdate>;
export type UpdateTemplateMutationError = ErrorType<unknown>;
/**
 * @summary Update a message template
 */
export declare const useUpdateTemplate: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTemplate>>, TError, {
        id: number;
        data: BodyType<MessageTemplateUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTemplate>>, TError, {
    id: number;
    data: BodyType<MessageTemplateUpdate>;
}, TContext>;
/**
 * @summary Delete a message template
 */
export declare const getDeleteTemplateUrl: (id: number) => string;
export declare const deleteTemplate: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTemplateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTemplate>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTemplate>>, TError, {
    id: number;
}, TContext>;
export type DeleteTemplateMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTemplate>>>;
export type DeleteTemplateMutationError = ErrorType<unknown>;
/**
 * @summary Delete a message template
 */
export declare const useDeleteTemplate: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTemplate>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTemplate>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List discovered streamers
 */
export declare const getListStreamersUrl: (params?: ListStreamersParams) => string;
export declare const listStreamers: (params?: ListStreamersParams, options?: RequestInit) => Promise<Streamer[]>;
export declare const getListStreamersQueryKey: (params?: ListStreamersParams) => readonly ["/api/streamers", ...ListStreamersParams[]];
export declare const getListStreamersQueryOptions: <TData = Awaited<ReturnType<typeof listStreamers>>, TError = ErrorType<unknown>>(params?: ListStreamersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStreamers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStreamers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStreamersQueryResult = NonNullable<Awaited<ReturnType<typeof listStreamers>>>;
export type ListStreamersQueryError = ErrorType<unknown>;
/**
 * @summary List discovered streamers
 */
export declare function useListStreamers<TData = Awaited<ReturnType<typeof listStreamers>>, TError = ErrorType<unknown>>(params?: ListStreamersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStreamers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List outreach activity logs
 */
export declare const getListLogsUrl: (params?: ListLogsParams) => string;
export declare const listLogs: (params?: ListLogsParams, options?: RequestInit) => Promise<OutreachLog[]>;
export declare const getListLogsQueryKey: (params?: ListLogsParams) => readonly ["/api/logs", ...ListLogsParams[]];
export declare const getListLogsQueryOptions: <TData = Awaited<ReturnType<typeof listLogs>>, TError = ErrorType<unknown>>(params?: ListLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listLogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListLogsQueryResult = NonNullable<Awaited<ReturnType<typeof listLogs>>>;
export type ListLogsQueryError = ErrorType<unknown>;
/**
 * @summary List outreach activity logs
 */
export declare function useListLogs<TData = Awaited<ReturnType<typeof listLogs>>, TError = ErrorType<unknown>>(params?: ListLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard statistics
 */
export declare const getGetStatsUrl: () => string;
export declare const getStats: (options?: RequestInit) => Promise<Stats>;
export declare const getGetStatsQueryKey: () => readonly ["/api/stats"];
export declare const getGetStatsQueryOptions: <TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getStats>>>;
export type GetStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard statistics
 */
export declare function useGetStats<TData = Awaited<ReturnType<typeof getStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map