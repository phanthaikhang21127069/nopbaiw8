const controller = {};
const models = require("../models");

controller.showList = async (req, res) => {
    res.locals.blogs = await models.Blog.findAll({
        attributes: ["id", "title", "imagePath", "summary", "createdAt"],
        include: [
            {model: models.Comment},
            {model: models.Category},
            {model: models.Tag}
        ]
    });
    res.locals.categories = await models.Category.findAll({
        attributes: ["id", "name", "createdAt", "updatedAt"],
        include: [
            {model: models.Blog}
        ]
    });
    res.locals.tags = await models.Tag.findAll({
        attributes: ["id", "name", "createdAt", "updatedAt"]
    });

    let categories = res.locals.categories;
    let searchBlogList = req.query.search
        ? res.locals.blogs.filter((item) => item.title.toLowerCase().includes(req.query.search))
        : null;
    let cateBlogList = req.query.category
        ? res.locals.blogs.filter((item) => item.Category.id == req.query.category)
        : null;
    let tagBlogList = req.query.tag
        ? res.locals.blogs.filter((item) => item.Tags.map((tag) => tag.id == req.query.tag).includes(true))
        : null;
    blogList = (searchBlogList || cateBlogList || tagBlogList) || res.locals.blogs;

    res.render("index", {blogs: blogList, categories});
};

controller.showDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : req.params.id;
    res.locals.blog = await models.Blog.findOne({
        attributes: ['id', 'title', 'description', 'createdAt'],
        where: {id: id},
        include: [
            {model: models.Category},
            {model: models.User},
            {model: models.Tag},
        ]
    });
    res.render("details");
};

module.exports = controller