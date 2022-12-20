const express = require('express')
const { body, validationResult } = require('express-validator');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')

// Route 1: Get all the notes using get"api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.messgae);
        res.status(500).send("Internal Seerver Error")
    }

})

// Route2: Add a new notes using post "api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be minimum of 5 character').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body
        // If there are error return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save()
        res.json(savednote)
    } catch (error) {
        console.log(error.messgae);
        res.status(500).send("Internal Seerver Error")
    }
})


// Route3: Update an existing notes notes using put "api/notes/updatenote". Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    //Creeate a new note object
    try {
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.log(error.messgae);
        res.status(500).send("Internal Seerver Error")
    }
})

// Route4: Delete an existing notes notes using post "api/notes/deletenote". Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    // Find the note to be delete and delete it
    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        // Allow deletion only if user owns the note
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note })
    } catch (error) {
        console.log(error.messgae);
        res.status(500).send("Internal Seerver Error")
    }
})

module.exports = router