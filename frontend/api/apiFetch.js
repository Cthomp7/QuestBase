const API_URL = "http://localhost:8080/api";

export async function apiFetch(path, options = {}) {
    return fetch(`http://localhost:8080/api${path}`, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}