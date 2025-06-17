// Object mapping: [totalPeriods][weeks] = Array of suggestion objects
// Each suggestion object: { sessionsPerWeek: number, periodsPerSession: number, label: string }

export const periodSessionSuggestions: {
    [totalPeriods: number]: {
        [weeks: number]: Array<{ sessionsPerWeek: number; periodsPerSession: number; label: string }>
    }
} = {
    15: {
        8: [
            {
                sessionsPerWeek: 2,
                periodsPerSession: 1,
                label: "2 buổi 1 tiết/tuần",
            },
            {
                sessionsPerWeek: 1,
                periodsPerSession: 2,
                label: "1 buổi 2 tiết/tuần",
            },
        ],
        16: [
            {
                sessionsPerWeek: 1,
                periodsPerSession: 1,
                label: "1 buổi 1 tiết/tuần",
            },
        ],
    },
    30: {
        8: [
            {
                sessionsPerWeek: 2,
                periodsPerSession: 2,
                label: "2 buổi 2 tiết/tuần",
            },
        ],
        16: [
            {
                sessionsPerWeek: 1,
                periodsPerSession: 2,
                label: "1 buổi 2 tiết/tuần",
            },
            {
                sessionsPerWeek: 2,
                periodsPerSession: 1,
                label: "2 buổi 1 tiết/tuần",
            },
        ],
    },
    45: {
        8: [
            {
                sessionsPerWeek: 2,
                periodsPerSession: 3,
                label: "2 buổi 3 tiết/tuần",
            },
            {
                sessionsPerWeek: 3,
                periodsPerSession: 2,
                label: "3 buổi 2 tiết/tuần",
            },
        ],
        16: [
            {
                sessionsPerWeek: 1,
                periodsPerSession: 3,
                label: "1 buổi 3 tiết/tuần",
            },
            
        ],
    },
    
};

export function getPeriodSessionOptions(
    totalPeriods: number,
    weeks: number
): Array<{ sessionsPerWeek: number; periodsPerSession: number; label: string }> {
    return periodSessionSuggestions[totalPeriods]?.[weeks] || [];
}

export const getWeekOfStage = (stage: number) => {
    switch (stage) {
        case 0:
            return 8;
        case 1:
            return 8;
        case 2:
            return 16;
            
        
    }
}

function combinations(n: number, k: number): number {
    if (k > n) return 0;
    let res = 1;
    for (let i = 1; i <= k; ++i) {
        res *= (n - i + 1) / i;
    }
    return res;
}

export function countWays(theoryTotalPeriod: number, weeks: number): number {
    if (theoryTotalPeriod < weeks) return 0;
    return combinations(theoryTotalPeriod - 1, weeks - 1);
}