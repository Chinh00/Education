export interface UserInfo {
    studentCode: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    sub: string;
    fullname: string;
    "department-path": string
}