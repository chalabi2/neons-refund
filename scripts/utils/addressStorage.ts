import fs from 'fs';

const FILE_NAME = './deployedAddresses.json';

export function addAddress(address: string) {
    let addresses = [];
    if (fs.existsSync(FILE_NAME)) {
        addresses = JSON.parse(fs.readFileSync(FILE_NAME, 'utf8'));
    }
    addresses.push(address);
    fs.writeFileSync(FILE_NAME, JSON.stringify(addresses, null, 4));
}

export function getAddresses(): string[] {
    if (fs.existsSync(FILE_NAME)) {
        return JSON.parse(fs.readFileSync(FILE_NAME, 'utf8'));
    }
    return [];
}