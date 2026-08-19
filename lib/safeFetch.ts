
export default function safeFetch(args: Parameters<typeof fetch>): Promise<any> {
    return new Promise(async function(reslove, reject) {
        try {
            const res = await fetch(...args)
            if (!res.ok) throw `${res.status} ${JSON.stringify(await res.json())}`;
            reslove(JSON.stringify(await res.json()))
        }
        catch (error) {
            reject(error)
        }
    })
}