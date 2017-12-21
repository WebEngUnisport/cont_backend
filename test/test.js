//-----SETUP-----
// install ava as global package
// execute:
// npm install --global ava

//all test in the "test" folder will get executed
//you can execute the files via npm test in the route folder

import test from 'ava';
import server from '../app';
import schemas from '../rounting/helper/respSchemas';

const Joi = require('joi');
let fs = require('fs');

let courseId;
let uniId = 'FRI';
let category = 'ONE';
let from = new Date('2017-09-20T15:15:00.000Z');
let to = new Date('2017-09-20T16:45:00.000Z');

test.before('before', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/university/'+ uniId +'/category/' + category +'?from='+from.toISOString()+'&to='+to.toISOString()
    });

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);

            courseId = resp[0]._id;
        });
});

test('test /course/{id}', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/course/'+courseId
    });

    let schema = schemas.course;

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }

        });
});

test('test /university/{university_id}/course/{course_id}', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/university/'+ uniId +'/course/'+courseId
    });

    let schema = schemas.course;

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp[0], schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }

        });
});

test('test /universities', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/universities'
    });

    let schema = Joi.array().items(schemas.university);

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }

        });
});

test('test /categories', t => {
    const request = Object.assign({}, {
        method: 'GET',
        url: '/categories'
    });

    let schema = Joi.array().items(schemas.category);

    return server.inject(request)
        .then(response => {
            let resp = JSON.parse(response.payload);
            let test = Joi.validate(resp, schema);

            if(test.error === null){
                t.is(response.statusCode, 200);
            } else {
                console.error(test);
                t.false(true, "Schema is not fitting the response:\n");
            }

        });
});
