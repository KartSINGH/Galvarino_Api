var router = require('express').Router(),
    connection = require('../connection'),
    nodemailer = require('nodemailer'),
    sequelize = connection.sequelize,
    wellknown = require('nodemailer-wellknown'),

    temp_user = connection.seq.define('temp_user', {
        user_id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        user_email: {
            type: sequelize.STRING,
            allowNull: false,
        },

    }, {
        freezeTableName: true,
        timestamps: true
    })
temp_user.sync()

/*router.get('/temp/all_users', (request, response) => {
    temp_user.findAll({
        attributes: ['user_id', 'phone_number', 'user_email', 'user_name', 'user_res_address', 'scrap_amount', 'time']
    }).then((temp_user) => {
        response.send(temp_user);
    })
})*/

/*router.get('/temp/check_user/', (request, response) => {
    temp_user.findAll({
        where: {
            user_email: request.query.user_email
        }
    }).then((temp_user) => {
        console.log(temp_user);
        response.send(temp_user);

    })
})*/

router.post('/submit-request', (request, response) => {
    data_body = request.body;
    temp_user.create({
        user_id: data_body.user_id,

        user_email: data_body.user_email,

    }).then(function (user_name) {
        var name = user_name;

        var transporter = nodemailer.createTransport({

            service: 'Gmail',
            auth: {
                user: 'kart.singh15@gmail.com',
                pass: 'dragonballzee'
            },


        });

        var text = "Greetings User" + " from Galvarino team!.We thank you for subscribing with us!We are coming soon to India.Stay Tuned.";
        var mailOptions = {
            to: name.user_email,
            from: 'kart.singh15@gmail.com',
            subject: 'Galvarino || Subscription Response',
            text: text
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
               console.log(error);
            } else {
                var text1 = "User Raised Request " + name.user_name;
                var mailOptions1 = {
                    to: 'nikhil.singh.moni@gmail.com',
                    from: 'kart.singh15@gmail.com',
                    subject: 'Galvarino|| Subscription Made',
                    text: text1,
                    html: '<h3>Booking ID </h3>' + name.user_id + '<p>User Email</p>' + name.user_email + " has made subscription with us."
                }
                transporter.sendMail(mailOptions1, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.send(info);
                        console.log(info);
                    }
                });
            }
        });



    })
})
module.exports = router;