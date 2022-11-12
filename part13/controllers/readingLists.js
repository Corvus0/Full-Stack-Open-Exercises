const router = require("express").Router();

const { tokenExtractor } = require("../util/middleware");
const { ReadingList } = require("../models");

router.post("/", async (req, res) => {
  const readingList = await ReadingList.create(req.body);
  res.json(readingList);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);
  const session = await Session.findByPk(req.decodedToken.session);
  const user = await User.findByPk(req.decodedToken.id);
  if (req.decodedToken.id === readingList.userId && session && !user.disabled) {
    readingList.read = req.body.read;
    await readingList.save();
    res.json(readingList);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;
