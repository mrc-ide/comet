export const numericFormatter = (num: number): string => {
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(2)}b`;
    }
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2)}m`;
    }
    if (num > 999 && num < 1000000) {
        return `${(num / 1000).toFixed(2)}k`;
    }

    return num.toString();
};
