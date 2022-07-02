const supabase = require('../database')
module.exports = {
    index : async (req, res) => {
      const { data, error } = await supabase
        .from('balance')
        .select('amount')
        .maybeSingle()
        amount = String(data.amount).replace(/(.)(?=(\d{3})+$)/g,'$1.')
        loggedIn = req.session.loggedIn
        res.render('index',{loggedIn,amount});
    }
}
