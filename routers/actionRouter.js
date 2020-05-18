const express = require("express");
const actionDb = require("../data/helpers/actionModel");

const router = express.Router();

router.get("/", (req, res) => {
  actionDb
    .get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  actionDb
    .get(id)
    .then(action => {
      if (!action) {
        res
          .status(404)
          .json({ message: "Action with specified ID does not exist" });
      } else {
        res.status(200).json(action);
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

router.post("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  changes.project_id = id;

  if (!changes.description || !changes.notes) {
    res
      .status(400)
      .json({ message: "Please specify both description and notes" });
  } else {
    actionDb
      .insert(changes)
      .then(newAction => {
        res.status(201).json(newAction);
      })
      .catch(err => {
        res
          .status(404)
          .json({ message: "Action with specified project ID does not exist" });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  actionDb
    .update(id, changes)
    .then(edited => {
      if (!edited) {
        res
          .status(404)
          .json({ message: "Action with specified ID does not exist" });
      } else if (!changes.description || !changes.notes) {
        res
          .status(400)
          .json({ message: "Please specify both description and notes" });
      } else {
        res.status(200).json(edited);
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

router.delete("/:id", (req, res) => {
  actionDb
    .remove(req.params.id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ message: "Action removed" });
      } else {
        res
          .status(404)
          .json({ message: "Action with specified ID does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

module.exports = router;
