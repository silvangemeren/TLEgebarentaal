import mongoose from 'mongoose';

const loginCodeSchema = new mongoose.Schema({
    loginCode: { type: String, required: true, },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            ret.id = ret._id.toString()
            ret._links = {
                self: { href: `${process.env.BASE_URL}/logincodes/${ret.id}` },
                collection: { href: `${process.env.BASE_URL}/logincodes` }
            }
            delete ret._id
        }

    }
})

export default mongoose.model('LoginCode', loginCodeSchema);