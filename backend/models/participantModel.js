const connection = require("../dbConnection");

const Participant = {
    create: (username, password, callback) => {
        const query = "INSERT INTO participants (username, password) VALUES (?, ?)";

        connection.query(query, [username, password], (err, result) => {
            if (err) {
                console.error("Error in DB Insert:", err);
                return callback(err, null);
            }
            console.log("New participant added:", result);
            callback(null, result);
        });
    },

    getAll: (callback) => {
        const query = "SELECT * FROM participants";
        
        connection.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching participants:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }
};

module.exports = Participant;
