import { UserRole } from "@prisma/client";

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

        if (event.key !== "Enter" && isNumber(event.key)) {
            code += event.key;
        }
    };
}

function isNumber(string: string) {
    return !isNaN(+string) && isFinite(+string);
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const positionLabels: { [key in UserRole]: string } = {
    ORDFORANDE: "Ordförande",
    KASSOR: "Kassör",
    BYGGCHEF: "Byggchef",
    BILCHEF: "Bilchef",
    GARDVAR: "Gårdvar",
    KLADCHEF: "Klädchef",
    PROGRAMCHEF: "Programchef",
    ANNONSCHEF: "Annonschef",
    MUSIKCHEF: "Musikchef",
    OLCHEF: "Ölchef",
    PRCHEF: "PR-chef", // Original representation
    KADAVER: "Kadaver", // Original representation
    OTHER: "Annat"
};
