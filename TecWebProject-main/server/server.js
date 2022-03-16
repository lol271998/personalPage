'use strict'

let PORT = 8138;

let http     = require('http');
let url      = require('url');
let fs       = require('crypto');

let register = require('./register');
let ranking  = require('./ranking');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    },
    sse: {    
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};

const server = http.createServer(function (request, response) {
    const preq = url.parse(request.url,true);
    const pathname = preq.pathname;
    let answer = {};
    //console.log(answer.status);

    switch(request.method) {
        case 'GET':
            answer = doGet(pathname,request,response);
            break;
        case 'POST':
            answer = doPost(pathname, request);
            break;
        default : 
            answer.status = 400;
    }

    if(answer.status === undefined)
        answer.status = 200;
    if(answer.style === undefined)
        answer.style = 'plain';

    response.writeHead(answer.status, headers[answer.style]);
    if(answer.style === 'plain')
        response.end();

});
server.listen(PORT);

function doPost(pathname, request, response) {
    var answer = {};
    let body = '';
    switch(pathname) {
        case '/register':
            console.log(request.on('data'));
            request
                .on('data', (chunk) => { body += chunk; })
                .on('end', () => {
                    try {
                        query = JSON.parse(body);
                        if(query.nick === '' || query.password === '') {
                            answer.status = 400;
                        }
                        else {

                        }
                    }
                    catch(err) {  /* erros de JSON */ }
                })
                .on('error', (err) => { console.log(err.message); });
            break;
        case '/ranking':
            break;
        case '/join':
            break;
        case '/notify':
            break;
        case '/update':
            break;
        default:
            answer.status = 400;
            break;
    }
    return answer;
}

