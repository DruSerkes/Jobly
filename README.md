# Jobly

### What this project was about? 
This project was an opportunity to to build a job searching & connecting REST API with Node.js / Express. This project required I write unittests for helper functions and integration tests for all routes as I defined them. 

--- 

### Running tests

To run tests for this project, first ensure that all dependencies are installed ``` npm install ``` then tests can be run with ``` npm test ```

--- 

### What I did 

I had a similar process for every table I would define for this API (companies, jobs, users, applications): 

1. Define and create table with SQL DDL
2. RESTful routing
3. Create a corresponding class with static methods for encapsulation of database queries
4. Update routes for connected tables where necessary. 
5. Write and run tests 

I handled authorization and authentication with middleware checking for a signed JWT given to the user on login. 

---

### What I learned

This project got me VERY comfortable with RESTful routing, as well as separation of concerns, making use of OOP for the benefits of encapsulation and reusability. I didn't use an ORM for my SQL queries, so I got in some good practice writing DDL and DML.  

I also learned the importance of making sure to write and run integration tests for every single route, and unittests for every helper function, as this gave me a better understanding of the function inputs/outputs and how the data was structured.

---

### Looking forward 

While I enjoyed the SQL practice, I would love to learn a Node/Express friendly ORM (right now thinking Sequelize). 

I would also love to become more familiar with different libraries available via npm so make use of open source, well maintained tools that can make me even more efficient in building projects like this in the future.
