# splitwise

# Code setup/some key points
1. Route map is declared under etc.
2. Handler under v1 version for api
3. Config.js has config for the db
4. Test to be added under test, right there is only one dummy test
5. mysql.tar is image for sql container with schema enabled is shared on drive.
6. Have docker installed with npm version >=8.15.0 and node version 16.17.0

# For running docker sql instance
This instance already has table created, you can directly start with adding user, group and so forth.

1. docker load --input mysql.tar
2. docker image ls  # this should show an mysql image
3. docker run --name=mysql -d -p 3306:3306 -e MYSQL_USER=dev -e MYSQL_PASSWORD=dev123 -e MYSQL_DATABASE=dev mysql

# Run the server and test
1. git clone https://github.com/SSH-sushmita/splitwise.git
2. Run server directly after npm install - `npm install; node index.js`.
On successfull run you should log 
`Server listening at http://:::8080`
`The connection to db is successfull`
3. For test - `npm run test`. Test have to be added under test directory.

# Api call

These are call prototype. Curl, postman or any online tool can be used to test these.
There are logs printed on server side to see what exactly is happening.
VARIOUS IDS SHOULD BE CREATED BEFORE OR ELSE ERROR WILL BE THROWN.
These api call makes assumption that ids(mutiple) are cached on device for subsequent queries. 
There is no authentication and authorization on these api as of now.

1. This add user with below info
POST http://localhost:8080/v1/user?
{
    "phoneNumber": 9455223448,
    "emailId": "sushmitaxy.hrsingh@gmail.com",
    "userName" : "alpha2",
    "password" : "passwrd2"
}
2. Creating a group with only owner in it
POST http://localhost:8080/v1/group?
{
    "groupName" : "second",
    "userId" : 1
}
3. Adding user to the group by email id or phone number
POST http://localhost:8080/v1/group/1?
{
    "userEmailId" : ["sushmitaxy.hrsingh@gmail.com"],
    "userPhoneNumber": ["9455223410"]
}
4. Add an new expense 
POST http://localhost:8080/v1/expense?
{
    "debitUserId": 1,
    "groupId" : 1,
    "expenseName": "happy",
    "amount" : 100,
    "splitType" : "equal",
    "expense": [
        {
            "userId": 1,
            "shareAmount" : 70,
            "pendingAmount": 70
        },
        {
            "userId": 3,
            "shareAmount" : 30,
            "pendingAmount": 0
        }
     ]
}
5. Update an old expense with id  
POST http://localhost:8080/v1/expense/1?
{
    "debitUserId": 1,
    "groupId" : 1,
    "expenseName": "happy",
    "amount" : 100,
    "splitType" : "equal",
    "expense": [
        {
            "userId": 1,
            "shareAmount" : 20,
            "pendingAmount": 0
        },
        {
            "userId": 3,
            "shareAmount" : 80,
            "pendingAmount": 80
        }
     ]
}
6. For getting transaction of a user after a start date
GET http://localhost:8080/v1/transaction/1?startTime=2022-09-24
Where 1 is the userId and startTime is date/time from where transaction needed to listed

# This schema is used while creating tables. Posting here for reference
USE dev;
CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT,
    phoneNumber varChar(10) NOT NULL,
    emailId varChar(100) NOT NULL,
    userName varChar(50) NOT NULL,
    password varChar(50) NOT NULL,
    createdOn datetime DEFAULT CURRENT_TIMESTAMP,
    updatedOn datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT identity_constraint UNIQUE (phoneNumber, emailId)
);

CREATE TABLE groupInfo (
    id int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    groupName varChar(50) NOT NULL,
    userId int NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE userGroup (
    userGroupId int NOT NULL,
    FOREIGN KEY (userGroupId) REFERENCES groupInfo(id),
    userId int NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id),
    PRIMARY KEY (userGroupId, userId)
);


CREATE TABLE expense (
    id int NOT NULL AUTO_INCREMENT,
    expenseName varChar(50) NOT NULL,
    amount int NOT NULL,
    splitType enum('equal', 'exact') DEFAULT 'equal',
    PRIMARY KEY (id)
);

CREATE TABLE userGroupExpense (
    userGroupId int NOT NULL,
    FOREIGN KEY (userGroupId) REFERENCES groupInfo(id),
    expenseId int NOT NULL,
    FOREIGN KEY (expenseId) REFERENCES expense(id),
    userId int NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id),
    debitUserId int NOT NULL,
    FOREIGN KEY (debitUserId) REFERENCES user(id),
    PRIMARY KEY (userGroupId, expenseId,  userId),
    shareAmount int NOT NULL,
    pendingAmount  int NOT NULL,
    createdOn datetime DEFAULT CURRENT_TIMESTAMP,
    updatedOn datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

