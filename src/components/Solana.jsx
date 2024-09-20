import { useState } from "react"
import propTypes from "prop-types"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import bs58 from "bs58";
import SendSolana from "./SendSol";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid2 as Grid, Typography, Modal} from "@mui/material";
import { CardComponent, PrivateKeyCard } from "./CustomComponents";
import { boxStyle } from "../utils/styles";
import { getSolanaRpcUrl } from "../utils/url";

const SOLANA_RPC_URL = getSolanaRpcUrl();

async function fetchBalance(publicKey) {
    console.log("RPC KEY :  ", SOLANA_RPC_URL);
    const connection = new Connection(SOLANA_RPC_URL);
    const key = new PublicKey(publicKey);
    const balance = await connection.getBalance(key);
    return balance;
}


export default function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [secretKeys, setSecretKeys] = useState([]);
    const [balances, setBalances] = useState([]);
    const [openSendModal, setOpenSendModal] = useState(false);

    const handleModalOpen = () => {
        setOpenSendModal(true);
    }
    const handleModalClose = () => {
        setOpenSendModal(false);
    }

    return <Box>
        <Grid container>
                <Grid size={6} >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>Solana</Typography>
                </Grid>
            
            <Grid size={6} sx={{alignItems: "right"}}>
            <Box display="flex" justifyContent="flex-end">
        <Button sx={{mt: 0,
        mb: 4,
              mr: 2,
              px: 2,
              py: 1,
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              fontWeight: 900, }} onClick={function() {
            const seed = mnemonicToSeed(mnemonic);
            const path = `m/44'/501'/${currentIndex}'/0'`;
            const derivedSeed = derivePath(path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            setCurrentIndex(currentIndex + 1);
            setPublicKeys([...publicKeys, keypair.publicKey]);
            setSecretKeys([...secretKeys, bs58.encode(keypair.secretKey)]);
            fetchBalance(keypair.publicKey.toBase58()).then(balance => {
                setBalances([...balances, balance]);
                console.log(balances)
            })
        }}>
            Add SOL wallet
        </Button>

        <Button sx={{mt: 0,
        mb: 4,
              mr: 2,
              px: 2,
              py: 1,
              backgroundColor: 'red',
              color: 'black',
              '&:hover': {
                backgroundColor: '#F08080',
              },
              fontWeight: 900, }} onClick={async function() {
                setPublicKeys([]);
              }}>Clear Wallets</Button>

              </Box>
              </Grid>
              </Grid>
        
        {publicKeys.map((p, i) => (<Accordion key={p.toBase58()}>
            <AccordionSummary>
                <Grid container sx={{height: "100%", width: "100%"}}>
                    <Grid size={{xs: 10, lg: 11}} sx={{alignContent: "center"}}>
                        <Typography sx={{fontSize: 18, px:2}}>Wallet {i+1}</Typography>
                    </Grid>
                    <Grid size={{xs: 2, lg:1}}>
                        <Button onClick={handleModalOpen} sx={{color: "white"}}>Send SOL</Button>
                    </Grid>
                    <Modal open={openSendModal} onClose={handleModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"> 
                        <Box sx={boxStyle}>
                            <SendSolana privateKey={secretKeys[i]} index={i}/> 
                        </Box>
                    </Modal>
                </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{background: (theme) => theme.palette.grey[800]}}>
            <CardComponent title={`Public Key`} content={p.toBase58()} />
            <PrivateKeyCard privateKey={secretKeys[i]} />
            <CardComponent title={`Balance`} content={balances[i]} />
            </AccordionDetails>
        </Accordion>))}
        
    </Box>
}

SolanaWallet.propTypes = {
    mnemonic: propTypes.string.isRequired
}

