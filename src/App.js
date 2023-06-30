import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState, useCallback } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockTransaction, setBlockTransaction] = useState(["empty"]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }
    getBlockNumber();
  });


  const sendRequest = useCallback(async () => {
    // don't send again while we are sending
    if (isSending) return

    // update state
    setIsSending(true)
    // send the actual request
    setBlockTransaction((await alchemy.core.getBlock(blockNumber)).transactions);
    setIsSending(false);

  }, [isSending]); // update the callback if the state changes

  return (<>
    <div className="App">Block Number: {blockNumber}</div>
    <input type="button" value='Show Details' disabled={isSending} onClick={sendRequest}/>
    <table>
      <tbody>
        <tr>
          <td>No.</td>
          <td>Transaction Hash</td>
        </tr>
        {blockTransaction.map((item, index) => {
          return (
            <tr key={index.toString()}>
                <td>{index+1}</td>
                <td>{item}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </>);
}

export default App;
