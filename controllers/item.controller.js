const supabase = require('../database')

module.exports = {
    getItem : async (req, res) => {
        try{
            const { data: items, error } = await supabase
                .from('items')
                .select('*')
            if(error){
                res.json({
                    "status_code": 400,
                    "message": "Gagal Menampilkan Barang",
                    "errors": error
                })
            }else{
                res.json({
                    "status_code": 200,
                    "message": "Berhasil Menampilkan Barang",
                    "data": items,
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
    create : async (req,res) => {
        return res.render('items/create')
    },
    store  : async (req,res) => {
        try{
            const { data,error } = await supabase
            .from('items')
            .insert([{
                name : req.body['name'],
                image : req.file['filename'],
                description : req.body['description'],
                price : req.body['price'].replace(".",""),
            }])
            if(error){
                res.json({
                    "status_code": 400,
                    "message": "Gagal Menambah Barang",
                    "errors": error
                })
            }else{
                res.json({
                    "status_code": 200,
                    "message": "Berhasil Menambah Barang",
                    "data": data
                })
            }
        }catch(err){
                res.json({
                    "status_code": 500,
                    "message": error,
                    "data": null
                })
        }
    }
}