function group(connection, req, res) {
    var query = `INSERT INTO groupInfo (groupName, userId) VALUES ("${req.groupName}", ${req.userId});`
                + `INSERT INTO userGroup (userGroupId, userId) VALUES (LAST_INSERT_ID(), ${req.userId});`;
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
    group
}