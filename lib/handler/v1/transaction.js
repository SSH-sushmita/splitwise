function transaction(connection, req, res, userId) {
    var query = `SELECT * from userGroupExpense ` +
        `INNER JOIN expense ON expenseId=expense.id INNER JOIN groupInfo ON userGroupId = groupInfo.id `+
        `WHERE createdOn >= ${req.startTime} AND createdOn <= NOW() AND userGroupExpense.userId = ${userId}; `
    console.log(`Running query : ${query}`);

    connection.query(query, function (error, results) {
        if (error) {
            console.error(`${JSON.stringify(error)}`);
            res.status(500).send({
                message: `${JSON.stringify(error)}`
            });
        } else {    
            console.log(`${JSON.stringify(results)}`);
            res.status(200).send(results);
        }    
    });
};  

module.exports = {
    transaction
}