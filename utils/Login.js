import jwt from 'jsonwebtoken';
import { key } from '../config/key.js';
import Wallets from '../models/Wallets.js';
import Response from './Response.js';

export async function Login(req, res, next) {
    let token = req.header('Authorization');
    try {
        if (!token) throw 'Token undefined';
        token = token.split(' ')[1];
        const { customer_xid } = jwt.verify(token, key.privatekey);
        const wallet = await Wallets.findOne({ customer_xid });
        req.walletId = wallet._id;
        req.walletOwner = wallet.customer_xid;
        if (wallet.token) {
            return next()
        }
        res.status(500).json(new Response({ message: 'Wallet not valid' }, false));
    } catch (err) {
        console.log(err)
        res.status(500).json(new Response({ message: 'Auth required' }, false));
    }
}