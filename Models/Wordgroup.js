import mongoose from 'mongoose';

const wordgroupSchema = new mongoose.Schema({
    wordgroup: { type: String, required: false },
    wordgroupNumber: { type: Number, required: false }
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

export default mongoose.model('Wordgroup', wordgroupSchema);