module.exports = {
    index : async (req, res) => {
        loggedIn = req.session.loggedIn
        req.session.user === undefined ? studentId = '' : studentId = req.session.user['student_id']
        res.render('index',{loggedIn,studentId});
    }
}
