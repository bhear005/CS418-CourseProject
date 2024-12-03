import { expect } from 'chai';
import supertest from 'supertest';
import app from '../app.js';

// Test to check API endpoint for gathering user information
describe('Get all data from user_information table', () => {
    it('Should return status 200 and JSON content type without user input.', async function(){
        var response = await supertest(app).get('/user');
        expect(response.status).to.equal(200);
        expect(response.headers['content-type']).to.match(/json/);
    });
});

// Test to check API endpoint for login
describe('Check if user is an admin', () => {
    it('Should return status 200 and JSON content type if login credentials are correct', async function(){
        var response = await supertest(app).post('/user/login').send({
            Email: "brendan.hearrell@gmail.com",
            Password: "password"
        })
        expect(response.status).to.equal(200);
        expect(response.headers['content-type']).to.match(/json/);
    })
});

// Test to check API endpoint for getting advising history based on student email and term
describe('Get advising history based on student email and term', () => {
    it('Should return status 200 and JSON content type based on user email and current selected term', async function(){
        var response = await supertest(app).get('/advisinghistory/bhear005@odu.edu/Fall 2024');
        expect(response.status).to.equal(200);
        expect(response.headers['content-type']).to.match(/json/);

    });
});
