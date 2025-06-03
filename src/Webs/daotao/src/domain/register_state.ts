export interface Register {
    correlationId: string,
    version: number,
    currentState: string,
    semesterCode: string,
    wishStartDate: string,
    wishEndDate: string,
    studentRegisterStart: string,
    studentRegisterEnd: string,
    minCredit: number,
    maxCredit: number,
    numberStudent: number,
    numberSubject: number,
    numberWish: number,
    eventStoreId: string
}

