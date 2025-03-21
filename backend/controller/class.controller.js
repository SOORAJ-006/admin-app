const {reqChecker} = require("../helpers/reqChecker.helpers.js")
const Classes = require('../model/classes.model.js')

const createClass = async (req,res) => {
    const {name, teacher, fees, address, days, assignedStudents, students} = req.body;

    try {
        const checkerValidation = reqChecker(req, ["name", "teacher", "fees", "address", "days"])

        if (checkerValidation.length > 0)
            return res.status(400).json({message: checkerValidation});

        const existingClasses = await Classes.findOne({name})

        if (existingClasses)
            return res.status(400).json({message: "Class already exists"});

        const newClass = await Classes.create({
            name,
            teacher,
            fees,
            address,
            days
        })

        return res.status(200).json({message: "Class created successfully", newClass});
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
}

const updateClass = async(req,res) => {
    const id = req.params.id;
    const {name, teacher, fees, address, days, assignedStudents, students} = req.body;

    try {
        const existingClasses = await Classes.findById(id)
        if (!existingClasses)
            return res.status(404).json({message: "Class not found"});

        const updatedClass = await Classes.findByIdAndUpdate(
            id,
            { 
                name, 
                teacher: mongoose.Types.ObjectId(teacher), 
                fees, 
                address, 
                days, 
                assignedStudents: assignedStudents.map(student => mongoose.Types.ObjectId(student)) 
            },
            { new: true }
        );

        return res.status(200).json({message: "Class updated successfully", updatedClass});  // Return updated user object.  If you want the original, use `existingUser` instead.  The `new: true` option makes findByIdAndUpdate return the updated document instead of the original.
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deleteClass = async (req,res) => {
    const id = req.params.id;

    try {
        const existingClasses = await Classes.findById(id);
        if (!existingClasses)
            return res.status(404).json({message: "Class not found"});

        await Classes.findByIdAndDelete(id);

        return res.status(200).json({message: "Class deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

const getClass = async (req,res) => {
    const id = req.params.id;

    try {
        const existingClasses = await Classes.findById(id);
        if (!existingClasses)
            return res.status(404).json({message: "Class not found"});

        return res.status(200).json(existingUser);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

const getAllClasses = async (req,res) => {
    try {
        const existingClasses = await Classes.find()
        if(!existingClasses)
            return res.status(404).json({message: "No classes found"});

        return res.status(200).json(existingClasses);  
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports = { createClass, updateClass, deleteClass, getClass, getAllClasses };