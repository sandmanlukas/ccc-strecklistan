import { ItemType, UserRole } from "@prisma/client";

export const BEERED_BARCODE = "0000000000000";

export function handleScan(setScannedData: Function, setScanCount: Function | null = null) {
    let code = "";
    let reading = false;

    return (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!reading) {
            reading = true;
            setTimeout(() => {
                if (code.length >= 7) {
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
    PRCHEF: "PR-chef", 
    KADAVER: "Kadaver",
    OTHER: "Annat",
};

export const itemTypes: { [key in ItemType]: string } = {
    DRYCK: "Dryck",
    MAT: "Mat",
    ANNAT: "Annat",
};

export const divisions = ['AFA', 'BOB', 'PMS', 'FET'];

export const personsPerDivision: { [key: string]: number } = {
    AFA: 2,
    BOB: 4,
    PMS: 2,
    FET: 3,
};

export const userRoleToDivision: {[key in UserRole]: string} = {
    ORDFORANDE: 'AFA',
    KASSOR: 'AFA',
    BYGGCHEF: 'BOB',
    BILCHEF: 'BOB',
    GARDVAR: 'BOB',
    KLADCHEF: 'BOB',
    PROGRAMCHEF: 'PMS',
    ANNONSCHEF: 'PMS',
    MUSIKCHEF: 'FET',
    OLCHEF: 'FET',
    PRCHEF: 'FET',
    KADAVER: "",
    OTHER: ""
}


export const roleStringToUserRole: {[key: string]: UserRole} = {
    "Ordförande": "ORDFORANDE" as UserRole,
    "Kassör": "KASSOR" as UserRole,
    "Byggchef": "BYGGCHEF" as UserRole,
    "Bilchef": "BILCHEF" as UserRole,
    "Gårdvar": "GARDVAR" as UserRole,
    "Klädchef": "KLADCHEF" as UserRole,
    "Programchef": "PROGRAMCHEF" as UserRole,
    "Annonschef": "ANNONSCHEF" as UserRole,
    "Musikchef": "MUSIKCHEF" as UserRole,
    "Ölchef": "OLCHEF" as UserRole,
    "PR-chef": "PRCHEF" as UserRole,
    "Kadaver": "KADAVER" as UserRole,
    "Annat": "OTHER" as UserRole
}