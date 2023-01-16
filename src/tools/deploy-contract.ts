import fs from 'fs';
import path from 'path';
import { WarpFactory, LoggerFactory } from 'warp-contracts';

(async () => {
  // ~~ Initialize `LoggerFactory` ~~
  LoggerFactory.INST.logLevel('error');

  // ~~ Initialize Warp and generate wallet ~~
  const warp = WarpFactory.forMainnet();
  const jwk = await warp.arweave.wallets.generate();
  const walletAddress = await warp.arweave.wallets.jwkToAddress(jwk);

  // ~~ Read contract source and initial state files ~~
  const contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
  const stateFromFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../dist/contracts/initial-state.json'), 'utf8')
  );

  // ~~ Override contract's owner address with the generated wallet address ~~
  const initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
    },
  };

  // ~~ Deploy contract ~~
  const result = await warp.createContract.deploy({
    wallet: jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });

  // ~~ Log contract id to the console ~~
  console.log('Deployment completed: ', {
    ...result,
    sonar: `https://sonar.warp.cc/#/app/contract/${result.contractTxId}`
  });

})();
