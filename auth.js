const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
    audience: 'https://searSchool.com/api',
    issuerBaseURL: 'https://dev-tkt78bh86bqvi2zu.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

module.exports = jwtCheck;

//this file use `express-oauth2-jwt-bearer` validates JWTs issued by Auth0