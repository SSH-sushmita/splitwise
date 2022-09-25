function expense(connection, req, res, expenseId) {
    var query = null;
    if(!expenseId) {
        query = `INSERT INTO expense (expenseName, amount, splitType) VALUES ("${req.expenseName}", ${req.amount}, "${req.splitType}"); `+
            `SET @last_id = LAST_INSERT_ID(); `
        req.expense.forEach(element => {
            query += `INSERT INTO userGroupExpense (userGroupId, expenseId, userId, debitUserId, shareAmount, pendingAmount)` +
            ` VALUES (${req.groupId}, @last_id, ${element.userId}, ${req.debitUserId},` +
            ` ${element.shareAmount}, ${element.pendingAmount}); `;
        });
    } else {
        query = `UPDATE expense SET expenseName = "${req.expenseName}", amount = ${req.amount}, splitType = "${req.splitType}" WHERE id = ${expenseId}; `
        req.expense.forEach(element => {
            query += `UPDATE userGroupExpense SET debitUserId = ${req.debitUserId}, shareAmount = ${element.shareAmount} , pendingAmount = ${element.pendingAmount} WHERE expenseId = ${expenseId} AND userGroupId = ${req.groupId} AND userId = ${element.userId}; `;
        });
    }
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
    expense
}