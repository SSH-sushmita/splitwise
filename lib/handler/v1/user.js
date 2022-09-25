function user(connection, req, res) {
    var query = `INSERT INTO user (phoneNumber, emailId, userName, password) ` +
                `VALUES ("${req.phoneNumber}", "${req.emailId}", "${req.userName}", "${req.password}")`;
    console.log(`Running query : ${query}`);

    connection.query(query, function (error, results) {
        if (error) {
            console.error(`${JSON.stringify(error)}`);
            res.status(500).send({
                message: `${JSON.stringify(error)}`
            });
        } else {    
            console.log(`${JSON.stringify(results)}`);
            res.status(200).send({
                message: 'sucess'
            });
        }    
    });
};  

module.exports = {
    user
}