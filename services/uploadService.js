const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { v4: uuidv4 } = require('uuid');

const Fs = require('fs');
const CsvReadableStream = require('csv-reader');


readData = async (filePath) => {
    console.log(filePath)
    let inputStream = Fs.createReadStream(filePath, 'utf8');
    let isHeader = true;
    let data = [];
    let userArray = [];
    let userAccountArray = [];
    let policyCategoryArray = [];
    let agentsArray = [];
    let policyInfoArray = [];
    let companyArray = [];

    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            //console.log('A row arrived: ', row);
            if (!isHeader) {
                data.push(row);
            } else {
                isHeader = false
            }
        })
        .on('end', async function (res) {
            console.log('No more rows!');

            let uniqueCategoryObject = {}
            let uniqueCompanyObject = {}
            let uniqueAgentName = {}

            for (let row of data) {
                const userId = uuidv4();

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
                    _id: uuidv4(),
                    accountName: row[13] ? row[13] : '',
                    userId: userId
                }

                const agentName = row[0] ? row[0] : '';
                const agentId = uniqueAgentName[agentName] ? uniqueAgentName[agentName] : uuidv4();
                if (!uniqueAgentName[agentName]) {
                    uniqueAgentName[agentName] = agentId;
                    let agentObj = {
                        _id: agentId,
                        agentName: agentName
                    }
                    agentsArray.push(agentObj);
                }

                const categoryName = row[9] ? row[9] : '';
                const policyCategoryId = uniqueCategoryObject[categoryName] ? uniqueCategoryObject[categoryName] : uuidv4();
                if (!uniqueCategoryObject[categoryName]) {
                    uniqueCategoryObject[categoryName] = policyCategoryId;
                    let policyCategoryObj = {
                        _id: policyCategoryId,
                        categoryName: categoryName
                    }
                    policyCategoryArray.push(policyCategoryObj);
                }

                const companyName = row[8] ? row[8] : '';
                const companyId = uniqueCompanyObject[companyName] ? uniqueCompanyObject[companyName] : uuidv4();
                if (!uniqueCompanyObject[companyName]) {
                    uniqueCompanyObject[companyName] = companyId;
                    let companyObj = {
                        _id: companyId,
                        companyName: companyName
                    }
                    companyArray.push(companyObj);
                }

                let policyInfoObj = {
                    _id: uuidv4(),
                    policyNumber: row[4] ? row[4] : '',
                    polictStartDate: row[10] ? row[10] : '',
                    policyEndDate: row[11] ? row[11] : '',
                    categoryId: policyCategoryId,
                    companyId: companyId,
                    userId: userId
                }

                userObj['agentId'] = agentId;

                userArray.push(userObj);
                userAccountArray.push(userAccountObj);
                policyInfoArray.push(policyInfoObj);
            }

            parentPort.postMessage({ data: userArray, type: 'user' });
            parentPort.postMessage({ data: userAccountArray, type: 'userAccount' });
            parentPort.postMessage({ data: agentsArray, type: 'agents' });
            parentPort.postMessage({ data: policyCategoryArray, type: 'policyCategory' });
            parentPort.postMessage({ data: companyArray, type: 'company' });
            parentPort.postMessage({ data: policyInfoArray, type: 'policyInfo' });
        });
}

readData(workerData.filePath);

