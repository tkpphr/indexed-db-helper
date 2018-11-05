/*!
 *  indexed-db-helper
 *  Copyright (c) 2018 tkpphr
 *  Released under the MIT License.
 */
export declare function openDatabase(dbName: string, storeNames: string[]): Promise<IDBDatabase>;
export declare function deleteDatabase(dbName: string): Promise<void>;
export declare function getRecordCount(db: IDBDatabase, storeName: string): Promise<number>;
export declare function getRecord(db: IDBDatabase, storeName: string, key: string): Promise<any>;
export declare function getRecords(db: IDBDatabase, storeName: string, where: (key: string, value: any) => boolean): Promise<{
    [key: string]: any;
}>;
export declare function getAllRecord(db: IDBDatabase, storeName: string): Promise<{
    [key: string]: any;
}>;
export declare function putRecord(db: IDBDatabase, storeName: string, key: string, value: any): Promise<void>;
export declare function putRecords(db: IDBDatabase, storeName: string, keys: string[], valueGetter: (key: string) => any): Promise<void>;
export declare function deleteRecord(db: IDBDatabase, storeName: string, key: string): Promise<void>;
export declare function deleteRecords(db: IDBDatabase, storeName: string, where: (key: string, value: any) => boolean): Promise<void>;
export declare function deleteAllRecord(db: IDBDatabase, storeName: string): Promise<void>;
