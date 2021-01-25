const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { v4: uuidv4 } = require('uuid');

const Fs = require('fs');
const CsvReadableStream = require('csv-reader');


readData = async (filePath) => {
    console.log(filePath)
    let inputStream = Fs.createReadStream(filePath, 'utf8');
    let isHeader = true;
    let userArray = [];
    let userAcountArray = [];
    let policyCategoryArray = [];
    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            //console.log('A row arrived: ', row);
            const userId = uuidv4();
            if (!isHeader) {
                let userObj = {
                    _id: userId,
                    userType: row[1] ? row[1] : '',
                    email: row[14] ? row[14] : '',
                    gender: row[15] ? row[15] : '',
                    firstName: row[16] ? row[16] : '',
                    phoneNumber: row[19] ? row[19] : '',
                    address: row[20] ? row[20] : '',
                    state: row[21] ? row[21] : '',
                    zipCode: row[22] ? row[22] : '',
                    dob: row[23] ? row[23] : ''
                }

                let userAccountObj = {
                    accountName: row[13] ? row[13] : '',
                    userId: userId
                }

                let policyCategoryObj = {
                    categoryName: row[8] ? row[8] : '',
                    userId: userId
                }

                userArray.push(userObj);
                userAcountArray.push(userAccountObj);
                policyCategoryArray.push(policyCategoryObj);
            } else {
                isHeader = false
            }
        })
        .on('end', async function (res) {
            console.log('No more rows!');

            parentPort.postMessage({ data: userArray, type: 'user' });
            parentPort.postMessage({ data: userAccountObj, type: 'userAccount' });
        });
}

readData(workerData.filePath);

