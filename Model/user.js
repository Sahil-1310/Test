import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs'
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fname: String,
    lname: String,
    username: String,
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    phone: {
        type: String,
        maxlength: 10,
        minlength: 10,
        default: null
    },
    countryCode: {
        type: String,
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 16,
        trim: true,
        required: true,
        select: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        default: ''
    },

    isActive: {
        type: Boolean,
        trim: true,
        default: false
    },
    isDelete: {
        type: Boolean,
        trim: true,
        default: false
    },
    isVerified: {
        type: Boolean,
        trim: true,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.static('findByEmail', async (value) => {
    let qry = { email: value.email };
    const result = await mongoose.model("user").countDocuments(qry)
    if (result >= 1) return true;
    else return false;
})

userSchema.static('findByPhone', async (value) => {
    let qry = { phone: value.phone, countryCode: value.countryCode };
    const result = await mongoose.model("user").countDocuments(qry)
    if (result >= 1) return true;
    else return false;
})

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcryptjs.genSaltSync(10)
        this.password = bcryptjs.hashSync(this.password, salt)
        return next()   // If you are creating the new document then just return next() middleware.
    }
})

module.exports = mongoose.model('user', userSchema)
