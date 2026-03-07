import { Note, Summary } from '../components/Callouts'
import ChapterNav from '../components/ChapterNav'

export default function P2PNetworking() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 2</div>
                <h1>P2P Networking in a nutshell</h1>
            </div>

            <Summary>
                <p>
                    This chapter aims to introduce the very basics of the Bitcoin Peer-to-Peer networking,
                    discussing peer (or node) discovery, blockchain synchronisation and others.
                </p>
            </Summary>

            <h2 id="introduction">Introduction</h2>

            <p>A Bitcoin full node serves several functions to the network:</p>

            <ul>
                <li><strong>Routing Node</strong> — propagates transactions and blocks</li>
                <li><strong>Full blockchain</strong> — also called archival node</li>
                <li><strong>Wallet</strong></li>
                <li><strong>Miner</strong></li>
            </ul>

            <p>
                By default most nodes will have a wallet and will be able to propagate information through
                the network. By default they are also archival nodes, i.e. they keep the complete list of all
                blocks from genesis. However, lately, some nodes opt to prune the size of the blockchain for
                storage purposes. Finally, only a few of those will provide mining services.
            </p>

            <p>
                In November 2022 there were around 14,663{' '}
                <a href="https://bitnodes.io/" target="_blank" rel="noopener noreferrer">nodes</a> in the
                network with ~99.9% of them using the Bitcoin Core implementation. A significant number of
                nodes (~53%) were using the{' '}
                <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer">Tor network</a>.
            </p>

            <h2 id="peer-discovery">Peer Discovery</h2>

            <p>
                When a node is run for the first time it needs to discover other peers so that it joins the
                P2P network. This is accomplished with several methods:
            </p>

            <dl>
                <dt>DNS seeds</dt>
                <dd>
                    A list of (hardcoded) DNS servers that return a random subset of bitcoin node addresses. It
                    sends a <code>getaddr</code> network message to those peers to get more bitcoin addresses.
                    The peers reply with an <code>addr</code> message that contains the addresses.
                </dd>
                <dt>Seed nodes</dt>
                <dd>
                    A list of (hardcoded) node IP addresses from peers that are believed to be stable and
                    trustworthy. This is a fallback to DNS seeds.
                </dd>
            </dl>

            <p>
                Node addresses are stored internally so the above discovery methods are only required at
                first run. A list of the connected peers can be acquired with the{' '}
                <code>getpeerinfo</code> command.
            </p>

            <h2 id="handshaking">Handshaking and Synchronisation</h2>

            <p>
                When a node connects to a new peer it initiates a <em>handshake</em> by sending a{' '}
                <code>version</code> network message to establish compatibility. If the receiving peer is
                compatible it will send a <code>verack</code> message followed by its own{' '}
                <code>version</code> message.
            </p>

            <p>
                Initially, a node that starts for the first time only contains the genesis block and will
                attempt to synchronise the blockchain from its peers. This initial synchronisation is called{' '}
                <code>Initial Block Download</code> or <code>IBD</code>. It sends a <code>getblocks</code>{' '}
                message which contains its current best block as a parameter. The receiving peers reply with
                an <code>inv</code> (inventory) message that contains a maximum of 500 block hashes.
            </p>

            <h2 id="block-propagation">Block Propagation and Relay Networks</h2>

            <p>
                The faster a miner receives a new block the faster they can start working on the next block.
                Since the P2P network takes some time there are specialized networks to help with block
                propagation, for example the <em>Fast Internet Bitcoin Relay Engine (FIBRE)</em>.
            </p>

            <p>
                FIBRE does not only help less-connected miners to compete with the bigger mining farms but
                more importantly reduces the chance of forks and orphan block rates.
            </p>

            <Note>
                <p>
                    The sole purpose of a relay network is to help propagate blocks fast between interested
                    parties (like merchants, miners). They do not replace the P2P network rather provide
                    additional connectivity between some nodes.
                </p>
            </Note>

            <ChapterNav
                prev={{ path: '/how-bitcoin-works', title: 'How Bitcoin Works' }}
                next={{ path: '/forking', title: 'Forking' }}
            />
        </>
    )
}
