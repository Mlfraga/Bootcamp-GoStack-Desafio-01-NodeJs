const express = require('express');
const { uuid, isUuid } = require('uuidv4')
const { request, response } = require('express');

const projects = [];

const routes = express.Router();

function authenticateUuid(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response
            .status(404)
            .json({ error: "project ID is not valid." })
    }

    next();
}

routes.post('/projects', function storeProject(request, response) {
    const { title } = request.body;

    const project = {
        id: uuid(),
        title: title,
        tasks: []
    }

    projects.push(project);

    return response
        .status(200)
        .json(project)
});

routes.get('/projects', function listProjects(request, response) {
    return response
        .status(200)
        .json(projects)
});

routes.put('/projects/:id', authenticateUuid, function updateProject(request, response) {
    const { title } = request.body;
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response
            .status(404)
            .json({ error: "project was not found." })
    }

    projects[projectIndex].title = title;

    return response
        .status(200)
        .json(projects[projectIndex])
});

routes.delete('/projects/:id', authenticateUuid, function deleteProject(request, response) {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response
            .status(404)
            .json({ error: "Project was not found." })
    }

    projects.splice(projectIndex, 1);

    return response
        .status(200)
        .json({ message: "Project was was successfully deleted " })
});

routes.post('/tasks/:id', authenticateUuid, function createTasks(request, response) {
    const { id } = request.params;
    const { task } = request.body;

    const project = projects.find(project => project.id === id);

    if (!project) {
        return response
            .status(404)
            .json({ error: "Project was not found." })
    }


    project.tasks.push(task);

    return response
        .status(200)
        .json(project);

});

module.exports = routes;
