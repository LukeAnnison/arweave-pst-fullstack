import Arweave from 'arweave';
import { LoggerFactory, Warp, WarpFactory} from 'warp-contracts';

// ~~ Set up Warp ~~
// initialize Warp instance for use with Arweave mainnet
LoggerFactory.INST.logLevel('info');
export const warp: Warp = WarpFactory.forMainnet();

// ~~ Set up Arweave ~~
export const arweave: Arweave = warp.arweave;
