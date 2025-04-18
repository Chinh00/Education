export interface Query {
    Includes?: string[];
    Sorts?: string[],
    Page?: number;
    PageSize?: number;
}

export function GetQuery(query: Query): string {
    const params = new URLSearchParams();

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