# [Query Me](https://queryme-demo.herokuapp.com)

## Description

__What is it?__\
A data analytics abstraction layer that connects to databases and executes pre-constructed SQL queries.

__Who is it for?__\
It is meant as a business intelligence tool for enterprises. 

__Why build it?__\
Often times, business teams and/or management teams are interested in certain metrics, for example daily revenue of the business. Normally, data analysts will have to retrieve this data from the database on a daily basis. While seemingly simple, it can get tedious especially when there are a ton of other metrics to query for.

However, with Query Me, data analysts will only need to write the query once, and the query will be stored in the form of a report. Anyone in the company can then load the report anytime to see the desired query results. Reports can also be downloaded as excel files for further analysis or sharing.

__How is it built?__\
_Tech Stack_:
Postgres, Handlebars (Semantic UI), Express.js, Node.js

_ERD_:\
MetaData DB:\
![MetaData DB](https://i.imgur.com/AitDlXC.png)

Actual DB:\
![Actual DB](https://i.imgur.com/04fCgjZ.png)


## Demo Instructions

__Business Role__\
_Able to:_
- View Reports
- Download Reports as Excel
- Favourite Reports\
__email__: business_test@mail.com\
__password__: 123

__Admin Role__\
_Able to:_
- ^ All of what a business role can do
- CRUD Reports
- CRUD Users\
__email__: admin_test@mail.com\
__password__: 123

1) Log in with admin role credentials.
2) Under Report Categories, navigate to any existing report.
3) Try editing a report, previewing SQL queries, downloading the results as excel sheet and favouriting the report.
4) If you have favourited any reports, you would find them under favourites.

_For demo purposes, you will find that most CRUD controls don't work._
