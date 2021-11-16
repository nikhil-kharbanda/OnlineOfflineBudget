let db;

const request = indexedDB.open("budget, 1");

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("budget", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Error: " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["budget"], "readwrite");
  const store = transaction.objectStore("budget");
  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["budget"], "readwrite");
  const store = transaction.objectStore("budget");
  const getAll = store.getAll;

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(() => {
          const transaction = db.transaction(['budget'] , 'readwrite');
          const store = transaction.objectStore('budget')

          store.clear
      })
    }
  };
}

window.addEventListener('online', checkDatabase());