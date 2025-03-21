const Students = require('../model/student.model')
const {reqChecker} = require('../helpers/reqChecker.helpers')
const mongoose = require('mongoose')


/**
 * @description Get All Students
 * @route GET /students
 * @access public
 */
const getAllStudents = async (req, res) => {
    try {
        const existingStudents = await Students.find();
        if (existingStudents.length === 0)
            return res.status(404).json({ message: "No students found" });
        return res.status(200).json(existingStudents);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};



/**
 * @description Get Student By Id
 * @route GET /students/:id
 * @access public
 */
const getStudent = async (req, res) => {
    const id = req.params.id;

    try {
        const existingStudent = await Students.findById(id);
        if(!existingStudent)
            return res.status(404).json({message: "Student not found"});
        return res.status(200).json(existingStudent);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @description Create Student
 * @route POST /students
 * @access public
 */
const createStudent = async (req, res) => {
    const { name, phone, grade, profilePicture, isActive, fees, assignedClasses, parentContact } = req.body;

    try {
        // Validate required fields
        const checkerValidation = reqChecker(req, ["name", "phone", "grade", "assignedClasses", "parentContact"]);
        if (checkerValidation.length > 0)
            return res.status(400).json({ message: "Missing required fields", missingFields: checkerValidation });

        // Create new student
        const newStudent = await Students.create({
            name,
            phone,
            grade,
            profilePicture,
            isActive,
            fees: Array.isArray(fees) ? fees.map(fee => mongoose.Types.ObjectId(fee)) : [],
            assignedClasses: Array.isArray(assignedClasses) ? assignedClasses.map(cls => mongoose.Types.ObjectId(cls)) : [],
            parentContact
        });

        return res.status(201).json({ message: "Student created successfully", newStudent });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

/**
 * @description Update Student
 * @route PUT /students/:id
 * @access public
 */
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, phone, grade, profilePicture, isActive, fees, assignedClasses, parentContact } = req.body;

    try {
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ message: "Invalid Student ID" });

        // Check if request body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
        }

        // Find and update student
        const updatedStudent = await Students.findByIdAndUpdate(
            id,
            {
                name,
                phone,
                grade,
                profilePicture,
                isActive,
                fees: Array.isArray(fees) ? fees.map(fee => mongoose.Types.ObjectId(fee)) : [],
                assignedClasses: Array.isArray(assignedClasses) ? assignedClasses.map(cls => mongoose.Types.ObjectId(cls)) : [],
                parentContact
            },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) 
            return res.status(404).json({ message: "Student not found" });

        return res.status(200).json({ message: "Student updated successfully", updatedStudent });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



/**
 * @description Delete Students
 * @route DELETE /students/:id
 * @access public
 */
const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(400).json({ message: "Invalid Student ID" });

        // Find and delete student
        const deletedStudent = await Students.findByIdAndDelete(id);

        if (!deletedStudent) 
            return res.status(404).json({ message: "Student not found or already deleted" });

        return res.status(200).json({ message: "Student deleted successfully", deletedStudent });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


module.exports = { getAllStudents, getStudent, createStudent, updateStudent, deleteStudent };