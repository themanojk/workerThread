const storageService = require('../services/storageService.js');
const storeImage = storageService.storeImage.single('file')
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const User = require('../model/User');
module.exports.setRoutes = function (app) {

    app.post('/uploadCSV', async (req, res) => {

        storeImage(req, res, async (err, data) => {
            if (err) {
                console.log(err)
                return res.status(422).send({ err: err.message });
            }
            console.log(req.file);

            try {
                const threads = new Set();
                threads.add(new Worker('./services/uploadService.js', { workerData: { filePath: req.file.path } }));

                console.log(threads.size)
                for (let worker of threads) {
                    worker.on('error', (err) => { throw err; });
                    worker.on('exit', () => {
                        threads.delete(worker);
                        console.log(`Thread exiting, ${threads.size} running...`);
                        if (threads.size === 0) {
                            console.log("finished");
                        }
                    })
                    worker.on('message', async (data) => {
                        console.log("incoing", data)
                        let status = await User.insertMany(data);
                    });
                }
            } catch (err) {
                console.log(err)
            }

            res.status(200).json({ msg: 'Image saved successfully', filename: req.file.key });

        })
    });

};
