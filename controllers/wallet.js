import Response from '../utils/Response.js';
import Wallets from '../models/Wallets.js';
import Transactions from '../models/Transactions.js';
import jwt from 'jsonwebtoken';
import { key } from "../config/key.js";

export async function initializeWallet(req, res, next) {
    const { customer_xid } = req.body;
    try {
        if (!customer_xid || customer_xid.length < 1) {
            throw { message: { customer_xid: ["Missing data for required field."] } }
        }
        const token = jwt.sign({ customer_xid }, key.privatekey);
        const wallet = await Wallets.create({
            customer_xid,
            token
        })
        res.json(new Response({ token: wallet.token }));
    } catch (err) {
        next(err);
    }
}

export async function enableWallet(req, res, next) {
    const { walletId } = req;
    try {
        const check = await Wallets.findById(walletId);
        if (check.status) {
            throw { message: "Already enabled" }
        }
        const wallet = await Wallets.findByIdAndUpdate(walletId, {
            status: true,
            enabled_at: new Date()
        }, { new: true })
        const resWallet = {
            id: wallet._id,
            owned_by: wallet.customer_xid,
            status: wallet.status ? "enabled" : "disabled",
            enabled_at: wallet.enabled_at,
            balance: wallet.balance
        }
        res.json(new Response({ wallet: resWallet }));
    } catch (err) {
        next(err);
    }
}

export async function viewBalance(req, res, next) {
    const { walletId } = req;
    try {
        const check = await Wallets.findById(walletId);
        if (!check.status) {
            throw { message: "Disabled" }
        }
        const wallet = await Wallets.findById(walletId);
        const resWallet = {
            id: wallet._id,
            owned_by: wallet.customer_xid,
            status: wallet.status ? "enabled" : "disabled",
            enabled_at: wallet.enabled_at,
            balance: wallet.balance
        }
        res.json(new Response({ wallet: resWallet }))
    } catch (err) {
        next(err)
    }
}

export async function depositMoney(req, res, next) {
    const { walletId, walletOwner } = req;
    const { amount, reference_id } = req.body;
    try {
        const check = await Wallets.findById(walletId)
        if (!check.status) {
            throw { message: "Disabled" }
        }
        if(!reference_id || reference_id.length<1){
            throw { message: "reference_id required" }
        }
        const transaction = await Transactions.create({
            wallet: walletId,
            amount,
            reference_id,
            deposited_by: walletOwner
        })
        const wallet = await Wallets.findByIdAndUpdate(walletId, {
            $inc: {
                balance: amount
            },
        })
        const deposit = {
            id: transaction._id,
            deposited_by: transaction.deposited_by,
            status: "success",
            deposited_at: transaction.createdAt,
            amount,
            reference_id
        }
        res.json(new Response({ deposit }))
    } catch (err) {
        next(err)
    }
}

export async function withdrawalMoney(req, res, next) {
    const { walletId, walletOwner } = req
    const { amount, reference_id } = req.body
    try {
        const check = await Wallets.findById(walletId)
        if (!check.status) {
            throw { message: "Disabled" }
        }
        if(!reference_id || reference_id.length<1){
            throw { message: "reference_id required" }
        }
        if (check.balance < amount) {
            throw { message: "Not enough money!" }
        }
        const transaction = await Transactions.create({
            wallet: walletId,
            amount,
            reference_id,
            withdrawn_by: walletOwner
        })
        const wallet = await Wallets.findByIdAndUpdate(walletId, {
            $inc: {
                balance: -Number(amount)
            },
        })
        const withdrawal = {
            id: transaction._id,
            withdrawn_by: transaction.withdrawn_by,
            status: "success",
            withdrawn_at: transaction.createdAt,
            amount,
            reference_id
        }
        res.json(new Response({ withdrawal }))
    } catch (err) {
        next(err)
    }
}

export async function disableWallet(req, res, next) {
    const { walletId } = req;
    const { is_disabled } = req.body;
    try {
        if (is_disabled != 'true') {
            throw { message: "Need req.body: is_disabled = true" }
        }
        const check = await Wallets.findById(walletId)
        if (!check.status) {
            throw { message: "Already disabled" }
        }
        const wallet = await Wallets.findByIdAndUpdate(walletId, {
            status: false,
            disabled_at: new Date()
        }, { new: true })
        const resWallet = {
            id: wallet._id,
            owned_by: wallet.customer_xid,
            status: wallet.status ? "enabled" : "disabled",
            disabled_at: wallet.disabled_at,
            balance: wallet.balance
        }
        res.json(new Response({ wallet: resWallet }))
    } catch (err) {
        next(err)
    }
}