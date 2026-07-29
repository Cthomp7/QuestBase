export async function apiFetch(path, options = {}) {
    return fetch(`/api${path}`, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}