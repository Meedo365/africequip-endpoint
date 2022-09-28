const User = require("../../models/users");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getMilliseconds() + file.originalname);
    }
});
const upload = multer({ storage: storage }).single('image');
const isLoggedIn = require('../../middleware');

let routes = (app) => {
    app.get("/users", async (req, res) => {
        try {
            let users = await User.find().sort({ name: 1 })
            res.json(users)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    // to edit
    app.put('/user/:id', async (req, res) => {
        try {
            let update = req.body;
            let user = await User.updateOne({ _id: req.params.id }, update, { returnOriginal: false });
            return res.json(user)
        }
        catch (err) {
            res.status(500).send(err)
            throw err
        }
    });

    app.get("/user/:id", async (req, res) => {
        try {
            let user = await User.findOne({ _id: req.params.id });
            res.json(user)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    // update dp
    app.put('/profilepic/:id', async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err);
            } else {
                if (req.file) {
                    req.body.image = '/' + req.file.path;
                    try {
                        let update = req.body;
                        let user = await User.findOneAndUpdate({ _id: req.params.id }, update, { returnOriginal: false });
                        return res.json(user)
                    }
                    catch (err) {
                        res.status(500).send(err);
                    }
                }
            }
        });
    });

    app.delete('/user/:id', async (req, res) => {
        try {
            await User.deleteOne()
            res.json({ msg: "User Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });
}

module.exports = routes;