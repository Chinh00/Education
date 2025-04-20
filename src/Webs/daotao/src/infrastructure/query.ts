export interface Query {
    Filters?: Filter[];
    Includes?: string[];
    Sorts?: string[],
    Page?: number;
    PageSize?: number;
}

export interface Filter {
    field: string,
    operator: string,
    value: string
}

export function GetQuery(query: Query): string {
    const params = new URLSearchParams();

    if (query.Filters !== undefined && query.Filters.length !== 0) {
        for (let i = 0; i < query.Filters.length; i++) {
            params.append(`filters[${i}].field`, String(query.Filters[i].field));
            params.append(`filters[${i}].operator`, String(query.Filters[i].operator));
            params.append(`filters[${i}].value`, String(query.Filters[i].value));
        }
    }

    if (query.Page !== undefined) params.append("Page", String(query.Page));
    if (query.PageSize !== undefined) params.append("PageSize", String(query.PageSize));
    if (Array.isArray(query.Includes)) {
        query.Includes.forEach(include => params.append("Includes", include));
    }
    if (Array.isArray(query.Sorts)) {
        query.Sorts.forEach(include => params.append("Sorts", include));
    }
    return params.toString()
}