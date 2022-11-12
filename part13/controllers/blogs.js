const router = require("express").Router();
const { Op } = require("sequelize");

const { tokenExtractor } = require("../util/middleware");
const { Blog, User, Session } = require("../models");

const authenticateUser = async (req, res, next) => {
  req.session = await Session.findByPk(req.decodedToken.session);
  req.user = await User.findByPk(req.decodedToken.id);
  next();
};

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    order: [["likes", "DESC"]],
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });

  res.json(blogs);
});

router.post("/", tokenExtractor, authenticateUser, async (req, res) => {
  if (!req.session || req.user.disabled) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const blog = await Blog.create({ ...req.body, userId: req.decodedToken.id });
  res.json(blog);
});

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.delete(
  "/:id",
  tokenExtractor,
  authenticateUser,
  blogFinder,
  async (req, res) => {
    if (
      req.decodedToken.id === req.blog.userId &&
      req.session &&
      !req.user.disabled
    ) {
      req.blog.destroy();
      res.status(204).end();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
);

router.put("/:id", blogFinder, async (req, res) => {
  req.blog.likes += 1;
  await req.blog.save();
  res.json(req.blog);
});

module.exports = router;
