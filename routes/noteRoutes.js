const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

// IMPORTANT: specific/static routes must be declared BEFORE the dynamic
// "/:id" route, otherwise Express would treat words like "aggregate" as an id.

router.get("/paginate-sort", noteController.paginateSortNotes);
router.get("/note-by-content", noteController.getNoteByContent);
router.get("/note-with-user", noteController.getNotesWithUser);
router.get("/aggregate", noteController.aggregateNotes);

router.patch("/all", noteController.updateAllTitles);
router.put("/replace/:noteId", noteController.replaceNote);

router.post("/", noteController.createNote);
router.patch("/:noteId", noteController.updateNote);
router.delete("/:noteId", noteController.deleteNote);
router.get("/:id", noteController.getNoteById);
router.delete("/", noteController.deleteAllNotes);

module.exports = router;
