const supabase = require('../database')
const fs = require("fs");
const cloudinary = require('../cloudinary')
module.exports = {
    getItem : async (req, res) => {
        const search = req.query.search_item
        try{
            if(search == null){
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
            }else{
                const { data: items,error } = await supabase
                    .from ('items')
                    .select('*')
                    .ilike('name', '%'+search+'%')
                if(error){
                    res.json({
                        "status_code": 400,
                        "message": "Gagal Mencari Barang",
                        "errors": error
                    })
                }else{
                    res.json({
                        "status_code": 200,
                        "message": "Berhasil Mencari Barang",
                        "data": items,
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
    getItemFilter : async (req, res) => {
        const filter  = req.query.filter
        if(filter == 'terlama'){
                const {data,error} = await supabase
                    .from('items')
                    .select('*')
                    .order('created_at', {ascending: true})
                res.json({
                    "status_code": error != true ? 200 : 400,
                    "message": error != true ? "Mengurutkan Barang Terlama" : "Gagal Mengurutkan Barang",
                    "data": error != true ? data : null,
                })
        }else if(filter == 'terbaru'){
                const {data,error} = await supabase
                    .from('items')
                    .select('*')
                    .order('created_at', {ascending: false})
                res.json({
                    "status_code": error != true ? 200 : 400,
                    "message": error != true ? "Mengurutkan Barang Terbaru" : "Gagal Mengurutkan Barang",
                    "data": error != true ? data : null,
                })
        }else if(filter == 'a-z'){
                const {data,error} = await supabase
                    .from('items')
                    .select('*')
                    .order('name', {ascending: true})

                res.json({
                    "status_code": error != true ? 200 : 400,
                    "message": error != true ? "Mengurutkan Barang A-Z" : "Gagal Mengurutkan Barang",
                    "data": error != true ? data : null,
                })
        }else{
                const {data,error} = await supabase
                    .from('items')
                    .select('*')
                    .order('name', {ascending: false})

                res.json({
                    "status_code": error != true ? 200 : 400,
                    "message": error != true ? "Mengurutkan Barang Z-A" : "Gagal Mengurutkan Barang",
                    "data": error != true ? data : null,
                })
        }
    },
    create : async (req,res) => {
        return res.render('items/create')
    },
    store  : async (req,res) => {
        const price = req.body['price'].replace(/[^0-9]/g, '')
        try{
            if(req.file == null){
                res.json({
                    "status_code" : 400,
                    "message" : "Gambar Tidak Boleh Kosong",
                    "data" : null
                })
            }else{
                const uploader = async (path) => await cloudinary.upload(path,'Images')
                const urls = []
                const file = req.file
                const {path} = file
                const newPath = await uploader(path)
                urls.push(newPath)
                fs.unlinkSync(path)
                const { data,error } = await supabase
                .from('items')
                .insert([{
                    name : req.body['name'],
                    image : urls[0].url,
                    description : req.body['description'],
                    price : price,
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
            }
        }catch(error){
            res.json({
                "status_code": 500,
                "message": "Gagal Menambah Barang",
                "data": null
            })
        }
    },
    detail : async (req,res) => {
        loggedIn = req.session.loggedIn
        const {id} = req.params 
        const { data } = await supabase
            .from('items')
            .select('*')
            .eq('id',id)
            .maybeSingle()

        const { data : balance } = await supabase
            .from('balance')
            .select('id,amount')
            .maybeSingle()
        return res.render('items/detail',{data,balance,loggedIn})
    },

    buy : async (req,res) => {
        const {id} = req.params
        const balanceId = req.body['balanceId']
        const price = req.body['item_price']
        const balance = req.body['balance']
        const updateBalance = parseInt(balance) + parseInt(price)
        try{
            const { data, error } = await supabase
                .from('items')
                .delete()
                .eq('id',id)
            if(error){
                res.json({
                    "status_code": 400,
                    "message": "Gagal Membeli Barang",
                    "errors": error
                })
            }else{
                await supabase
                    .from('balance')
                    .update({ amount: updateBalance })
                    .eq('id', balanceId)
                res.json({
                    "status_code": 200,
                    "message": "Berhasil Membeli Barang",
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
    },

}