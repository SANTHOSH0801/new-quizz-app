const connection = require('../dbConnection');

const fetchLeaderboardData = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM leaderboard ORDER BY score DESC';
        connection.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Create a function to add a new admin
const addAdmin = (username, password) => {

    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO admins (username, password) VALUES (?, ?)';
        connection.query(query, [username, password], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = { addAdmin };
