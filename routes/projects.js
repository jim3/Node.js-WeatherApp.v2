const express = require("express");
const router = express.Router();

// Important to remember, the path is `/` and not `/projects`
router.get("/", async (req, res, next) => {
    res.render("projects", { title: "Projects" });
});

module.exports = router;
