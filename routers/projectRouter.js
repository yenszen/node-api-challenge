const express = require("express");
const projectDb = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  projectDb
    .get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  projectDb
    .get(id)
    .then(project => {
      // console.log(project);
      if (project) {
        res.status(200).json(project);
      } else {
        res
          .status(404)
          .json({ message: "Project with specified ID does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

router.get("/:id/actions", (req, res) => {
  const { id } = req.params;

  projectDb
    .getProjectActions(id)
    .then(actions => {
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res.status(404).json({
          message:
            "Project with specified ID does not exist / contain any actions"
        });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

router.post("/", (req, res) => {
  const changes = req.body;

  if (!changes.name || !changes.description) {
    res
      .status(400)
      .json({ message: "Please specify both name and description" });
  } else {
    projectDb
      .insert(changes)
      .then(newProject => {
        res.status(201).json(newProject);
      })
      .catch(err => {
        res.status(500).json({ message: "Database error" });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  projectDb
    .update(id, changes)
    .then(edited => {
      if (!edited) {
        res
          .status(404)
          .json({ message: "Project with specified ID does not exist" });
      } else if (!changes.name || !changes.description) {
        res
          .status(400)
          .json({ message: "Please specify both name and description" });
      } else {
        res.status(200).json(edited);
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

router.delete("/:id", (req, res) => {
  projectDb
    .remove(req.params.id)
    .then(deleted => {
      if (!deleted) {
        res
          .status(404)
          .json({ message: "Project with specified ID does not exist" });
      } else {
        res.status(200).json({ message: "Project removed" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Database error" });
    });
});

module.exports = router;
