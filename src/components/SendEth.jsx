import { useState } from 'react';
import propTypes from 'prop-types';
import { ethers } from 'ethers';
import { Button, TextField, Typography, Grid2 as Grid } from '@mui/material';
import { getEthereumRpcUrl } from '../utils/url';

const ETHEREUM_RPC_URL = getEthereumRpcUrl();

async function sendEth(privateKey, recipientAddress, amount) {
    const provider = new ethers.providers.JsonRpcProvider(ETHEREUM_RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const transaction = {
        to: recipientAddress,
        value: ethers.utils.parseEther(amount.toString()), // Convert amount to Wei
        gasLimit: ethers.utils.hexlify(21000), // Standard gas limit for a simple ETH transfer
    };

    const tx = await wallet.sendTransaction(transaction);
    await tx.wait(); // Wait for transaction confirmation
    return tx.hash;
}

export default function SendEthereum({ privateKey, index }) {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [txHash, setTxHash] = useState('');

    const handleSendEth = async () => {
        try {
            const tx = await sendEth(privateKey, recipientAddress, amount);
            setTxHash(tx);
            console.log("Transaction sent: ", tx);
        } catch (error) {
            console.error("Error sending Ethereum:", error);
        }
    };

    return (
        <Grid container>
            <Grid size={{ xs: 12 }}>
                <Typography variant='h6'>Send Ethereum from Wallet {index + 1}</Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
                <TextField
                    type="text"
                    placeholder="Recipient Address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    sx={{ width: "100%", py: 2, pr: 2 }}
                />
            </Grid>
            <Grid size={{ xs: 4 }}>
                <TextField
                    type="number"
                    placeholder="Amount (ETH)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ pr: 0, py: 2 }}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Button sx={{ width: "100%", color: 'white' }} onClick={handleSendEth}>Send</Button>
            </Grid>
            {txHash && <div>Transaction Hash: {txHash}</div>}
        </Grid>
    );
}

SendEthereum.propTypes = {
    privateKey: propTypes.string.isRequired,
    index: propTypes.number.isRequired,
};
