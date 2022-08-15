const { Sequelize, DataTypes, Op } = require("@sequelize/core");

const sequelize = new Sequelize("orm_test", "root", "system", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
  define: { timestamps: false, freezeTableName: true },
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

const countries = sequelize.define("countries", {
  COUNTRY_ID: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  COUNTRY_NAME: {
    type: DataTypes.STRING,
  },
  REGION_ID: {
    type: DataTypes.DECIMAL,
  },
});

const jobs = sequelize.define("jobs", {
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

const locations = sequelize.define("locations", {
  LOCATION_ID: {
    type: DataTypes.DECIMAL,
    primaryKey: true,
  },
  COUNTRY_ID: {
    type: DataTypes.STRING,
  },
  STREET_ADDRESS: {
    type: DataTypes.STRING,
  },
  POSTAL_CODE: {
    type: DataTypes.STRING,
  },
  CITY: {
    type: DataTypes.STRING,
  },
  STATE_PROVINCE: {
    type: DataTypes.STRING,
  },
});

const departments = sequelize.define("departments", {
  DEPARTMENT_ID: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  DEPARTMENT_NAME: {
    type: DataTypes.STRING,
  },
  MANAGER_ID: {
    type: DataTypes.DECIMAL,
  },
  LOCATION_ID: {
    type: DataTypes.DECIMAL,
  },
});

const job_history = sequelize.define("job_history", {
  EMPLOYEE_ID: {
    type: DataTypes.DECIMAL,
    primaryKey: true,
    allowNull: false,
  },
  START_DATE: {
    type: DataTypes.DATE,
  },
  END_DATE: {
    type: DataTypes.DATE,
  },
  JOB_ID: {
    type: DataTypes.STRING,
  },
  DEPARTMENT_ID: {
    type: DataTypes.DECIMAL,
  },
});

/*
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.log(err);
  });
  
  */

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
//testConnection();

module.exports = sequelize;
