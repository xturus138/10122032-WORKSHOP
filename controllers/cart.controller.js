const supabase = require('../database')
module.exports = {
    index : async (req,res) => {
        loggedIn = req.session.loggedIn === true ? true : false
        req.session.user === undefined ? studentId = '' : studentId = req.session.user['student_id']
        const id = req.params.id
            const {data : cart} = await supabase
                .from('cart')
                .select(`
                    cart_item (
                        id,
                        items (
                            id,name,price,image,description
                        )
                    )
                `)
                .eq('student_id',id)
            cartItems = cart.length > 0 ? cart[0].cart_item : []
            res.render('cart',{loggedIn,studentId,cartItems})
    },
    addToCart : async(req,res) => {
        try{
                const {data : cart} = await supabase
                    .from('cart')
                    .select('id')
                    .eq('student_id',req.session.user['student_id'])
                                        
                if(cart.length > 0){
                    const {data : cartItem} = await supabase
                    .from('cart_item')
                        .select('id')
                        .eq('item_id',req.body.item_id)
                        .eq('cart_id',cart[0].id)
                    
                    if(cartItem.length > 0 ){
                        res.json({
                            status_code : 400,
                            message : 'Barang Sudah Ada di Keranjang',
                            data : null
                        })
                    }else{
                        const {data} = await supabase
                        .from('cart_item')
                        .insert({
                            item_id : req.body.item_id,
                            cart_id : cart[0].id
                        })
                        res.json({
                            status_code : 200,
                            message : 'Berhasil menambah keranjang',
                            data : data
                        })
                    }
                }else{
                    const {data : data } = await supabase
                        .from('cart')
                        .insert({
                            student_id : req.session.user['student_id']
                        })

                    const {data : getCart} = await supabase
                        .from('cart')
                        .select('id')
                        .eq('student_id',req.session.user['student_id'])

                    const {data : cartItem} = await supabase
                        .from('cart_item')
                            .select('id')
                            .eq('item_id',req.body.item_id)
                            .eq('cart_id',getCart[0].id)
                        
                    if(cartItem.length > 0 ){
                        res.json({
                            status_code : 400,
                            message : 'Barang Sudah Ada di Keranjang',
                            data : null
                        })
                    }else{
                        await supabase
                        .from('cart_item')
                        .insert({
                            item_id : req.body.item_id,
                            cart_id : getCart[0].id
                        })
                        res.json({
                            status_code : 200,
                            message : 'Berhasil menambah keranjang',
                            data : data
                        })
                    }
                }
        }catch(error){
            res.json({
                status_code : 500,
                message : "Terjadi kesalahan pada server",
                data : null
            })
        }
    },
    checkout : async (req,res) => {
        const {data} = await supabase 
            .from('balance')
            .select('id,amount')
            .maybeSingle()        
        const itemId = req.body.item_id
        const balance = data.amount
        const balanceId = data.id
        const totalPrice = req.body.total_price
        const updatedBalance = parseInt(balance) + parseInt(totalPrice)
        try{
            await supabase
                .from('balance')
                .update({amount : updatedBalance})
                .eq('id',balanceId)
            
            await supabase
                .from('cart')
                .delete()
                .eq('student_id',req.session.user['student_id'])

            itemId.forEach(async (item) => {
                await supabase
                    .from('items')
                    .delete()
                    .eq('id',item)
            })
            res.json({
                status_code : 200,
                message : 'Berhasil Membeli Barang',
                data : null
            })
        }catch{
            res.json({
                status_code : 500,
                message : 'Gagal Membeli Barang',
                data : null
            })
        }
    },
    delete : async (req,res) => {
        try{
            const id = req.params.id
            await supabase
                .from('cart_item')
                .delete()
                .eq('id',id)
            res.json({
                status_code : 200,
                message : 'Berhasil menghapus barang',
                data : null
            })
        }catch(error){
            res.json({
                status_code : 500,
                message : 'Gagal menghapus barang',
                data : null
            })
        }
    }
}