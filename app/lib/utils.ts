import { ItemType, UserRole } from "@prisma/client";

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

export const userRoleToDivision: { [key in UserRole]: string } = {
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


export const roleStringToUserRole: { [key: string]: UserRole } = {
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

export const formatTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('sv-SE', options);
};

export const formatDateAndTime = (date: Date): string => {    
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('sv-SE', options);
};

export const formatDateToLocale = (date: Date): string => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toLocaleDateString('sv-SE');
}

export const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const transactionDate = new Date(date);
    transactionDate.setHours(0, 0, 0, 0);


    if (transactionDate.getTime() === today.getTime()) {
        return `Idag kl ${formatTime(date)}`;
    } else if (transactionDate.getTime() === yesterday.getTime()) {
        return `Igår kl ${formatTime(date)}`;
    }
    else {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('sv-SE', options);
    }
};

export function base64toFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export function formatPhoneNumber(phoneNumber: string) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{2})(\d{2})(\d{1})$/);
    if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4] + ' ' + match[5];
    }
    return phoneNumber;
} 

export function formatCentilitres(cl: number) {
    const litres = cl / 100;
    if (litres >= 1) {
        return `${litres} liter`;
    } else {
        return `${cl} cl`;
    }
}
