const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: Number,
        default: 0
        // 0 is normal user && 1 is admin.
    },
    verified: {
        type: Boolean,
        default: false
    },
    date_of_birth: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    profile_picture: {
        type: String,
        default: 'default.png',
        required: false
    }

}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)

/**
 * user signup
    - first name
    - last name
    - username  @unique
    - email     @unique
    - password  @a-z, A-Z, 0-9, special character @min 8, @max 21
    - role by default is user   @user
    - verified      - by false
    - dob
    - gender
    - created_at
    - updated_at
 */