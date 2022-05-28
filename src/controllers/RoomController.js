const Database = require("../db/config")

module.exports = {
    async new(req, res){

        const db = await Database()
        const pass = req.body.password

        let roomId = 0
        let isRoom = true

        while(isRoom){
            for(var i = 0; i < 6; i++){

                i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
                roomId += Math.floor(Math.random() * 10).toString()
    
            }
    
            const roomsExistIds = await db.all(`select id from rooms`)
            isRoom = roomsExistIds.some( roomsExistId => roomsExistId === roomId)
    
            if(! isRoom){
                await db.run(`INSERT INTO rooms (
                    id,
                    pass
                )VALUES(
                    ${parseInt(roomId)},
                    ${pass}
                )`)
            }
        }
        await db.close()
        res.redirect(`/room/${roomId}`)
    },

    async open(req, res){

        const db = await Database()
        const roomId = req.params.room;
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 0 `)
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} and read = 1 `)
        let isNoQuestions

        if(questions.length == 0){
            if(questionsRead.length == 0){
                isNoQuestions = true
            }
        }

        res.render("room", {roomId: roomId, questions: questions, questionsRead: questionsRead, isNoQuestions: isNoQuestions})
        await db.close()

    },

    enter(req, res){

        const roomId = req.body.roomId

        res.redirect(`/room/${roomId}`)
    }
}