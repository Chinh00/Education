export interface SuccessResponse<TData> {
    data: TData;
    isError: boolean;
    message: string | null;
}
export interface ListSuccessResponse<TData> {
    items: TData[];
    totalItems: number;
    page: number;
    pageSize: number;
}