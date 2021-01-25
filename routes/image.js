const storageService = require('../services/storageService.js');
const storeImage = storageService.storeImage.single('file');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const User = require('../model/User');
const UserAccount = require('../model/UserAccount');
const Agent = require('../model/Agent');
const PolicyCategory = require('../model/PolicyCategory');
const PolicyCarrier = require('../model/PolicyCarrier');
const PolicyInfo = require('../model/PolicyInfo');

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

                            res.status(200).json({ msg: 'Data processed successfully', filename: req.file.key });
                        }
                    })
                    worker.on('message', async (message) => {
                        console.log("incoming", message.type, message.data.length)
                        if (message.type === 'user') {
                            await User.insertMany(message.data)
                        }
                        if (message.type === 'userAccount') {
                            await UserAccount.insertMany(message.data)
                        }
                        if (message.type === 'agents') {
                            await Agent.insertMany(message.data)
                        }
                        if (message.type === 'policyCategory') {
                            await PolicyCategory.insertMany(message.data)
                        }
                        if (message.type === 'company') {
                            await PolicyCarrier.insertMany(message.data)
                        }
                        if (message.type === 'policyInfo') {
                            await PolicyInfo.insertMany(message.data)
                        }
                    });
                }
            } catch (err) {
                console.log(err)
            }

        })
    });

};
