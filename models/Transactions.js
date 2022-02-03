import pkg from 'mongoose';
const { Schema, model } = pkg;

const transactionsSchema = new Schema({
    wallet: { type: Schema.Types.ObjectId, ref: 'Wallets' },
    amount: { type: String, required: true },
    reference_id: { type: String, required: true },
    deposited_by: String,
    withdrawn_by: String,
},
    {
        timestamps: true
    })

export default model('Transactions', transactionsSchema)

