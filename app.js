// Task1: initiate app and run server at 3000

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path=require('path');

// Create Express application
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));


// Task2: create mongoDB connection 


mongoose.connect('mongodb+srv://anziyanazar26:974410@cluster0.5ufz5mb.mongodb.net/employeeDB?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((error) => {
    console.log("Error connecting to MongoDB Atlas: ", error);
});


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below
const employeeSchema =  new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

const Employee = mongoose.model('Employee',employeeSchema);

//TODO: get data from db  using api '/api/employeelist'

app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/employees', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        age: req.body.age,
        position: req.body.position
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});




//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/employees/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});





//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

module.exports = Employee;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

