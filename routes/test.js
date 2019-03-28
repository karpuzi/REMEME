const fs = require('fs');

module.exports = {
    showUserPage: (req, res) => {
        res.render('show-user.ejs', {
            title: "Welcome to Rememe | Show Users"
            ,message: ''
        });
    },

    addUserPage: (req, res) => {
        res.render('add-user.ejs', {
            title: "Welcome to Rememe | Add a new user"
            ,message: ''
        });
    },
    addUser: (req, res) => {
        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let age = req.body.age;
        let height = req.body.height;
        let weight = req.body.weight;
        let username = req.body.username;

        console.log('user.js '+ username)

        let usernameQuery = "SELECT * FROM `users` WHERE username = '" + username + "'";
        //db.query(usernameQuery, (err, result) => {
        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
           if (result.length > 0) {
         //       message = 'Username already exists';
                message = 'User Name already exists';
                res.render('add-user.ejs', {
                   message,
                   title: "Welcome to Rememe | Add a new user"
                });
           } else {

                       if (err) {
                           return res.status(500).send(err);
                       }
                       // send the notification's details to the database
                       let query = "INSERT INTO `users` (first_name, last_name, email, age, height, weight, username) VALUES ('" +
                           first_name + "', '" + last_name + "', '" + email + "', '" + age + "', '" + height + "', '" + weight + "', '" + username + "')";
                       db.query(query, (err, result) => {
                           if (err) {
                               return res.status(500).send(err);
                           }
                           res.redirect('/showuser');
                       });

            }
        });
    },
    //lambda

    editUserPage: (req, res) => {
        let userId = req.params.id;
        let query = "SELECT * FROM `users` WHERE id = '" + userId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-user.ejs', {
                title: "Edit  User"
                ,user: result[0]
                ,message: ''
            });
        });
    },

    editUser: (req, res) => {
        let userId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let age = req.body.age;
        let height = req.body.height;
        let weight = req.body.weight;
        let username = req.body.username;
console.log('user.js '+ last_name)
        let query = "UPDATE `users` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `email` = '" + email + "', `age` = '" + age +
            "', `height` = '" + height + "', `weight` = '" + weight + "', `username` = '" + username + "' WHERE `users`.`id` = '" + userId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/showuser');
        });
    },
    deleteUser: (req, res) => {
        let userId = req.params.id;
        let deleteUserQuery = 'DELETE FROM users WHERE id = "' + userId + '"';

        db.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/showuser');
        });

    }
};
