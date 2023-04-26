export { User };
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasks_computed: {
        type: Number,
        default: 0,
    },
    compute: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);
