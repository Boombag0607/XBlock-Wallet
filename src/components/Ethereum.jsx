import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { mnemonicToSeed } from "bip39";
import { JsonRpcProvider, Wallet, HDNodeWallet } from "ethers";
import { Box, Button, Typography, Grid2 as Grid, Accordion, AccordionSummary, AccordionDetails, Modal } from "@mui/material";
import { CardComponent, PrivateKeyCard } from "./CustomComponents";
import { boxStyle } from "../utils/styles";
import SendEthereum from "./SendEth";
import { getEthereumRpcUrl } from "../utils/url";

const ETHEREUM_RPC_URL = getEthereumRpcUrl();

async function fetchBalance(address) {
    const provider = new JsonRpcProvider(ETHEREUM_RPC_URL);
    return provider.getBalance(address);
}

export default function EthWallet ({mnemonic}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [privateKeys, setPrivateKeys] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [balances, setBalances] = useState([]);
    const [openSendModal, setOpenSendModal] = useState(false);

    const handleModalOpen = () => {
        setOpenSendModal(true);
    }
    const handleModalClose = () => {
        setOpenSendModal(false);
    }

    useEffect(() => {
        console.log(balances[currentIndex -1]);
    }, [balances, currentIndex]);

    return (
        <Box >
            <Grid container>
                <Grid size={6} >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>Ethereum</Typography>
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
              fontWeight: 900, }} onClick={async function() {
                setIsFetching(true);
                try {
                    const seed = await mnemonicToSeed(mnemonic);
                    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
                    const hdNode = HDNodeWallet.fromSeed(seed);
                    const child = hdNode.derivePath(derivationPath);
                    const privateKey = child.privateKey;
                    const wallet = new Wallet(privateKey);

                    const balance = await fetchBalance(wallet.address);

                    setBalances(prevBalances => [...prevBalances, balance]);
                    setPrivateKeys(prevPrivateKeys => [...prevPrivateKeys, privateKey]);
                    setAddresses(prevAddresses => [...prevAddresses, wallet.address]);

                    setCurrentIndex(currentIndex + 1);
                } catch (err) {
                    console.log(err);
                } finally {
                    setIsFetching(false);
                }
            }}
            disabled={isFetching} >
                {isFetching ? "Fetching Balance..." : "Add ETH wallet"}
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
                setAddresses([]);
              }}>Clear Wallets</Button>
              </Box>
            </Grid>
            </Grid>

            {addresses.map((p, i) => (
                <Accordion key={p}>
                <AccordionSummary >
                <Grid container sx={{height: "100%", width: "100%"}}>
                    <Grid size={{xs: 10, lg: 11}} sx={{alignContent: "center"}}>
                        <Typography sx={{fontSize: 20, px:2}}>Wallet {i+1}</Typography>
                    </Grid>
                    <Grid size={{xs: 2, lg:1}}>
                        <Button onClick={handleModalOpen} sx={{color: "white"}}>Send ETH</Button>
                    </Grid>
                    <Modal open={openSendModal} onClose={handleModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"> 
                        <Box sx={boxStyle}>
                            {/* <SendSolana privateKey={secretKeys[i]} index={i}/>  */}
                            <SendEthereum privateKey={privateKeys[i]} index={i}/>
                        </Box>
                    </Modal>
                </Grid>
            </AccordionSummary>
            <AccordionDetails sx={{background: (theme) => theme.palette.grey[800]}}>
                    <CardComponent title={`Public Key`} content={p} />
                    <PrivateKeyCard privateKey={privateKeys[i]} />
                    <CardComponent title={`Balance`} content={balances[i].toString()} />
                </AccordionDetails>
            </Accordion>
            ))}
        </Box>
    )
}

EthWallet.propTypes = {
    mnemonic: propTypes.string.isRequired
}