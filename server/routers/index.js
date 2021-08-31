const express = require('express');
const Joi = require('joi');

const router = express.Router();

const db = require('../db/connection');
const notes = db.get('notes');

const schema = Joi.object({
  title: Joi.string().max(100).trim().required(),
  note: Joi.string().trim().required(),
});

router.get('/', (req, res) => {
  notes((notes) => {
    console.log(notes);
    res.json(notes);
  });
});

router.post('/', (req, res, next) => {
  const result = schema.validate(req.body);
  if (!result.hasOwnProperty('error')) {
    const note = {
      ...req.body,
    };
    notes.insert(note).then((note) => {
      res.json(note);
    });
  } else {
    const error = new Error(result.error);
    res.status(422);
    next(error);
  }
});

router.delete('/', (req, res) => {
  const note = {
    _id: req.body._id,
  };
  notes.remove(note).then((note) => {
    console.log(req.body);
    res.json(note);
  });
  res.status(410);
});

module.exports = router;
