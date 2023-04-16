const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (employees === undefined || employees.length == 0)
    return res.status(404).json({ message: 'No employees found' });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const newEmployee = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: 'First and last names are required.' });
  }

  const duplicateEmployee = await Employee.findOne(newEmployee).exec();
  if (duplicateEmployee)
    return res.status(409).json({ message: 'Employee already exists' });

  try {
    const result = await Employee.create(newEmployee);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter required' });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(404)
      .json({ message: `Employee ${employee._id} not found` });
  }
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  const updatedEmployee = await employee.save();
  res.status(301).json(updatedEmployee);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter required' });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.status(301).json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'ID parameter required' });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(404)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.status(200).json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
