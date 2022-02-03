import pkg from 'mongoose';
const { Schema, model } = pkg;

const walletsSchema = new Schema({
    customer_xid: { type: String, required: true },
    owned_by: String,
    status: { type: Boolean, default: false },
    enabled_at: Date,
    disabled_at: Date,
    balance: { type: Number, default: false },
    token: String
},
    {
        timestamps: true
    })

export default model('Wallets', walletsSchema)

