const Event = require("../model/events.model");
const User = require("../model/users.model");
const Student = require("../model/student.model");

/**
 * @description Create a new event (Admin Only)
 * @route POST /events
 * @access Admin
 */
const createEvent = async (req, res) => {
    try {
        const { name, description, occurrences } = req.body;

        // Ensure the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // Validate occurrences
        if (!occurrences || occurrences.length === 0) {
            return res.status(400).json({ message: "At least one event occurrence is required." });
        }

        const event = await Event.create({
            name,
            description,
            createdBy: req.user._id,
            occurrences
        });

        return res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @description Add student to an event (Teachers Only)
 * @route POST /events/:eventId/add-student
 * @access Teacher
 */
const addStudentToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { studentId, grade, feeAmount } = req.body;

        // Ensure the user is a teacher
        if (req.user.role !== "instructor") {
            return res.status(403).json({ message: "Access denied. Teachers only." });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        event.participants.push({
            studentId,
            grade,
            feeAmount,
            feeStatus: "Unpaid",
            addedBy: req.user._id
        });

        await event.save();

        return res.status(200).json({ message: "Student added to event", event });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @description Update participation fee status (Teachers Only)
 * @route PUT /events/:eventId/update-fee/:studentId
 * @access Teacher
 */
const updateFeeStatus = async (req, res) => {
    try {
        const { eventId, studentId } = req.params;
        const { feeStatus } = req.body;

        if (!["Paid", "Unpaid"].includes(feeStatus)) {
            return res.status(400).json({ message: "Invalid fee status" });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const participant = event.participants.find(
            (p) => p.studentId.toString() === studentId
        );

        if (!participant) return res.status(404).json({ message: "Student not found in this event" });

        participant.feeStatus = feeStatus;

        await event.save();

        return res.status(200).json({ message: "Fee status updated", event });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @description Get all events
 * @route GET /events
 * @access Public
 */
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name").populate("participants.studentId", "name");
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @description Get event by ID
 * @route GET /events/:id
 * @access Public
 */
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate("createdBy", "name").populate("participants.studentId", "name");

        if (!event) return res.status(404).json({ message: "Event not found" });

        return res.status(200).json(event);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/**
 * @description Delete an event (Admin Only)
 * @route DELETE /events/:id
 * @access Admin
 */
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const event = await Event.findByIdAndDelete(id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    addStudentToEvent,
    updateFeeStatus,
    getAllEvents,
    getEventById,
    deleteEvent
};