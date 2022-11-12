const router = require("express").Router();

const { tokenExtractor } = require("../util/middleware");
const { Session } = require("../models");

router.delete("/", tokenExtractor, async (req, res) => {
  const session = await Session.findByPk(req.decodedToken.session);
  if (session) {
    await session.destroy();
  }
  res.status(204).end();
});

module.exports = router;
