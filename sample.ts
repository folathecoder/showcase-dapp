import React, { useState, useEffect } from 'react';
import { ClickAwayListener } from '@mui/material';
import {
  ClaimContainer,
  ClaimMessageContainer,
  ClaimMessage,
  ClaimMessageCard,
  ClaimHeader,
  ClaimMessageCardWrap,
  ClaimCardContainer,
  PageLayout,
  ClaimLayout,
  ClaimSubLayout,
  RightSideBarContainer,
} from './ClaimStyles';
import ConnectButton from './Children/ConnectButton';
import rewardsLogo from '../../assets/images/rewardsLogo.png';
import claimBgOne from '../../assets/images/claimBg1.png';
import claimBgTwo from '../../assets/images/claimBg2.jpg';
import SimpleBar from 'simplebar-react';
import RightSideBar from '../../components/RightSideBar';
import ContactModal from './Children/ContactModal';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from './utils/constants';
import { Balance } from '@mui/icons-material';
declare let window: any;
const { ethereum } = window;

const Claim = () => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [metamaskInstalled, setMetamaskedInstalled] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [noClaim, setNoClaim] = useState(false);
  const [reimbursementBalance, setReimbursementBalance] = useState<any>(null);
  const [showContact, setShowContact] = useState(false);

  //UI Test code to switch the different states of the card onClick (state should be changed based on contract logic)
  const handleClaim = () => {
    setClaimLoading(true);
  };
  const handleClaimed = () => {
    setClaimLoading(false);
    setClaimed(true);
  };

  const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        setMetamaskedInstalled(false);
      } else {
        setMetamaskedInstalled(true);
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);

          //getAllTransactions()
        } else {
          console.log('No accounts found!');
        }
      }
    } catch (error) {}
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install metamask!');
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {}
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const getReimbursementBalance = async () => {
    if (currentAccount) {
      const contract = getEthereumContract();
      const balance = await contract._dues[currentAccount];
      if (balance === undefined || balance === 0) {
        setNoClaim(false);
      } else {
        setNoClaim(false);
        setReimbursementBalance(Balance);
      }
    }
  };

  getReimbursementBalance();

  // const getReimbursementClaim = async () => {
  //   if (currentAccount) {
  //     const contract = getEthereumContract();
  //     return await contract.claim();
  //   }
  // };

  return (
    <>
      <PageLayout>
        <ClaimLayout>
          <SimpleBar autoHide={true} style={{ height: '100%', width: '100%' }}>
            <ClaimSubLayout>
              <ClaimContainer>
                <ClaimHeader>
                  <img src={rewardsLogo} alt='sonar rewards' />
                </ClaimHeader>
                <ClaimMessageContainer
                  walletConnected={currentAccount !== null}
                >
                  <ClaimMessage>
                    <div>
                      <p>
                        Connect your wallet in order to claim your $PING rewards
                      </p>
                    </div>
                    <div className={'connect__button'}>
                      <ConnectButton connectEvent={connectWallet} />
                    </div>
                    {!metamaskInstalled && (
                      <div>
                        <p className='error__message'>
                          Note: Install metamask to connect
                        </p>
                      </div>
                    )}
                  </ClaimMessage>
                </ClaimMessageContainer>

                <ClaimCardContainer
                  className={'container_two'}
                  walletConnected={currentAccount !== null}
                >
                  <ClaimMessageCardWrap>
                    <ClaimMessageCard
                      bgImage={noClaim ? claimBgTwo : claimBgOne}
                    >
                      <div className={'message'}>
                        <p>{claimed ? 'You claimed' : 'Available to Claim'}</p>
                      </div>
                      <div>
                        <p className={'amount'}>
                          {noClaim ? 'Zero.' : `1,000,000`}
                        </p>
                        <p className={'ping'}>$PING</p>
                        {currentAccount && (
                          <p className={'address'}>{`${currentAccount.slice(
                            0,
                            8
                          )}...${currentAccount.slice(
                            currentAccount.length - 4,
                            currentAccount.length
                          )}`}</p>
                        )}
                      </div>
                      <div>
                        <>
                          {claimLoading && (
                            <button
                              onClick={handleClaimed}
                              className='claiming_reward'
                            >
                              Claiming Reward...
                              <div></div>
                            </button>
                          )}
                        </>
                        <>
                          {!claimLoading && !claimed && !noClaim && (
                            <button onClick={handleClaim}>Claim Now</button>
                          )}
                        </>
                        <>
                          {claimed && (
                            <button className='transaction_btn'>
                              See Transaction
                            </button>
                          )}
                        </>
                        <>
                          {noClaim && (
                            <button
                              onClick={() => setShowContact(!showContact)}
                            >
                              Not Correct?
                              <ClickAwayListener
                                onClickAway={() => setShowContact(false)}
                              >
                                <ContactModal showContact={showContact} />
                              </ClickAwayListener>
                            </button>
                          )}
                        </>
                      </div>
                    </ClaimMessageCard>
                  </ClaimMessageCardWrap>
                </ClaimCardContainer>
              </ClaimContainer>
            </ClaimSubLayout>
          </SimpleBar>
        </ClaimLayout>
        <RightSideBarContainer>
          <SimpleBar autoHide={true} style={{ height: '100%', width: '100%' }}>
            <RightSideBar setStepsEnabled={() => {}} enableTour={false} />
          </SimpleBar>
        </RightSideBarContainer>
      </PageLayout>
    </>
  );
};

export default Claim;
