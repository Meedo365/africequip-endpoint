const Product = require('../../models/products');

let routes = (app) => {

    app.post('/product', async (req, res) => {
        try {
            let product = new Product(req.body);
            await product.save()
            res.json(product)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    // get all products
    app.get('/products', async (req, res) => {
        try {
            let products = await Product.find().sort({ createdAt: -1 })
                .populate("user_id")
                .populate("location_id")
                .populate("category_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            // .populate("subCategory_id.category_id")
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    // get latest 8 products
    app.get('/product-8', async (req, res) => {
        try {
            let products = await Product.find().sort({ createdAt: -1 }).limit(8)
                .populate("user_id")
                .populate("location_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/product-sort-by-category/:id', async (req, res) => {
        try {
            let products = await Product.find({ category_id_id: req.params.id })
                .populate("user_id")
                .populate("location_id")
                .populate("category_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/product-sort-by-sub-category/:id', async (req, res) => {
        try {
            // let products = await Product.findOne({ _id: req.params.id }).sort({ createdAt: -1 })
            let products = await Product.find({ subCategory_id: req.params.id })

                .populate("user_id")
                .populate("location_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/product/:id', async (req, res) => {
        try {
            let products = await Product.findOne({ _id: req.params.id })
                .populate("user_id")
                .populate("location_id")
                .populate({
                    path: "subCategory_id",
                    populate: {
                        path: "category_id"
                    }
                })
            res.json(products)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.delete('/product/:id', async (req, res) => {
        try {
            await Product.deleteOne()
            res.json({ msg: "Product Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

};

module.exports = routes;