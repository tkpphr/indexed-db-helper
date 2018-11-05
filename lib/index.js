"use strict";
/*!
 *  indexed-db-helper
 *  Copyright (c) 2018 tkpphr
 *  Released under the MIT License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function openDatabase(dbName, storeNames) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var request = window.indexedDB.open(dbName);
                    request.onsuccess = function (event) {
                        var db = event.target.result;
                        if (db) {
                            resolve(db);
                        }
                        else {
                            reject("can't open " + dbName);
                        }
                    };
                    request.onerror = function () {
                        reject("can't open " + dbName);
                    };
                    request.onblocked = function () {
                        reject(dbName + " is blocked.");
                    };
                    request.onupgradeneeded = function (event) {
                        var db = event.target.result;
                        for (var _i = 0, storeNames_1 = storeNames; _i < storeNames_1.length; _i++) {
                            var storeName = storeNames_1[_i];
                            db.createObjectStore(storeName);
                        }
                    };
                })];
        });
    });
}
exports.openDatabase = openDatabase;
function deleteDatabase(dbName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var request = indexedDB.deleteDatabase(dbName);
                    request.onsuccess = function () {
                        resolve();
                    };
                    request.onerror = function () {
                        reject("can't delete " + dbName);
                    };
                    request.onblocked = function () {
                        reject(dbName + " is blocked.");
                    };
                })];
        });
    });
}
exports.deleteDatabase = deleteDatabase;
function getRecordCount(db, storeName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var transaction = db.transaction(storeName, "readonly");
                    var request = transaction.objectStore(storeName).count();
                    request.onsuccess = function (event) {
                        var count = event.target.result;
                        if (count) {
                            resolve(count);
                        }
                        else {
                            resolve(0);
                        }
                    };
                    request.onerror = function () { return reject("can't get record count from " + storeName + "."); };
                })];
        });
    });
}
exports.getRecordCount = getRecordCount;
function getRecord(db, storeName, key) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var transaction = db.transaction(storeName, "readonly");
                    var request = transaction.objectStore(storeName).get(key);
                    request.onsuccess = function (event) {
                        var record = event.target.result;
                        if (record) {
                            resolve(record);
                        }
                        else {
                            resolve(undefined);
                        }
                    };
                    request.onerror = function () {
                        reject("can't get " + key + " from " + storeName + ".");
                    };
                })];
        });
    });
}
exports.getRecord = getRecord;
function getRecords(db, storeName, where) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var records = {};
                    var transaction = db.transaction(storeName, "readonly");
                    transaction.oncomplete = function () { return resolve(records); };
                    var request = transaction.objectStore(storeName).openCursor();
                    request.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var key = "" + cursor.key;
                            var value = cursor.value;
                            if (where(key, value)) {
                                records[key] = value;
                            }
                            cursor.continue();
                        }
                    };
                    request.onerror = function () { return reject("can't get records from " + storeName); };
                })];
        });
    });
}
exports.getRecords = getRecords;
function getAllRecord(db, storeName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, getRecords(db, storeName, function (_key, _value) { return true; })];
        });
    });
}
exports.getAllRecord = getAllRecord;
function putRecord(db, storeName, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var transaction = db.transaction(storeName, "readwrite");
                    transaction.oncomplete = function () {
                        resolve();
                    };
                    transaction.onerror = function () { return reject("can't put (" + key + ": " + value + ") to " + storeName + "."); };
                    transaction.objectStore(storeName).put(value, key);
                })];
        });
    });
}
exports.putRecord = putRecord;
function putRecords(db, storeName, keys, valueGetter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var transaction = db.transaction(storeName, "readwrite");
                    transaction.onerror = function () { return reject("can't put records to " + storeName + "."); };
                    transaction.oncomplete = function () {
                        resolve();
                    };
                    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        var key = keys_1[_i];
                        var value = valueGetter(key);
                        transaction.objectStore(storeName).put(value, key);
                    }
                })];
        });
    });
}
exports.putRecords = putRecords;
function deleteRecord(db, storeName, key) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var transaction = db.transaction(storeName, "readwrite");
                    transaction.oncomplete = function () {
                        resolve();
                    };
                    transaction.onerror = function () { return reject(storeName + "'s " + key + " can't delete."); };
                    transaction.objectStore(storeName).delete(key);
                })];
        });
    });
}
exports.deleteRecord = deleteRecord;
function deleteRecords(db, storeName, where) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var transaction = db.transaction(storeName, "readwrite");
                    transaction.oncomplete = function () { return resolve(); };
                    var objectStore = transaction.objectStore(storeName);
                    var request = objectStore.openCursor();
                    request.onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            var key = "" + cursor.key;
                            var value = cursor.value;
                            if (where(key, value)) {
                                objectStore.delete(key);
                            }
                            cursor.continue();
                        }
                    };
                    request.onerror = function () { return reject("can't delete records from " + storeName); };
                })];
        });
    });
}
exports.deleteRecords = deleteRecords;
function deleteAllRecord(db, storeName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var transaction = db.transaction(storeName, "readwrite");
                    transaction.oncomplete = function () {
                        resolve();
                    };
                    transaction.onerror = function () { return reject(storeName + "'s records can't delete."); };
                    transaction.objectStore(storeName).clear();
                })];
        });
    });
}
exports.deleteAllRecord = deleteAllRecord;
