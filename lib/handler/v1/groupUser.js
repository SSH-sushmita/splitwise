function groupUser(connection, req, res, groupId) {
    var query = `INSERT INTO userGroup (userGroupId, userId) select ${groupId}, id from user where emailId in ("${req.userEmailId.join('","')}") or phoneNumber in ("${req.userPhoneNumber.join('","')}");`;
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
    groupUser
}