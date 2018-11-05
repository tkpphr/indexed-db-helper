/*!
 *  indexed-db-helper
 *  Copyright (c) 2018 tkpphr
 *  Released under the MIT License.
 */

export async function openDatabase(dbName: string, storeNames: string[]) {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(dbName);
        request.onsuccess = (event) => {
            const db = (event.target as IDBRequest).result as IDBDatabase;
            if (db) {
                resolve(db);
            } else {
                reject(`can't open ${dbName}`);
            }
        };
        request.onerror = () => {
            reject(`can't open ${dbName}`);
        };
        request.onblocked = () => {
            reject(`${dbName} is blocked.`);
        };
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result as IDBDatabase;
            for (const storeName of storeNames) {
                db.createObjectStore(storeName);
            }
        };

    });
}

export async function deleteDatabase(dbName: string) {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName);
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            reject(`can't delete ${dbName}`);
        };
        request.onblocked = () => {
            reject(`${dbName} is blocked.`);
        };
    });
}

export async function getRecordCount(db: IDBDatabase, storeName: string) {
    return new Promise<number>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const request = transaction.objectStore(storeName).count();
        request.onsuccess = (event) => {
            const count = (event.target as IDBRequest).result as number;
            if (count) {
                resolve(count);
            } else {
                resolve(0);
            }
        };
        request.onerror = () => reject(`can't get record count from ${storeName}.`);
    });
}

export async function getRecord(db: IDBDatabase, storeName: string, key: string) {
    return new Promise<any>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const request = transaction.objectStore(storeName).get(key);
        request.onsuccess = (event) => {
            const record = (event.target as IDBRequest).result;
            if (record) {
                resolve(record);
            } else {
                resolve(undefined);
            }
        };
        request.onerror = () => {
            reject(`can't get ${key} from ${storeName}.`);
        };
    });
}

export async function getRecords(db: IDBDatabase, storeName: string, where: (key: string, value: any) => boolean) {
    return new Promise<{ [key: string]: any }>((resolve, reject) => {
        const records: { [key: string]: any } = {};
        const transaction = db.transaction(storeName, "readonly");
        transaction.oncomplete = () => resolve(records);
        const request = transaction.objectStore(storeName).openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
            if (cursor) {
                const key = `${cursor.key}`;
                const value = cursor.value;
                if (where(key, value)) {
                    records[key] = value;
                }
                cursor.continue();
            }
        };
        request.onerror = () => reject(`can't get records from ${storeName}`);
    });
}

export async function getAllRecord(db: IDBDatabase, storeName: string) {
    return getRecords(db, storeName, (_key, _value) => true);
}

export async function putRecord(db: IDBDatabase, storeName: string, key: string, value: any) {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => reject(`can't put (${key}: ${value}) to ${storeName}.`);
        transaction.objectStore(storeName).put(value, key);
    });
}

export async function putRecords(db: IDBDatabase, storeName: string, keys: string[], valueGetter: (key: string) => any) {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        transaction.onerror = () => reject(`can't put records to ${storeName}.`);
        transaction.oncomplete = () => {
            resolve();
        };
        for (const key of keys) {
            const value = valueGetter(key);
            transaction.objectStore(storeName).put(value, key);
        }
    });
}

export async function deleteRecord(db: IDBDatabase, storeName: string, key: string) {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => reject(`${storeName}'s ${key} can't delete.`);
        transaction.objectStore(storeName).delete(key);
    });
}

export async function deleteRecords(db: IDBDatabase, storeName: string, where: (key: string, value: any) => boolean) {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = () => resolve();
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.openCursor();
        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
            if (cursor) {
                const key = `${cursor.key}`;
                const value = cursor.value;
                if (where(key, value)) {
                    objectStore.delete(key);
                }
                cursor.continue();
            }
        };
        request.onerror = () => reject(`can't delete records from ${storeName}`);
    });
}

export async function deleteAllRecord(db: IDBDatabase, storeName: string) {
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => reject(`${storeName}'s records can't delete.`);
        transaction.objectStore(storeName).clear();
    });
}
