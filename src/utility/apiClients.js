export async function callApi({ url, method = 'GET', body = null, headers = {}, params = {} }) {
    // Convert params object to query string
    console.log("calling api with ", { url, method, params, body })
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const config = {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        credentials: 'include', // Include cookies in requests
    };

    if (body) {
        // For non-JSON bodies like FormData, avoid stringifying and overriding Content-Type
        if (body instanceof FormData) {
            delete config.headers['Content-Type'];  // Let browser set multipart boundary automatically
            config.body = body;
        } else {
            config.body = JSON.stringify(body);
        }
    }

    const response = await fetch(fullUrl, config);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}