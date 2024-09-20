import { useState } from 'react';
import propTypes from 'prop-types';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import {Button, TextField, Typography, Grid2 as Grid} from '@mui/material';
import { getSolanaRpcUrl } from '../utils/url';

const SOLANA_RPC_URL = getSolanaRpcUrl();

async function sendSol(privateKey, recipientAddress, amount) {
    const connection = new Connection(SOLANA_RPC_URL);
    const senderKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const recipientKey = new PublicKey(recipientAddress);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: recipientKey,
            lamports: amount* 1e9
        })
    )
    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
    return signature;
}

export default function SendSolana({privateKey, index}) {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [txHash, setTxHash] = useState('');

    const handleSendSol = async () => {
        try {
            const tx = await sendSol(privateKey, recipientAddress, amount);
            setTxHash(tx);
            console.log("Transaction sent: ", tx);
        } catch (error) {
            console.error("Error sending Solana:", error);
        }
    }

    return (
        <Grid container>
            <Grid size={{xs: 12}} >
                <Typography variant='h6'>Send Solana from Wallet {index + 1}</Typography>
            </Grid>
            <Grid size={{xs: 8}}>
            <TextField
                type="text" 
                placeholder="Recipient Address" 
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)} 
                sx={{width: "100%", py:2, pr:2}}
            />
            </Grid>
            <Grid size={{xs: 4}} sx={{alignContent: "right"}}>
            <TextField 
                type="number" 
                placeholder="Amount (SOL)" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                sx={{pr:0, py:2}}
            />
            </Grid>
            <Grid size={{xs: 12}}>
                <Button sx={{width: "100%", color:'white'}} onClick={handleSendSol}>Send</Button>
            </Grid>
            {txHash && <div>Transaction Hash: {txHash}</div>}
        </Grid>
    )
}

SendSolana.propTypes = {
    privateKey: propTypes.string.isRequired,
    index: propTypes.number.isRequired,
}
