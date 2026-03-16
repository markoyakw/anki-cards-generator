export interface ParsedGoogleError {
    code?: number;
    status?: string;
    message: string;
}

export default function parseGoogleError(e: Error): ParsedGoogleError {
    try {
        // try to parse outer JSON
        const outerJsonShell = JSON.parse(e.message);

        if (typeof outerJsonShell.error?.message === "string") {
            try {
                // try to parse inner layer
                const inner = JSON.parse(outerJsonShell.error.message);
                
                // if there is an inner layer error
                if (inner.error) {
                    return {
                        code: inner.error.code ?? outerJsonShell.error.code,
                        status: inner.error.status ?? outerJsonShell.error.status,
                        message: inner.error.message
                    }}
            } catch {
                // if inner doesn't parse like JSIN, it's normal string
                return {
                    code: outerJsonShell.error?.code,
                    status: outerJsonShell.error?.status,
                    message: outerJsonShell.error.message
                }}}

        // if there is no layered buggy google API return - it's one-layered JSON
        if (outerJsonShell.error) {
            return {
                code: outerJsonShell.error.code,
                status: outerJsonShell.error.status,
                message: outerJsonShell.error.message || e.message
            }}
            
        // unexpected strture handler
        return { message: e.message };

    } catch {
        // if it's not JSON at all
        return { message: e.message };
    }
}