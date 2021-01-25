let moment = require('moment');
let redisService = require('../services/redisService');
let Messages = require('../model/mesage');

module.exports.setRoutes = function (app) {
    app.post("/setMessage", async (req, res) => {
        try {

            let date = req.body.date;
            let time = req.body.time;

            let requestDate = moment(`${date} ${time}`).format('YYYY-MM-DD HH:mm');
            let currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm');

            let duration = moment.duration(moment(requestDate, 'YYYY-MM-DD HH:mm').diff(moment(currentTime, 'YYYY-MM-DD HH:mm')));

            let seconds = duration.asSeconds();

            if (seconds < 0) {
                res.status(422).json({ msg: 'Invalid time provided' });
                return;
            }

            await redisService.cache.setAsync(`key$$$message$$$${req.body.message}`, req.body.message, 'EX', seconds)

            res.status(200).json({ msg: 'Event set successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ err: 'Date format must be YYYY-MM-DD and time format must be HH:mm' });
        }
    });

};


module.exports.fireEvent = async function (key) {
    console.log(key)
    let keyData = key.split('$$$');
    if (keyData.length === 3) {
        let message = keyData[2];
        await new Messages({ message }).save()
    }
}