const express = require('express');
const Joi = require('joi');
const monk = require('monk');

const router = express.Router();

const db = require('../db/connection');
const notes = db.get('notes');

const schema = Joi.object({
  title: Joi.string().max(100).trim().required(),
  note: Joi.string().trim().required(),
});

router.get('/', (req, res) => {
  notes.find().then((notes) => {
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

router.delete('/', (req, res, next) => {
  const id = monk.id(req.body._id);
  const note = {
    _id: id,
  };
  notes
    .remove(note)
    .then((note) => {
      res.json(note);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
