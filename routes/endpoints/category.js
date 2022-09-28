const Category = require('../../models/category');

let routes = (app) => {

    app.post('/category', async (req, res) => {
        try {
            let category = new Category(req.body);
            await category.save()
            res.json(category)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/category', async (req, res) => {
        try {
            let category = await Category.find()
            res.json(category)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.delete('/category/:id', async (req, res) => {
        try {
            await Category.deleteOne()
            res.json({ msg: "Category Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

};

module.exports = routes;