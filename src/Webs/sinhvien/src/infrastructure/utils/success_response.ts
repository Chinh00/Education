export interface SuccessResponse<TData> {
    data: TData;
    isError: boolean;
    message: string | null;
}