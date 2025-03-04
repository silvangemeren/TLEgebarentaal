import mongoose from 'mongoose';

const signSchema = new mongoose.Schema({
    translation: { type: String, required: true },
    video: { type: String, required: true },
    gif: { type: String, required: true },
    lesson: { type: Number, required: true },
    explanation: { type: String, required: false },
    handShapesL: {
        // [shape: string, imageUrl: string]
        type: Array, required: false, _id: false
    },
    handShapesR: {
        // [shape: string, imageUrl: string]
        type: Array, required: false, _id: false
    },
    mouthShape: {
        // [shape: string, imageUrl: string]
        type: Array, required: false, _id: false
    },
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.BASE_URL}/signs/${ret.id}`
                },
                collection: {
                    href: `${process.env.BASE_URL}/signs`
                }
            }

            delete ret._id
        }
    }
});

export default mongoose.model('Sign', signSchema);