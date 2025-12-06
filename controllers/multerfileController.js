import fs from "fs";

// temporary database
let filesDB = [];   // In-memory storage
let idCounter = 1;

export const uploadFile = (req, res) => {
    const username = req.body.username;

    if (!req.file) {
        return res.status(401).json({
            message: "No file uploaded",
            success: false,
        });
    }

    const newRecord = {
        id: idCounter++,
        username,
        filePath: req.file.path
    };

    filesDB.push(newRecord);
    console.log("newRecord", newRecord);
    console.log("filesDB", filesDB);
    console.log("idCounter", idCounter);
    return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: newRecord
    });
};

export const getAllFiles = (req, res) => {
    console.log(filesDB);
    return res.status(201).json({
        success: true,
        message: "all files extracted",
        files: filesDB
    });
};

export const getFilesById = (req, res) => {
    const id = Number(req.params.id);

    const file = filesDB.find((f) => f.id === id);

    if (!file) {
        return res.status(401).json({
            success: false,
            message: "File not found"
        });
    }
    console.log("file", file);
    console.log("filesDB", filesDB);
    console.log("idCounter", idCounter);
    return res.status(201).json({
        success: true,
        message: "file found",
        files: file
    });
};

export const updateFile = (req, res) => {
    const id = Number(req.params.id);
    const record = filesDB.find((f) => f.id === id);

    if (!record) {
        return res.status(401).json({
            success: false,
            message: "File not found"
        });
    }

    if (req.file) {
        fs.unlink(record.filePath, err => {
            if (err) {
                console.log("error deleting old file:", err);
            }
        })
        record.filePath = req.file.path;
    }

    if (req.body.username) {
        record.username = req.body.username;
    }

    return res.status(201).json({
        success: true,
        message: "Record updated successfully",
        record
    });
};

export const deleteFile = (req, res) => {
    const id = Number(req.params.id);
    const record = filesDB.find((f) => f.id === id);

    if (!record) {
        return res.status(401).json({
            success: false,
            message: "File not found"
        });
    }

    fs.unlink(record.filePath, err => {
        if (err) console.log("Error deleting file:", err);
    });

    filesDB = filesDB.filter((f) => f.id !== id);

    console.log("filesDB",filesDB);
    console.log("idCounter",idCounter);

    return res.status(201).json({
        success: true,
        message: "Record deleted successfully",
    });
}

