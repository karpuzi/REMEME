const fs = require('fs');

module.exports = {

    showNotificationPage: (req, res) => {
        res.render('show-notification.ejs', {
            title: "Welcome to Rememe | Show notifications"
            ,message: ''
        });
    },

    addNotificationPage: (req, res) => {
        res.render('add-notification.ejs', {
            title: "Welcome to Rememe | Add a new notification"
            ,message: ''
        });
    },

    addNotification: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let not_name = req.body.not_name;
        let not_description = req.body.not_description;
        let not_type = req.body.not_type;
        let not_hour = req.body.not_hour;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = not_name + '.' + fileExtension;
console.log('not_name '+not_name);
        let notnameQuery = "SELECT * FROM `notifications` WHERE not_name = '" + not_name + "'";
        //db.query(usernameQuery, (err, result) => {
        db.query(notnameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
           if (result.length > 0) {
         //       message = 'Username already exists';
                message = 'Notification Name already exists';
                res.render('add-notification.ejs', {
                   message,
                   title: "Welcome to Rememe | Add a new notification"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the notification's details to the database
                        let query = "INSERT INTO `notifications` (not_name, not_description, not_type, not_hour, image, username) VALUES ('" +
                            not_name + "', '" + not_description + "', '" + not_type + "', '" + not_hour + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/show');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-notification.ejs', {
                        message,
                        title: "Welcome to Socka | Add a new notification"
                    });
                }
            }
        });
    },
    editNotificationPage: (req, res) => {
        let notificationId = req.params.id;
        let query = "SELECT * FROM `notifications` WHERE id = '" + notificationId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-notification.ejs', {
                title: "Edit  Notification"
                ,notification: result[0]
                ,message: ''
            });
        });
    },
    editNotification: (req, res) => {
        let notificationId = req.params.id;
        let not_name = req.body.not_name;
        let not_description = req.body.not_description;
        let not_type = req.body.not_type;
        let not_hour = req.body.not_hour;

        let query = "UPDATE `notifications` SET `not_name` = '" + not_name + "', `not_description` = '" + not_description + "', `not_type` = '" + not_type + "', `not_hour` = '" + not_hour + "' WHERE `notifications`.`id` = '" + notificationId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/show');
        });
    },
    deleteNotification: (req, res) => {
        let notificationId = req.params.id;
        let getImageQuery = 'SELECT image from `notifications` WHERE id = "' + notificationId + '"';
        let deleteUserQuery = 'DELETE FROM notifications WHERE id = "' + notificationId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/show');
                });
            });
        });
    }
};
