//Kommer det till en ny tränare eller nya styrelsemedlemmar lägger man in denna koden i home.js

//     .get(function (req, res) {
//         res.render('home/createMembership');
//     })
//     .post(function (req, res) {
//         let newCreate = new User({
//             username: req.body.username,
//             password: req.body.password
//         });
//
//         User.findOne({username: req.body.username}).then(function (data) {
//             if (data) {
//                 req.session.flash = {
//                     type: 'fail',
//                     message: 'Användarnamnet är upptaget, vänligen välj ett annat!'
//                 };
//                 res.redirect('/createMembership');
//             }
//             else {
//                 newCreate.save()
//                     .then(function () {
//                         res.redirect('/');
//                     }).catch(function (data) {
//                     if (data) {
//                         req.session.flash = {
//                             type: 'fail',
//                             message: 'Användarnamnet måste vara minst 4 tecken,' +
//                             'och lösenordet 6 tecken!'
//                         };
//
//                         res.redirect('/createMembership');
//                     }
//                 });
//             }
//         });
//     });