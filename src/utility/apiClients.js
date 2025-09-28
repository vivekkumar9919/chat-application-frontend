export async function callApi({ url, method = 'GET', body = null, headers = {}, params = {} }) {
    // Convert params object to query string
    console.log("calling api with ", { url, method, params, body })
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, config);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}
