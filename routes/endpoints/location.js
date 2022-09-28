const Location = require('../../models/location');

let routes = (app) => {

    app.post('/location', async (req, res) => {
        try {
            let location = new Location(req.body);
            await location.save()
            res.json(location)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/location', async (req, res) => {
        try {
            let location = await Location.find()
            res.json(location)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.delete('/location/:id', async (req, res) => {
        try {
            await Location.deleteOne()
            res.json({ msg: "Location Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

};

module.exports = routes;