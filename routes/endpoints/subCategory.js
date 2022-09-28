const SubCategory = require('../../models/sub-category');

let routes = (app) => {

    app.post('/sub-category', async (req, res) => {
        try {
            let sub_category = new SubCategory(req.body);
            await sub_category.save()
            res.json(sub_category)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/sub-category', async (req, res) => {
        try {
            let sub_category = await SubCategory.find()
                .populate("category_id")
            res.json(sub_category)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/sub-category/:id', async (req, res) => {
        try {
            let sub_category = await SubCategory.findOne({ _id: req.params.id })
                .populate("category_id")
            res.json(sub_category)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.delete('/sub-category/:id', async (req, res) => {
        try {
            await SubCategory.deleteOne()
            res.json({ msg: "Sub-Category Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

};

module.exports = routes;