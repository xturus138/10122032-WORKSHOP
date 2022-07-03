const supabase = require('../database')
module.exports = {
    index : async (req, res) => {
        const { data, error } = await supabase
        .from('balance')
        .select('id,amount')
        .maybeSingle()
        return res.render('balance/index',{data})
    },
    getBalance : async(req,res) => {
        try{
            const { data, error } = await supabase
            .from('balance')
            .select('id,amount')
            .maybeSingle()
            if(error){
                res.json({
                    "status_code": 400,
                    "message": "Gagal Menampilkan Saldo",
                    "errors": error
                })
            }else{
                return res.json({
                    "status_code": 200,
                    "message": "Berhasil Mendapatkan Saldo",
                    "data": data
                })
            }
        }catch{
            res.json({
                "status_code": 500,
                "message": "Gagal",
                "data": null,
                "error": error
            })
        }
    },
    withdraw : async (req,res) => {
        const {id} = req.params;
        const balance = req.body['balance']
        const amount = req.body['amount']
        const updateBalance = parseInt(balance) - parseInt(amount)
        try{
            if(parseInt(amount) > parseInt(balance)){
                return res.json({
                    "status_code": 400,
                    "message": "Saldo Tidak Mencukupi",
                    "data": null
                })
            }else{
                const { data, error } = await supabase
                .from('balance')
                .update({ amount: updateBalance })
                .eq('id', id)

                if(error){
                    res.json({
                        "status_code": 400,
                        "message": "Gagal Mengambil Uang",
                        "errors": error
                    })
                }else{
                    res.json({
                        "status_code": 200,
                        "message": "Berhasil Mengambil Uang",
                        "data": data
                    })
                }
            }
        }catch(error){
            res.json({
                "status_code": 500,
                "message": "Gagal",
                "data": null,
                "error": error
            })
        }
    },
    deposit : async (req,res) => {
        const {id} = req.params;
        const balance = req.body['balance']
        const amount = req.body['amount']
        const updateBalance = parseInt(balance) + parseInt(amount)
        try{
            const { data, error } = await supabase
            .from('balance')
            .update({ amount: updateBalance })
            .eq('id', id)

            if(error){
                res.json({
                    "status_code": 400,
                    "message": "Gagal Menyimpan Uang",
                    "errors": error
                })
            }else{
                res.json({
                    "status_code": 200,
                    "message": "Berhasil Menyimpan Uang",
                    "data": data
                })
            }
        }catch(error){
            res.json({
                "status_code": 500,
                "message": "Gagal",
                "data": null,
                "error": error
            })
        }
    }
}
