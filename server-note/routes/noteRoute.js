const express = require('express');
const {
    getNotes, createNote, deleteNote, updateCouleurNote, updateNote
} = require('../controllers/noteController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/notes', auth, getNotes);
router.post('/note', auth, createNote);
router.delete('/note/:id', auth, deleteNote);
router.patch('/note/:id', auth, updateCouleurNote);
router.patch('/noteEdit/:id', auth, updateNote);

module.exports = router;