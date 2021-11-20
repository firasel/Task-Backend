const express = require("express");
const AddTask = require("../controller/Task/AddTask");
const GetTask = require("../controller/Task/GetTask");
const UpdateTask = require("../controller/Task/UpdateTask");
const router = express.Router();
const LoginGuard = require("../middleware/LoginGuard");

// Add a task
router.post("/add", LoginGuard, AddTask);
// Update task status
router.post("/update", LoginGuard, UpdateTask);
// Get task
router.get("/get", LoginGuard, GetTask);

module.exports = router;
