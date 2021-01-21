const storageService = require('../services/storageService.js');
const storeImage = storageService.storeImage.single('file')
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const User = require('../model/User');

module.exports.setRoutes = function (app) {
    let status;

    saveData = async (data) => {
        try {
            console.log("alibaba", data.length);
            status = data.length
            //for (let row of data) {
            //let status = await User.insertMany(data);
            //console.log(status)
            //}
        } catch (err) {
            console.log(err)
        }
    }

    app.post('/uploadCSV', async (req, res) => {

        storeImage(req, res, async (err, data) => {
            if (err) {
                console.log(err)
                return res.status(422).send({ err: err.message });
            }
            console.log(req.file);

            try {
                let inputStream = Fs.createReadStream(req.file.path, 'utf8');
                let isHeader = true;
                let data = [];
                inputStream
                    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
                    .on('data', function (row) {
                        //console.log('A row arrived: ', row);
                        if (!isHeader) {
                            let obj = {
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

                            data.push(obj);
                        } else {
                            isHeader = false
                        }
                    })
                    .on('end', async function (res) {
                        console.log('No more rows!');
                        if (isMainThread) {
                            console.log("manojojoj", data.length)

                            const threadCount = 2;
                            const threads = new Set();
                            console.log(`Running with ${threadCount} threads...`);
                            const range = 300;
                            for (let i = 0; i < data.length; i += range) {
                                let newArr = data.slice(i, i + range);
                                console.log(newArr.length);
                                threads.add(new Worker(__filename, { workerData: { data: newArr } }));
                            }
                            console.log(threads.size)
                            //threads.add(new Worker(__filename, { workerData: { start, range: range + ((max - min + 1) % threadCount)}}));
                            for (let worker of threads) {
                                worker.on('error', (err) => { throw err; });
                                worker.on('exit', () => {
                                    threads.delete(worker);
                                    console.log(`Thread exiting, ${threads.size} running...`);
                                    if (threads.size === 0) {
                                        console.log(status);
                                    }
                                })
                                worker.on('message', (msg) => {
                                    status = status.concat(msg);
                                });
                            }
                        } else {
                            console.log("Kumar")
                            saveData(workerData.data);
                            parentPort.postMessage(status);
                        }

                    });
            } catch (err) {
                console.log(err)
            }

            res.status(200).json({ msg: 'Image saved successfully', filename: req.file.key });

        })
    });

};
