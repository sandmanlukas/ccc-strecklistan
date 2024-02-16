export function handleScan(setScannedData: Function, setScanCount: Function | null = null) {
    let code = "";
    let reading = false;

    return (event: KeyboardEvent) => {
        if (!reading) {
            reading = true;
            setTimeout(() => {
                if (code.length > 10) {
                    setScannedData(code);
                    if (setScanCount) {
                        setScanCount((count: number) => count + 1);
                    }
                }
                code = "";
                reading = false;
            }, 200);
        }

        if (event.key !== "Enter") {
            code += event.key;
        }
    };
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}