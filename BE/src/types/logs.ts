// export type LogLevel = "ERROR" | "INFO" | "WARNING";
export const loglevel = ['error','info','warning'] as const;
export type LogLevel = typeof loglevel[number];
export type LogFn = (message: string) => void;
export type Log = {
    message:string,
    level:LogLevel,
    timestamp: Date
}

export type logCollector = {
    getAll(): Log[],
} & Record<LogLevel,LogFn>