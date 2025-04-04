require('dotenv').config();
const axios = require('axios');

const domain = 'dev-tkt78bh86bqvi2zu.us.auth0.com';
const managementApiToken = 'https://dev-tkt78bh86bqvi2zu.us.auth0.com/api/v2/'; // Obtain this token from Auth0

const users = [
  {
    email: "a@example.com",
    password: "12345",
    connection: "Username-Password-Authentication",
    name: "A",
  }
];

async function importUsers() {
  try {
    const response = await axios.post(`https://${domain}/api/v2/jobs/users-imports`, {
      users: users,
      connection_id: 'con_2C0QL4MC0BTHqjQ3' // Replace with your connection ID
    }, {
      headers: {
        Authorization: `Bearer ${managementApiToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Import Job Created:', response.data);
  } catch (error) {
    console.error('Error importing users:', error.response.data);
  }
}

importUsers();