import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    website: { type: String, required: true },
}, { timestamps: true, toJSON: { transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        ret._links = {
            self: `/api-keys/${ret.id}`,
            collection: "/api-keys"
        };
    }}});

export default mongoose.model("ApiKey", apiKeySchema);
