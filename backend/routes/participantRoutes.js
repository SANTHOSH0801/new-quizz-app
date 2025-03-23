const express = require("express");
const Participant = require("../models/participantModel");

const participantRouter = express.Router();

// Add a new participant
participantRouter.post("/newparticipant", (req, res) => {
    const { username, password } = req.body;
    console.log("reched participant router")
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    Participant.create(username, password)


    return res.status(200).json({data:"response successfull"});
});


// ✅ Correct export with unique name
module.exports = participantRouter;
