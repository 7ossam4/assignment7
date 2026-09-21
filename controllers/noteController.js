const mongoose = require("mongoose");
const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    const { id: userId } = req.query;
    const { title, content } = req.body;

    await Note.create({ title, content, userId });

    return res.status(201).json({ message: "Note created" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { id: userId } = req.query;
    const { title, content } = req.body;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    await note.save();

    return res.status(200).json({ message: "updated", note });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.replaceNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { id: userId } = req.query;
    const { title, content } = req.body;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    note.title = title;
    note.content = content;
    await note.save();

    return res.status(200).json(note);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.updateAllTitles = async (req, res) => {
  try {
    const { id: userId } = req.query;
    const { title } = req.body;

    const result = await Note.updateMany({ userId }, { $set: { title } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json({ message: "All notes updated" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { id: userId } = req.query;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({ message: "deleted", note });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.paginateSortNotes = async (req, res) => {
  try {
    const { id: userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const { id: userId } = req.query;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getNoteByContent = async (req, res) => {
  try {
    const { id: userId, content } = req.query;

    const note = await Note.findOne({ userId, content });
    if (!note) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getNotesWithUser = async (req, res) => {
  try {
    const { id: userId } = req.query;

    const notes = await Note.find({ userId })
      .select("title userId createdAt")
      .populate("userId", "email -_id");

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.aggregateNotes = async (req, res) => {
  try {
    const { id, title } = req.query;
    const userId = new mongoose.Types.ObjectId(id);

    const match = { userId };
    if (title) {
      match.title = { $regex: title, $options: "i" };
    }

    const notes = await Note.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          title: 1,
          userId: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
    ]);

    return res.status(200).json(notes);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteAllNotes = async (req, res) => {
  try {
    const { id: userId } = req.query;

    await Note.deleteMany({ userId });

    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
