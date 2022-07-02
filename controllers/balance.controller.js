const supabase = require('../database')
module.exports = {
    index : async (req, res) => {
        const { data, error } = await supabase
        .from('balance')
        .select('amount')
        .maybeSingle()
        amount = data.amount
        return res.render('balance/index',{amount})
    },
    withdraw : async (req,res) => {

    }
}
