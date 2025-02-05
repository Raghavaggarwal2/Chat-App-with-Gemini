import projectModel from "../models/project.model.js"
import mongoose from 'mongoose';

export const createProject = async ({ name, userId }) => {
    if (!name) {
        throw new Error('Name is required');
    }
    if (!userId) {
        throw new Error('User is required');
    }
    let project;
    try {
        project = await projectModel.create({
            name,
            users: [userId]
        });
        return project;
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code in MongoDB
            throw new Error('Project name already exists');
        }
        throw error;
    }
}

export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) {
        throw new Error('User Id is required');
    }
    const allUserProjects = await projectModel.find({
        users: userId,
    });

    return allUserProjects;
}

export const addUsersToProject = async ({ projectId, users, userId }) => {
    if (!projectId) {
        throw new Error("Project Id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project Id");
    }
    if (!users || !Array.isArray(users)) {
        throw new Error("Users are required and should be an array");
    }
    users.forEach(userId => {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error(`Invalid User Id: ${userId}`);
        }
    });

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId,
    });

    if (!project) {
        throw new Error("User not belong to this project");
    }

    const updatedProject = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users,
            }
        }
    }, {
        new: true,
    });

    return updatedProject;
}

export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project Id");
    }

    const project = await projectModel.findOne({
        _id: projectId,
    }).populate('users');

    return project;
}

export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })

    return project;
}