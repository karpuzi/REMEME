module.exports = {
    showNotificationPage: (req, res) => {
        let query = "SELECT * FROM `notifications` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/show');
            }
            res.render('show-notification.ejs', {
                title: "Welcome to Remember | View Notifications"
                ,notifications: result
            });
        });
    }
};
