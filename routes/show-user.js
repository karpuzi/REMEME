module.exports = {
    showUserPage: (req, res) => {
        let query = "SELECT * FROM `users` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/showuser');
            }
            res.render('show-user.ejs', {
                title: "Welcome to Remember | View Users"
                ,users: result
            });
        });
    },
};
