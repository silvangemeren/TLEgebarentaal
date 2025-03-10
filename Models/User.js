import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    lessonsProgress: {
        les1: { type: Number, default: 0, min: 0, max: 100 },
        les2: { type: Number, default: 0, min: 0, max: 100 },
        les3: { type: Number, default: 0, min: 0, max: 100 },
        les4: { type: Number, default: 0, min: 0, max: 100 },
        les5: { type: Number, default: 0, min: 0, max: 100 },
        les6: { type: Number, default: 0, min: 0, max: 100 },
        les7: { type: Number, default: 0, min: 0, max: 100 }
    },
    loginCode: { type: String, required: true },
    playlists: [{
        title: { type: String, required: true },
        signs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sign' }]
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            ret._links = {
                self: { href: `${process.env.BASE_URL}/users/${ret.id}` },
                collection: { href: `${process.env.BASE_URL}/users` }
            };
            delete ret._id;
        }
    }
});

export default mongoose.model('User', userSchema);
