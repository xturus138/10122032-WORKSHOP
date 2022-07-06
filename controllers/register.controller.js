const supabase = require('../database')
const bcrypt = require('bcryptjs');
module.exports = {
    index: (req, res) => {
        if (req.session.loggedIn) return res.redirect('/')
        const title = 'Daftar'
        res.render('register', {
            title
        })
    },
    register: async (req, res) => {
        const salt = bcrypt.genSaltSync(10)
        const student_id = req.body['student_id']
        try {
            const { data: user } = await supabase
                .from('users')
                .select('student_id')
                .eq('student_id', student_id)
                .maybeSingle()
            if (user != null) {
                res.json({
                    "status_code": 400,
                    "message": "ID Siswa Telah Terdaftar",
                    "errors": null
                })
            } else {
                const { data,error } = await supabase
                    .from('users')
                    .insert([{
                        student_id: student_id,
                        name: req.body['name'],
                        password: req.body['name'] ? bcrypt.hashSync(req.body['password'], salt) : ''
                    }])
                    
                    if(error){
                        res.json({
                            "status_code": 400,
                            "message": "Gagal Membuat Akun",
                            "errors": error
                        })
                    }else{
                        res.json({
                            "status_code": 200,
                            "message": "Berhasil Membuat Akun",
                            "data": data
                        })
                    }
            }
        } catch (err) {
            res.json({
                "status_code": 500,
                "message": err,
                "data": null
            })
        }
    }
}