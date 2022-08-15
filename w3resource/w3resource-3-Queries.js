const { Sequelize, DataTypes, Op } = require("@sequelize/core");
const sequelize = require("./w3resource-3-Models");

const { employees, countries, job_history, departments, locations, jobs } =
  sequelize.models;

//  ---------  Joins  ---------

/*
1. Write a query to find the addresses (location_id, street_address, city, state_province, country_name)
   of all the departments.
- SQL -
SELECT  location_id, street_address, city, state_province, country_name
FROM orm_test.locations  join orm_test.countries 
using(COUNTRY_ID);
*/
async function Q1() {
  countries.hasMany(locations, {
    foreignKey: "COUNTRY_ID",
  });
  locations.belongsTo(countries, {
    foreignKey: "COUNTRY_ID",
  });

  try {
    var Results = await locations.findAndCountAll({
      attributes: ["LOCATION_ID", "street_address", "city", "state_province"],
      include: {
        model: countries,
        attributes: ["country_name"],
        required: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q1();

/*
2. Write a query to find the name (first_name, last name), department ID and name of all the employees
- SQL -
SELECT first_name, last_name, d.department_id , DEPARTMENT_NAME      
FROM orm_test.employees as e join orm_test.departments as d
on  e.DEPARTMENT_ID  = d.department_id;
*/

async function Q2() {
  departments.hasMany(employees, {
    foreignKey: "DEPARTMENT_ID",
  });
  employees.belongsTo(departments, {
    foreignKey: "DEPARTMENT_ID",
  });

  try {
    var Results = await employees.findAndCountAll({
      attributes: ["first_name", "last_name"],
      include: {
        model: departments,
        attributes: ["DEPARTMENT_NAME", "department_id"],
        required: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q2();

/*
3. Write a query to find the name (first_name, last_name), job, department ID and 
   name of the employees who works in London
- SQL -
SELECT first_name, last_name, d.department_id , DEPARTMENT_NAME   
FROM orm_test.employees  e join orm_test.departments d
using(DEPARTMENT_ID)
join orm_test.locations l
using(LOCATION_ID)
where l.city = "London"; 
*/

async function Q3() {
  departments.hasMany(employees, {
    foreignKey: "DEPARTMENT_ID",
  });
  employees.belongsTo(departments, {
    foreignKey: "DEPARTMENT_ID",
  });

  locations.hasMany(departments, {
    foreignKey: "LOCATION_ID",
  });

  departments.belongsTo(locations, {
    foreignKey: "LOCATION_ID",
  });

  try {
    var Results = await employees.findAndCountAll({
      attributes: ["first_name", "last_name"],
      include: {
        model: departments,
        attributes: ["DEPARTMENT_NAME", "department_id"],
        required: true,
        include: {
          model: locations,
          attributes: [],
          required: true,
          where: {
            city: "London",
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q3();

/*
4. Write a query to find the employee id, name (last_name) along with their manager_id and name (last_name).
- SQL -
SELECT e.employee_id,  e.last_name , e.manager_id  , m.last_name
FROM orm_test.employees e inner join orm_test.employees m
on e.MANAGER_ID  = m.EMPLOYEE_ID ;

*/

async function Q4() {
  employees.belongsTo(employees, {
    foreignKey: "MANAGER_ID",
  });

  try {
    var Results = await employees.findAndCountAll({
      attributes: ["employee_id", "last_name"],
      include: {
        model: employees,
        attributes: [
          ["last_name", "Manger last name"],
          ["employee_id", "Manger Id"],
        ],
        required: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q4();

/*
5. Write a query to find the name (first_name, last_name) and hire date of the employees who was hired after 'Jones'.
- SQL -
SELECT first_name, last_name , hire_date
FROM orm_test.employees
WHERE hire_date > (select hire_date
					FROM orm_test.employees
					where last_name = "Jones");
*/

async function Q5() {
  try {
    var jone = await employees.findOne({
      where: {
        last_name: "Jones",
      },
    });
  } catch (err) {
    console.log(err);
  }
  //console.log("Results ", JSON.stringify(jone, null, 2));
  console.log(jone.dataValues.HIRE_DATE);

  try {
    var Results = await employees.findAndCountAll({
      attributes: ["first_name", "last_name", "hire_date"],
      where: {
        hire_date: {
          [Op.gt]: jone.dataValues.HIRE_DATE,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q5();

/*
6. Write a query to get the department name and number of employees in the department.
- SQL -
SELECT DEPARTMENT_NAME , count(*)
FROM orm_test.employees  e join orm_test.departments d
using(DEPARTMENT_ID )
group by DEPARTMENT_NAME  ;
*/

async function Q6() {
  departments.hasMany(employees, {
    foreignKey: "DEPARTMENT_ID",
  });
  employees.belongsTo(departments, {
    foreignKey: "DEPARTMENT_ID",
  });

  try {
    var Results = await departments.findAndCountAll({
      attributes: [
        "DEPARTMENT_NAME",
        [
          sequelize.fn("COUNT", sequelize.col("*")),
          "number of employees in the department ",
        ],
      ],
      include: {
        model: employees,
        attributes: [],
        required: true,
      },
      group: "DEPARTMENT_NAME",
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count.length
  );
}

//Q6();

/*
7. Write a query to find the employee ID, job title, number of days between ending date and starting date
   for all jobs in department 90.
- SQL -
SELECT h.EMPLOYEE_ID , j.JOB_ID    ,h.END_DATE-h.START_DATE as days
FROM orm_test.jobs j join orm_test.job_history h
using( JOB_ID )
where h.DEPARTMENT_ID = 90;
*/

async function Q7() {
  jobs.hasMany(job_history, {
    foreignKey: "JOB_ID",
  });
  job_history.belongsTo(jobs, {
    foreignKey: "JOB_ID",
  });

  try {
    var Results = await jobs.findAndCountAll({
      attributes: ["JOB_ID"],
      include: {
        model: job_history,
        attributes: [
          "EMPLOYEE_ID",
          [sequelize.literal("END_DATE- START_DATE"), "sad"],
        ],
        required: true,
        where: {
          DEPARTMENT_ID: 90,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q7();

/*
8. Write a query to display the department ID and name and first name of manager. 
- SQL -
SELECT  d.DEPARTMENT_ID , d.DEPARTMENT_NAME ,m.EMPLOYEE_ID, m.FIRST_NAME
FROM orm_test.departments as d join orm_test.employees as m 
on d.MANAGER_ID  = m.EMPLOYEE_ID;
*/

async function Q8() {
  departments.hasOne(employees, {
    sourceKey: "MANAGER_ID",
    targetKey: "EMPLOYEE_ID",

    foreignKey: "EMPLOYEE_ID",
  });
  employees.belongsTo(departments, {
    foreignKey: "MANAGER_ID",
  });

  try {
    var Results = await departments.findAndCountAll({
      attributes: ["DEPARTMENT_NAME", "DEPARTMENT_ID"],
      include: {
        model: employees,
        attributes: ["EMPLOYEE_ID", "FIRST_NAME"],
        required: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q8();

/*
9. Write a query to display the department name, manager name, and city.
- SQL -
SELECT   d.DEPARTMENT_NAME ,m.FIRST_NAME, l.CITY
FROM orm_test.departments as d join orm_test.employees as m 
on d.MANAGER_ID  = m.EMPLOYEE_ID
join orm_test.locations as l 
using(location_id) ;
*/

async function Q9() {
  departments.hasOne(employees, {
    sourceKey: "MANAGER_ID",
    targetKey: "EMPLOYEE_ID",

    foreignKey: "EMPLOYEE_ID",
  });
  employees.belongsTo(departments, {
    foreignKey: "MANAGER_ID",
  });

  locations.hasMany(departments, {
    foreignKey: "LOCATION_ID",
  });

  departments.belongsTo(locations, {
    foreignKey: "LOCATION_ID",
  });

  try {
    var Results = await departments.findAndCountAll({
      attributes: ["DEPARTMENT_NAME"],
      include: [
        {
          model: employees,
          attributes: ["first_name"],
          required: true,
        },
        {
          model: locations,
          attributes: ["city"],
          required: true,
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q9();

/*
10. Write a query to display the job title and average salary of employees.
- SQL -
SELECT j.JOB_TITLE , avg(e.SALARY)
FROM orm_test.employees  e join orm_test.jobs j
using(JOB_ID)
group by JOB_ID ;
*/

async function Q10() {
  jobs.hasMany(employees, {
    foreignKey: "JOB_ID",

    sourceKey: "JOB_ID",
  });
  employees.belongsTo(jobs, {
    foreignKey: "JOB_ID",
  });

  try {
    var Results = await jobs.findAndCountAll({
      attributes: ["JOB_TITLE"],
      include: {
        model: employees,
        attributes: [
          [
            sequelize.fn("avg", sequelize.col("SALARY")),
            "average salary of employees",
          ],
        ],
        required: true,
      },
      group: ["JOB_ID"],
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count.length
  );
}

//Q10();

/*
11. Write a query to display job title, employee name, and 
    the difference between salary of the employee and minimum salary for the job.
- SQL -
SELECT j.JOB_TITLE , e.FIRST_NAME, e.SALARY-j.MIN_SALARY
FROM orm_test.employees  e join orm_test.jobs j
using(JOB_ID);
*/

async function Q11() {
  jobs.hasMany(employees, {
    foreignKey: "JOB_ID",

    sourceKey: "JOB_ID",
  });
  employees.belongsTo(jobs, {
    foreignKey: "JOB_ID",
  });

  try {
    var Results = await jobs.findAndCountAll({
      attributes: ["JOB_TITLE"],
      include: {
        model: employees,
        attributes: [
          "FIRST_NAME",
          [Sequelize.literal("SALARY - jobs.MIN_SALARY"), "difference"],
        ],
        required: true,
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q11();

/*
12. Write a query to display the job history that were done by any employee 
    who is currently drawing more than 10000 of salary.
- SQL -
SELECT j.*
FROM orm_test.employees  e join orm_test.Job_history j
using(employee_id)
where e.SALARY > 10000 ;
*/

async function Q12() {
  job_history.hasMany(employees, {
    foreignKey: "employee_id",
  });
  employees.belongsTo(job_history, {
    foreignKey: "employee_id",
  });

  try {
    var Results = await job_history.findAndCountAll({
      include: {
        model: employees,
        attributes: [],
        required: true,
        where: {
          SALARY: {
            [Op.gt]: 10000,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q12();

/*
13. Write a query to display department name, name (first_name, last_name), 
    hire date, salary of the manager for all managers whose experience is more than 15 years.
- SQL -
SELECT   d.DEPARTMENT_NAME ,m.FIRST_NAME,m.LAST_NAME ,m.HIRE_DATE 
FROM orm_test.departments as d join orm_test.employees as m 
on d.MANAGER_ID  = m.EMPLOYEE_ID
where 15 < year(now()) - year(m.hire_date) 
order by m.HIRE_DATE;
*/

async function Q13() {
  departments.hasOne(employees, {
    sourceKey: "MANAGER_ID",
    targetKey: "EMPLOYEE_ID",

    foreignKey: "EMPLOYEE_ID",
  });
  employees.belongsTo(departments, {
    foreignKey: "MANAGER_ID",
  });

  try {
    var Results = await departments.findAndCountAll({
      attributes: ["DEPARTMENT_NAME"],
      include: {
        model: employees,
        attributes: ["FIRST_NAME", "LAST_NAME", "HIRE_DATE"],
        required: true,

        where: Sequelize.literal("15 < year(now()) - year(hire_date)"),
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(
    "Results ",
    JSON.stringify(Results.rows, null, 2),
    "count is :",
    Results.count
  );
}

//Q13();

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
//testConnection();
