const { Sequelize, DataTypes, Op } = require("@sequelize/core");

const sequelize = new Sequelize("orm_test", "root", "system", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
  define: { timestamps: false },
});

const Employee = sequelize.define("employees", {
  EMPLOYEE_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  FIRST_NAME: {
    type: DataTypes.STRING,
  },
  LAST_NAME: {
    type: DataTypes.STRING,
  },
  EMAIL: {
    type: DataTypes.STRING,
  },
  PHONE_NUMBER: {
    type: DataTypes.STRING,
  },
  HIRE_DATE: {
    type: DataTypes.DATE,
  },
  JOB_ID: {
    type: DataTypes.STRING,
  },
  SALARY: {
    type: DataTypes.INTEGER,
  },
  COMMISSION_PCT: {
    type: DataTypes.INTEGER,
  },
  MANAGER_ID: {
    type: DataTypes.INTEGER,
  },
  DEPARTMENT_ID: {
    type: DataTypes.INTEGER,
  },
});

//  ---------  Basic SELECT statement ---------

/*
1. Write a query to display the names (first_name, last_name) 
   using alias name “First Name", "Last Name"

SQL: SELECT  FIRST_NAME "First name" ,LAST_NAME "Last Name"FROM employees;
*/

Employee.findAll({
  attributes: [
    ["FIRST_NAME", "First Name"],
    ["LAST_NAME", "Last Name"],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
  })
  .catch((err) => {
    console.log(err);
  });

/*  
2. Write a query to get unique department ID from employee table.

SQL: SELECT  distinct(DEPARTMENT_ID) FROM employees;
*/
Employee.findAll({
  attributes: [
    [Sequelize.fn("DISTINCT", Sequelize.col("DEPARTMENT_ID")), "DEPARTMENT_ID"],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
3. Write a query to get all employee details from the employee table order by first name, descending.

SQL: SELECT  *  FROM employees order by FIRST_NAME desc;
*/
Employee.findAll({
  order: [["FIRST_NAME", "DESC"]],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
4. Write a query to get the names (first_name, last_name), salary, 
   PF of all the employees (PF is calculated as 15% of salary)

SQL: select FIRST_NAME, LAST_NAME , SALARY ,  (SALARY * 0.15) as "PF" from employees;
*/
Employee.findAll({
  attributes: [
    "FIRST_NAME",
    "LAST_NAME",
    "SALARY",
    [Sequelize.literal("SALARY * 0.15"), "PF"],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
5. Write a query to get the employee ID, names (first_name, last_name), 
   salary in ascending order of salary.

SQL: select EMPLOYEE_ID, FIRST_NAME, LAST_NAME , SALARY 
     from employees
     order by SALARY asc;
*/

Employee.findAll({
  attributes: ["EMPLOYEE_ID", "FIRST_NAME", "LAST_NAME", "SALARY"],
  order: [["SALARY", "ASC"]],
  limit: 10,
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
6. Write a query to get the total salaries payable to employees.
 
SQL: select sum(salary) from employees;
*/
Employee.findAll({
  attributes: [[Sequelize.fn("SUM", Sequelize.col("SALARY")), "total"]],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
7.  Write a query to get the maximum and minimum salary from employees table.
SQL: select max(SALARY) , min(SALARY) from employees
*/
Employee.findAll({
  attributes: [
    [Sequelize.fn("MAX", Sequelize.col("SALARY")), "MAX"],
    [Sequelize.fn("MIN", Sequelize.col("SALARY")), "MIN"],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
8. Write a query to get the average salary and number of employees in the employees table.
SQL: select avg(salary) , count(*) from employees;
*/
Employee.findAll({
  attributes: [
    [Sequelize.fn("AVG", Sequelize.col("SALARY")), "the average salary"],
    [
      Sequelize.fn("COUNT", Sequelize.col("EMPLOYEE_ID")),
      "number of employees",
    ],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
9. Write a query to get the number of employees working with the company.
SQL:  select count(*) from employees; 
*/
Employee.findAll({
  attributes: [
    [
      Sequelize.fn("COUNT", Sequelize.col("EMPLOYEE_ID")),
      "number of employees",
    ],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
10. Write a query to get the number of jobs available in the employees table
SQL: select count(distinct(JOB_ID)) from employees;
*/
Employee.findAll({
  attributes: [
    [
      Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("JOB_ID"))),
      "the number of jobs available",
    ],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
11. Write a query get all first name from employees table in upper case.
SQL: select upper(first_name) from employees;
*/
Employee.findAll({
  attributes: [
    [Sequelize.fn("upper", Sequelize.col("FIRST_NAME")), "first name"],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
12. Write a query to get the first 3 characters of first name from employees table.
SQL: select SUBSTRING(first_name,1,3) from employees;
*/
Employee.findAll({
  attributes: [
    [
      Sequelize.literal("SUBSTRING(first_name,1,3)"),
      "the first 3 characters of first name",
    ],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
13. Write a query to calculate 171*214+625.
SQL: select 171*214+625 ;
*/

/*
14. Write a query to get the names (for example Ellen Abel, Sundar Ande etc.)
    of all the employees from employees table.
SQL: select concat(first_name," ",last_name) from employees;
*/
Employee.findAll({
  attributes: [
    [
      Sequelize.fn(
        "concat",
        sequelize.col("first_name"),
        " ",
        sequelize.col("last_name")
      ),
      "name",
    ],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
15. Write a query to get first name from employees table after removing white spaces from both side.
SQL: select trim(first_name) from employees;
*/
Employee.findAll({
  attributes: [
    [Sequelize.fn("Trim", sequelize.col("first_name")), "first name"],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
16. Write a query to get the length of the employee names 
    (first_name, last_name) from employees table.
SQL: select length(first_name) as "length of first name" , length(last_name) as "length of last name" 
     from employees;
*/
Employee.findAll({
  attributes: [
    [
      Sequelize.fn("length", sequelize.col("first_name")),
      "length of first name",
    ],
    [Sequelize.fn("length", sequelize.col("last_name")), "length of last name"],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
17. Write a query to check if the first_name fields of the employees table contains numbers.
SQL: SELECT first_name,
       CASE
           WHEN first_name LIKE '%[0-9]%' THEN "Yes"
           ELSE "No"
       END  "contains numbers"
     FROM employees;
*/
Employee.findAll({
  attributes: [
    "first_name",
    [
      sequelize.literal(
        " CASE WHEN first_name LIKE '%[0-9]%' THEN 'Yes'   ELSE 'No' END   "
      ),
      "contains numbers",
    ],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
18. Write a query to select first 10 records from a table.
SQL: select * from employees limit 10;
*/
Employee.findAll({ limit: 10 })
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

/*
19. Write a query to get monthly salary (round 2 decimal places) of each and every employee
    Note : Assume the salary field provides the 'annual salary' information.
SQL: select round(salary/12,2) from employees;
*/
Employee.findAll({
  attributes: [
    [
      sequelize.fn("round", sequelize.literal("salary / 12"), 2),
      "monthly salary",
    ],
  ],
})
  .then((employees) => {
    console.log(JSON.stringify(employees, null, 1));
    console.log(employees.length); // Just to check
  })
  .catch((err) => {
    console.log(err);
  });

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testConnection();
