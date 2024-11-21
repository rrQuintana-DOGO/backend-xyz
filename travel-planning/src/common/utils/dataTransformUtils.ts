export function convertDateToBigInt(date: Date): BigInt {
    if (!date) {
        return null;
    }
    const dateObject = new Date(date);
    const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
    return BigInt(unixTimestamp);
}