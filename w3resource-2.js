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

const Jobs = sequelize.define("jobs", {
  JOB_ID: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  JOB_TITLE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MIN_SALARY: {
    type: DataTypes.DECIMAL,
  },
  MAX_SALARY: {
    type: DataTypes.DECIMAL,
  },
});

//  ---------  Restricting and Sorting data ---------

/*
1. Write a query to display the name (first_name, last_name) and salary 
for all employees whose salary is not in the range $10,000 through $15,000.
- SQL -
SELECT first_name, last_name, salary
FROM orm_test.employees
WHERE salary NOT BETWEEN 10000 AND 15000;
*/
function Q1() {
  Employee.findAll({
    attributes: ["FIRST_NAME", "LAST_NAME", "SALARY"],
    where: {
      SALARY: {
        [Op.notBetween]: [10000, 15000],
      },
    },
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q1();

/*
2. Write a query to display the name (first_name, last_name) and department ID 
of all employees in departments 30 or 100 in ascending order.
- SQL -
SELECT first_name, last_name, department_id
FROM orm_test.employees
WHERE department_id IN (30, 100)
ORDER BY  department_id  ASC;
*/

function Q2() {
  Employee.findAll({
    attributes: ["FIRST_NAME", "LAST_NAME", "department_id"],
    where: {
      department_id: {
        [Op.in]: [30, 100],
      },
    },
    order: [["department_id", "asc"]],
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q2();

/*
3. Write a query to display the name (first_name, last_name) and salary 
for all employees whose salary is not in the range $10,000 through $15,000 and are in department 30 or 100. 
- SQL -
SELECT first_name, last_name, salary, department_id
FROM orm_test.employees
WHERE (salary NOT BETWEEN 10000 AND 15000) 
AND (department_id IN (30, 100));
*/

function Q3() {
  Employee.findAll({
    attributes: ["FIRST_NAME", "LAST_NAME", "Salary", "department_id"],
    where: {
      [Op.and]: [
        {
          department_id: {
            [Op.in]: [30, 100],
          },
        },
        {
          SALARY: {
            [Op.notBetween]: [10000, 15000],
          },
        },
      ],
    },
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q3();

/*
4. Write a query to display the name (first_name, last_name) and hire date for all employees who were hired in 1987.
- SQL -
SELECT first_name, last_name, hire_date 
FROM orm_test.employees 
WHERE YEAR(hire_date)  LIKE '1987%';
*/

function Q4() {
  Employee.findAll({
    attributes: ["FIRST_NAME", "LAST_NAME", "hire_date"],
    where: sequelize.where(
      sequelize.fn("year", sequelize.col("hire_date")),
      Op.like,
      "1987%"
    ),
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q4();

/*
5. Write a query to display the first_name of all employees who have both "b" and "c" in their first name.
- SQL -
SELECT first_name
FROM orm_test.employees
WHERE (first_name LIKE '%b%') AND (first_name LIKE '%c%');
*/

function Q5() {
  Employee.findAll({
    attributes: ["FIRST_NAME"],
    where: {
      [Op.and]: [
        {
          first_name: {
            [Op.like]: "%b%",
          },
        },
        {
          first_name: {
            [Op.like]: "%c%",
          },
        },
      ],
    },
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q5();

/*
6. Write a query to display the last name, job, and salary 
for all employees whose job is that of a Programmer or a Shipping Clerk,
and whose salary is not equal to $4,500, $10,000, or $15,000.
- SQL -
SELECT e.last_name, j.JOB_TITLE, e.salary
FROM orm_test.employees as e join orm_test.jobs as j
on e.JOB_ID = j.JOB_ID
WHERE j.JOB_TITLE IN ('Programmer', 'Shipping Clerk')
AND e.salary NOT IN (4500,10000, 15000);
*/

function Q6() {
  Jobs.hasMany(Employee, { foreignKey: "JOB_ID" });
  Employee.belongsTo(Jobs, { foreignKey: "JOB_ID" });

  Employee.findAll({
    attributes: ["last_name", "salary"],

    where: {
      SALARY: {
        [Op.notIn]: [4500, 10000, 15000],
      },
    },

    include: {
      model: Jobs,
      attributes: ["JOB_TITLE"],
      required: true,
      where: {
        JOB_TITLE: {
          [Op.in]: ["Programmer", "Shipping Clerk"],
        },
      },
    },
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q6();

/*
7. Write a query to display the last name of employees whose names have exactly 6 characters.
- SQL -
SELECT last_name 
FROM orm_test.employees 
WHERE length( last_name ) = 6;
*/

function Q7() {
  Employee.findAll({
    attributes: ["LAST_NAME"],
    where: sequelize.where(
      sequelize.fn("length", sequelize.col("last_name")),
      6
    ),
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q7();

/*
8. Write a query to display the last name of employees having 'e' as the third character.
- SQL -
SELECT last_name 
FROM orm_test.employees 
WHERE last_name LIKE '__e%';
*/

function Q8() {
  Employee.findAll({
    attributes: ["LAST_NAME"],
    where: {
      LAST_NAME: {
        [Op.like]: "__e%",
      },
    },
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q8();

/*
9. Write a query to display the jobs/designations available in the employees table.
- SQL -
SELECT DISTINCT job_id  
FROM orm_test.employees;
*/

function Q9() {
  Employee.findAll({
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("job_id")), "job_id"]],
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q9();

/*
10. Write a query to display the name (first_name, last_name), salary and PF (15% of salary) of all employees.
- SQL -
SELECT first_name, last_name, salary, salary*.15 PF 
from orm_test.employees;
*/

function Q10() {
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
}

//Q10();

/*
11. Write a query to select all record from employees where last name in 'BLAKE', 'SCOTT', 'KING' and 'FORD'.
- SQL -
SELECT * 
FROM orm_test.employees 
WHERE last_name IN('BLAKE', 'SCOTT', 'KING', 'FORD');
*/

function Q11() {
  Employee.findAll({
    where: {
      last_name: {
        [Op.in]: ["BLAKE", "SCOTT", "KING", "FORD"],
      },
    },
  })
    .then((employees) => {
      console.log(JSON.stringify(employees, null, 1));
      console.log(employees.length); // Just to check
    })
    .catch((err) => {
      console.log(err);
    });
}

//Q11();

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
//testConnection();
