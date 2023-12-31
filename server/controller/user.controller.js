const User = require("../db/models/User.model");
const { throughError, created, badRequest, success, notFound, notModified } = require("../shared/utls/httpResponseHandler");
module.exports = {
    addUser: async (req, res) => {
        try {
            let { password, groupId, isEmailVerified, isPhoneVerified, fName, lName, email, phoneNumber, image, status, roleId } = req.body;
            if (!fName || !lName || !password) {
                return badRequest(res, "Name and password are required");
            }
            let newUser = {
            },
                emailExpression = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                numberExpression = /^\d{10}$/;;

            email && email.match(emailExpression) ? newUser.email = email.trim() : null;
            phoneNumber && phoneNumber.match(numberExpression) ? newUser.phoneNumber = phoneNumber : null;
            image ? newUser.image = image : null;
            status != undefined ? newUser.status = status : null;
            isEmailVerified ? newUser.isEmailVerified = isEmailVerified : null;
            isPhoneVerified ? newUser.isPhoneVerified = isPhoneVerified : null;
            newUser.fName = fName.trim();
            newUser.lName = lName.trim();
            newUser.name = fName.trim() + " " + lName.trim();
            password ? newUser.password = password : null;
            roleId ? newUser.roleId = roleId : null;
            groupId ? newUser.groupId = groupId : null;

            let user = new User(newUser);
            user.id = user._id;
            user.userId = Math.random().toString(36).substring(2, 9).slice(-11).toUpperCase() + Math.random(9).toString(30).substring(2, 3).toUpperCase();
            user = await user.save();
            return created(res, "successfully created", user);
        } catch (err) {
            return throughError(res, err);
        }
    },
    getUser: async (req, res) => {
        try {
            let page = +req.query.page || 1,
                limit = +req.query.limit || 10,
                total = await User.countDocuments({}),
                userId = req.query.userId,
                groupId = req.query.groupId;
            let query = {};
            groupId ? query.groupId = groupId : null;
            userId ? query.userId = userId : null;
            let user = await User.find(query).select("-__v _id").sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).lean();
            return success(res, "", user, { total: total, limit, page });
        } catch (err) {
            return throughError(res, err);
        }
    },
    getGroupUser: async (req, res) => {
        try {
            let groupId = req.query.groupId;
            if (!groupId) {
                return badRequest(res, "groupId is required");
            }
            let user = await User.find({ groupId: groupId }).select("-__v _id").sort({ _id: -1 }).lean();
            return success(res, "", user);
        } catch (err) {
            return throughError(res, err);
        }
    },

    deleteUser: async (req, res) => {
        try {
            let { id } = req.params;
            let deletedUser = await User.deleteOne({ id: id });
            return deletedUser.deletedCount ? success(res, "successfully deleted", {}) : notFound(res, "no user found", {});
        } catch (err) {
            return throughError(res, err);
        }
    },

    updateUser: async (req, res) => {
        try {
            let { id } = req.params;
            let { fName, lName, password, groupId, roleId, email, phoneNumber, image, status, isPhoneVerified, isEmailVerified } = req.body;
            let emailExpression = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                numberExpression = /^\d{10}$/;
            let updateObj = {};
            email && email.match(emailExpression) ? updateObj.email = email : null;
            phoneNumber && phoneNumber.match(numberExpression) ? updateObj.phoneNumber = phoneNumber : null;
            image ? updateObj.image = image : null;
            status != undefined ? updateObj.status = status : null;
            isEmailVerified ? updateObj.isEmailVerified = isEmailVerified : null;
            isPhoneVerified ? updateObj.isPhoneVerified = isPhoneVerified : null;
            fName ? updateObj.fName = fName.trim() : null;
            lName ? updateObj.lName = lName.trim() : null;
            fName || lName ? updateObj.name = fName.trim() + " " + lName.trim() : null;
            password ? updateObj.password = password : null;
            roleId ? updateObj.roleId = roleId : null;

            let updated = await User.updateOne({ userId: id }, { $set: updateObj });
            let user = await User.findOne({ userId }).select("-__v _id").lean();
            return updated.modifiedCount ? success(res, "", user) : notModified(res, "Unable to modify", user);
        } catch (err) {
            return throughError(res, err);
        }
    }
}