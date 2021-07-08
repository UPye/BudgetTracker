// Create a variable to hold the db connection
let db;
// Establish connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// Event will emit, if the database version changes. (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // Save reference to the database 
    const db = event.target.result;
    // Create an object store (table) called `budget_item`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('budget_item', { autoIncrement: true });
  };

// If successful 
request.onsuccess = function(event) {
    // When db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // Check if app is online, if yes run updateBudget() function to send all local db data to api
    if (navigator.onLine) {

      updateBudget();
    }
  };
  
  request.onerror = function(event) {
    // Log error here
    console.log(event.target.errorCode);
  };

// This function will be executed if we attempt to submit a new budget item and there's no internet connection
function saveRecord(record) {
    // Open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['budget_item'], 'readwrite');
  
    // Access the object store for `budget_item`
    const budgetObjectStore = transaction.objectStore('budget_item');
  
    // Add record to your store with add method
    budgetObjectStore.add(record);
  }

  function updateBudget() {
    // Open a transaction on your db
    const transaction = db.transaction(['budget_item'], 'readwrite');
  
    // Access your object store
    const budgetObjectStore = transaction.objectStore('budget_item');
  
    // Get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();
  
// Upon a successful .getAll() execution, run this function
getAll.onsuccess = function() {
    // If there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // Open one more transaction
          const transaction = db.transaction(['budget_item'], 'readwrite');
          // Access the budget_item object store
          const budgetObjectStore = transaction.objectStore('budget_item');
          // Clear all items in your store
          budgetObjectStore.clear();

          alert('All saved budget items has been submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}


// Listen for app to connect back to the internet
window.addEventListener('online', updateBudget);