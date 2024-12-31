// bugSolution.js
const database = firebase.database();

function writeDataWithRetry(data) {
  return new Promise((resolve, reject) => {
    const maxRetries = 5;
    let retries = 0;
    const retryDelay = 1000; // 1 second

    const attemptWrite = () => {
      database.ref('/').push(data)
        .then(() => resolve())
        .catch(error => {
          retries++;
          if (retries < maxRetries && error.code === 'network/offline') {
            console.log(`Network error. Retrying in ${retryDelay}ms...`);
            setTimeout(attemptWrite, retryDelay * retries);
          } else {
            reject(error);
          }
        });
    };
    attemptWrite();
  });
}

// Example usage:
writeDataWithRetry({ message: 'Hello, Firebase!' })
  .then(() => console.log('Data written successfully!'))
  .catch(error => console.error('Failed to write data:', error));