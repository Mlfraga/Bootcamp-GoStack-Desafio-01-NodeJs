const express = require('express');

const routes = require('./routes');
const { request } = require('express');

let i = 0;

const app = express();

function requestsCont(request, response, next) {
    const { method, url } = request;
    i++;

    console.log(`Requisição feita: ${method} - ${url}`);
    console.log(`Total de requisições feita até agora: ${i}`);

    next()
}

app.use(express.json());
app.use(requestsCont);
app.use(routes);

app.listen(3333);