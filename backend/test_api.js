const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

async function run() {
  try {
    const token = jwt.sign({ id: 4, role: 'student', roll_number: '22BCS001' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // Test slot endpoint
    try {
      const res = await axios.post('http://localhost:5000/api/slots', { date: '2026-04-07', time: '10:00' }, { headers: { Authorization: 'Bearer ' + token } });
      console.log('Slot success:', res.data);
    } catch (e) {
      console.log('Slot error:', e.response ? e.response.data : e.message);
    }

    // Test laundry endpoint
    try {
      const res2 = await axios.post('http://localhost:5000/api/student/laundry', { number_of_clothes: 2 }, { headers: { Authorization: 'Bearer ' + token } });
      console.log('Laundry success:', res2.data);
    } catch (e) {
      console.log('Laundry error:', e.response ? e.response.data : e.message);
    }
  } catch (e) {
      console.log('Global Error:', e);
  }
}
run();
