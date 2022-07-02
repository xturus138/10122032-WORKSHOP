module.exports = {
    index : async (req, res) => {
        loggedIn = req.session.loggedIn
        res.render('index',{loggedIn});
    }
}
