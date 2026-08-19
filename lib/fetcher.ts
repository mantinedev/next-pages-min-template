export const fetcher = (url: string, options?: RequestInit) => fetch(url,options).then(r => r.json())
