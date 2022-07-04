const supabase = require('../database')
const bcrypt = require('bcryptjs');
module.exports = {
    index : (req,res) => {
        if(req.session.loggedIn) return res.redirect('/')
        const title = 'Masuk' 
        res.render('login',{title});
    },
    login : async (req,res) => {
        const dataLogin = {
            student_id : req.body['student_id'],
            password   : req.body['password']
        }
            const { data,error } = await supabase
                .from('users')
                .select('id,student_id,name,password')
                .eq('student_id', dataLogin.student_id)

                if(error){
                    res.json({
                        status_code : 400,
                        message : 'Gagal login',
                        error : error
                    })
                }
                
                if(data.length > 0){
                    const user = data[0]
                    if(bcrypt.compareSync(dataLogin.password, user.password)){
                        req.session.loggedIn = true
                        req.session.user = user
                        res.json({
                            "status_code": 200,
                            "message": "Berhasil Login",
                            "data": user
                        })
                    }else{
                        res.json({
                            "status_code": 500,
                            "message": "ID Siswa atau Password Salah",
                            "data": null
                        })
                    }    
                }else{
                    res.json({
                        "status_code": 500,
                        "message": "User Tidak Ditemukan",
                        "data": null
                    })
                }
    },
    logout : async (req,res) => {
        req.session.destroy();
        return res.redirect('/login')
    }
}
