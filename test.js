var http = require('http');
var assert = require('assert');

var server = require('./app');

describe('Server test', function () {


    describe('/', function () {
        it('Testar servern', function (done) {
            http.get('http://localhost:8000', function (response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
    });
});