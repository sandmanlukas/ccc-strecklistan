export function handleScan(code: string, reading: boolean, setScannedData: Function) {
    return (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            if (code.length > 10) {
                setScannedData(code);
                code = "";
            }
        } else {
            code += event.key;
        }

        if (!reading) {
            reading = true;
            setTimeout(() => {
                code = "";
                reading = false;
            }, 200);
        }
    };
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }