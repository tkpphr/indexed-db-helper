# IndexedDBHelper

## Overview
IndexedDB utility.

## Installation
```
npm install --save https://www.myget.org/F/tkpphr-npm-feed/npm/indexed-db-helper/-/1.0.0.tgz
```

## Usage
1. Import
```javascript
import * as IndexedDBHelper from "indexed-db-helper" 
```
2. Setup Database
- Open or Create
```typescript
const openedDatabase = await IndexedDBHelper.openDatabase("example", ["storeNames"]);
```
- Delete
```typescript
await IndexedDBHelper.deleteDatabase("example");
```
3. Organize Record
- Create/Update
    - Single
    ```typescript
    await IndexedDBHelper.putRecord(openedDatabase, "storeName", "key", "value");
    ```
    - Multiple
    ```typescript
    const records:{ [key:string]: any } = { foo:"bar",fizz:"buzz",hoge:"buzz"};
    await IndexedDBHelper.putRecords(openedDatabase, "storeName",  Object.keys(records), (key) => records[key]);
    ```
- Read
    - Single
    ```typescript
    const record = await IndexedDBHelper.getRecord(openedDatabase, "storeName", "key");
    ```
    - Multiple
    ```typescript
    const records = await IndexedDBHelper.getRecords(openedDatabase, "storeName", (key,value) => key === "key" || value === "value");
    ```
    - All
    ```typescript
    const records = await IndexedDBHelper.getAllRecord(openedDatabase, "storeName");
    ```
    - Count
    ```typescript
    const count = await IndexedDBHelper.getRecordCount(openedDatabase, "storeName");
    ```

- Delete
    - Single
    ```typescript
    await IndexedDBHelper.deleteRecord(openedDatabase, "storeName", "key");
    ```
    - Multiple
    ```typescript
    const records = await IndexedDBHelper.deleteRecords(openedDatabase, "storeName", (key,value) => key === "key" || value === "value");
    ```
    - All
    ```typescript
    await IndexedDBHelper.deleteAllRecord(openedDatabase, "storeName");
    ```

## License
Released under the MIT License.
See LICENSE File.