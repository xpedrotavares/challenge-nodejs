const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");
const { json } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findeRepoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findeRepoIndex === -1) {
    return response.status(400).json({ error: "Repository doesn't exists" });
  }

  const repository = { 
    id,
    title,
    url,
    techs,
    likes: repositories[findeRepoIndex].likes
  };

  repositories[findeRepoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findeRepoIndex = repositories.findIndex(repository => repository.id === id);

  if (findeRepoIndex >= 0) {
    repositories.splice(findeRepoIndex, 1);
  } else {
    return response.status(400).json({ error: "Repository doesn't exists" });
  }
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findeRepoIndex = repositories.findIndex(repository => repository.id === id);

  if (findeRepoIndex === -1) {
    return response.status(400).json({ error: "Repository doesn't exists" });
  }

  repositories[findeRepoIndex].likes++

  return response.json(repositories[findeRepoIndex]);
});

module.exports = app;
