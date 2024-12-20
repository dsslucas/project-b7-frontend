export function common() {
    function capitalizeFirstLetter(value: string) {
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    }

    return {
        capitalizeFirstLetter
    }
}

