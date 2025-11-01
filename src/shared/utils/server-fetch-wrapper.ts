type Method = 'GET' | 'POST';
type Args = {
    url: string,
    method: Method,
    body?: FormData | Record<string, unknown> | string,
    headers?: Record<string, string>,
}

export type ServerFetchWrapper = <T>(args: Args) => Promise<{ success: true, data: T, status: number } | { success: false, error: string, status: number }>

const serverFetchWrapper: ServerFetchWrapper = async <T>(args: Args) => {
    const { url, method, body, headers } = args;

    let response: Response;
    try {
        const options: {
            method: Method,
            headers: Record<string, string>,
            body?: string,
        } = {
            method,
            headers: {
            }
        };
        
        if(typeof body === 'object' && body !== null) {
            options.headers['Content-Type'] = 'application/json';
        }

        if(body && method === 'POST') {
            options.body = (typeof body === 'object' && body !== null) ? JSON.stringify(body) : body;
        }
        
        options.headers = {
            ...options.headers,
            ...headers,
        };

        response = await fetch(url, options);
        
    } catch {
        
        return ({
            success: false, 
            error: 'ServerError: Не удалось подключиться',
            status: 503
        });
    } 

    if(!response.ok) {
        return ({
            success: false, 
            error: 'ServerError: Сервер вернул ошибку',
            status: response.status
        });
    }

    let responseData: T;
    try{
        responseData = await response.json();

    } catch {
        return ({
            success: false,
            error: 'ServerError: Некорректный ответ',
            status: 502
        });
    }

    return({ 
        success: true, 
        data: responseData,
        status: response.status,
    });
};

export default serverFetchWrapper;