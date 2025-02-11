export const getPumpHistory = async (devAddress: string) => {
    const res = await fetch(`https://frontend-api-v3.pump.fun/balances/${devAddress}?limit=50&offset=0&minBalance=-1`)
    const data = await res.json()
    return data.length
}