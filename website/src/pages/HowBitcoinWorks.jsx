import CodeBlock from '../components/CodeBlock'
import { Note, Summary, Exercise, Emphbox } from '../components/Callouts'
import Figure from '../components/Figure'
import ChapterNav from '../components/ChapterNav'

export default function HowBitcoinWorks() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 1</div>
                <h1>How Bitcoin Works</h1>
            </div>

            <Summary>
                <p>
                    This chapter provides a high-level introduction of how Bitcoin works. It aims to be a
                    summary of the prerequisite knowledge required by the reader before moving into the
                    following chapters. The operation of the Bitcoin network is demonstrated with a walkthrough
                    of a transaction and its journey from its creation up until its final destination, the
                    Bitcoin blockchain.
                </p>
            </Summary>

            <h2 id="story-of-a-transaction">The Story of a Transaction</h2>

            <p>
                Transactions specify the transfer of bitcoin ownership. Assume we have three actors; Zed,
                Alice and Bob. Zed has sent 1.5 bitcoins to Alice with TX<sub>x</sub> and Alice wants to
                send 1 bitcoin to Bob. The transaction history will already have an entry of how Alice got
                her bitcoins (e.g. from Zed).
            </p>

            <Note>
                <p>
                    Internally, the Bitcoin protocol operates with satoshis: 1 satoshi = 0.00000001 BTC. Thus,
                    when we want to transfer 1 BTC we actually transfer 100,000,000 satoshis.
                </p>
            </Note>

            <p>
                To send 1 bitcoin (or <em>BTC</em>) Alice needs to create a transaction TX<sub>y</sub> that
                sends 1 BTC to Bob. We know that Alice has at least 1.5 BTC from TX<sub>x</sub>.
            </p>

            <Emphbox>
                <pre>
                    {`TX_x: 1Zed transfers 1.5 BTC to 1Alice
TX_y: 1Alice transfers 1 BTC to 1Bob`}
                </pre>
            </Emphbox>

            <p>
                The names 1Zed, 1Alice and 1Bob are short for the actual bitcoin addresses of Zed, Alice and
                Bob respectively. So Alice will send 1 BTC from her 1Alice bitcoin address to Bob to his
                1Bob address.
            </p>

            <p>
                Alice has to prove that she is indeed the owner of the address 1Alice when she creates the
                TX<sub>y</sub>. Bob does not need to do anything to receive the bitcoins.
            </p>

            <p>
                A transaction can consist of several <em>inputs</em> (outputs of past transactions) and
                several <em>outputs</em> (addresses to send bitcoins to). When an input is used it is
                completely consumed; i.e. all the bitcoins that the TX contains as inputs need to
                be <em>spent</em>.
            </p>

            <Figure
                src="./images/typical-transaction.png"
                caption="Typical one input two outputs transaction."
                label="fig-typical-transaction"
            />

            <p>
                The amount of all the inputs needs to be greater or equal to the amounts of outputs. If
                greater (recommended) the difference is an implied transaction fee that goes to the miners.
                A typical transaction transfers some bitcoins to another user and returns the remaining
                bitcoins as change to the originating address or another address that the sender controls.
            </p>

            <Note>
                <p>
                    For privacy reasons it is recommended to send the change to a different address than the
                    originating. Most bitcoin wallets already do this behind the scenes.
                </p>
            </Note>

            <p>
                Any number of inputs and outputs is possible as long as a transaction fee is included; the
                larger the transaction the larger the transaction fee. The unspent outputs are called{' '}
                <em>Unspent Transaction Outputs (UTXOs)</em> and the set of UTXOs is essentially all the
                available bitcoins in the network.
            </p>

            <p>
                Once a transaction is created it needs to be sent to a Bitcoin node. After the node receives
                the transaction it checks if it is valid. If it is valid the node will propagate it to all
                its peers, i.e. the other nodes that it is aware of. In turn, the other nodes will check if
                the transaction is valid and so on and so forth until all nodes receive the transaction.
            </p>

            <Figure
                src="./images/transaction-propagation.png"
                caption="Example of transaction propagation through the network."
                label="fig-transaction-propagation"
            />

            <h2 id="from-transactions-to-blocks">From Transactions to Blocks</h2>

            <p>
                From a Bitcoin's node perspective, the node receives transactions and places all valid ones
                into its memory pool, or <em>mempool</em>. It keeps receiving new ones until it decides that
                it will group some of those transactions into a block.
            </p>

            <Figure
                src="./images/node-perspective.png"
                caption="A node receives transactions into its mempool and can attempt to create new blocks for the network."
                label="fig-node-perspective"
            />

            <Note>
                <p>
                    We are describing what mining nodes typically do. The majority of nodes are not mining nodes
                    and thus do not attempt to create new blocks, rather they validate and propagate valid
                    transactions and blocks when they are aware of them.
                </p>
            </Note>

            <p>
                Every block contains a <em>coinbase</em> transaction that is added by the miner and it
                sends a deterministically calculated reward to an address of the miner's choosing. Finally a
                header is added to the block containing important information that links this block to its
                parent and other information that we will examine in the next section.
            </p>

            <h2 id="mining-basics">Mining: basics</h2>

            <p>
                After a node creates a block it will attempt to make it final by propagating it to all other
                nodes in the network. Multiple nodes will receive the same transactions and will create
                blocks; nodes choose which TXs to include. They can create and propagate a block at any time.
            </p>

            <Emphbox>
                <pre>
                    {`But how do we select which blocks will be part of the blockchain?
Since miners include a reward for themselves everyone wants their
block to be the next block in the blockchain. In other words, how
do we avoid spam and Denial of Service (DoS) attacks?`}
                </pre>
            </Emphbox>

            <p>
                For a block to be considered valid a miner has to prove that he has done some intensive
                computational work. Thus, miners have to spend resources before they create a block. This
                mechanism of proving computational work is called <em>Proof-of-Work (PoW)</em> and it
                involves solving a problem or puzzle. PoW puzzles have the fundamental property of being
                difficult to solve but trivial to validate their correctness.
            </p>

            <p>
                Bitcoin mining is the process of solving the PoW puzzle and selecting the next valid block in
                a way that is undisputed and thus achieve consensus on the current blockchain state. Bitcoin
                uses the Hashcash PoW algorithm for its mining.
            </p>

            <Figure
                src="./images/different-nodes-mining.png"
                caption="All nodes will eventually receive all transactions but they are free to include them into a block as they see fit."
                label="fig-different-nodes-mining"
            />

            <p>
                The Proof-of-Work puzzle is to compute a cryptographic hash of the new block that we want to
                create which should be less than a target number. Since a hash is random it will take several
                attempts to find a proper hash but other nodes will verify with only one attempt.
            </p>

            <Note>
                <p>
                    A cryptographic hash function is a hash function that takes an arbitrary block of data and
                    returns a fixed-size bit string, the cryptographic hash value, such that any (accidental or
                    intentional) change to the data will also change the hash value significantly.
                </p>
            </Note>

            <p>
                As more miners join the blocks will be created faster so the puzzle's difficulty
                automatically adjusts (increases) so that it again requires approximately 10 minutes to
                solve. This <em>difficulty adjustment</em> is happening every 2016 blocks, which is
                approximately 2 weeks if each block takes 10 minutes to mine.
            </p>

            <p>
                The hash algorithm used is <code>SHA256</code> and it is applied twice to the block header.
            </p>

            <Emphbox>
                <pre>{`SHA256( SHA256( block_header ) )`}</pre>
            </Emphbox>

            <p>
                The miner that successfully creates a valid block first will get the bitcoin reward that they
                have set themselves in the coinbase transaction as well as the fees from all the transactions
                in the block.
            </p>

            <p>
                The block reward can be deterministically calculated according to the current{' '}
                <em>block height</em>. The reward started at 50 bitcoins and is halved every 210,000 blocks
                (approximately 4 years). The mining reward can be claimed by the miner only after 100{' '}
                <em>confirmations</em>.
            </p>

            <h2 id="mining-technical">Mining: a bit more technical</h2>

            <p>The structure of the block header is as follows:</p>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Description</th>
                            <th>Size (bytes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>version</td><td>Block version number</td><td>4</td></tr>
                        <tr><td>hashPrevBlock</td><td>256-bit hash of the previous block</td><td>32</td></tr>
                        <tr><td>hashMerkleRoot</td><td>256-bit hash representing all the TXs in the block</td><td>32</td></tr>
                        <tr><td>timestamp</td><td>Seconds since 1970-01-01T00:00 UTC</td><td>4</td></tr>
                        <tr><td>target (bits)</td><td>The target that the hash should be less than</td><td>4</td></tr>
                        <tr><td>nonce</td><td>32-bit number</td><td>4</td></tr>
                    </tbody>
                </table>
            </div>

            <h3>hashMerkleRoot</h3>

            <p>
                A block has two parts, the header and the transactions. Since we only hash the block header
                to link blocks together, a header needs to represent the whole block, including all its
                transactions. The transactions are indirectly hashed via using a merkle root.
            </p>

            <p>
                A <a href="https://en.wikipedia.org/wiki/Merkle_tree" target="_blank" rel="noopener noreferrer">merkle tree</a>{' '}
                is constructed by concatenating all the transaction hashes, in pairs. The resulting hashes
                are again concatenated and hashed until only a single hash remains, the merkle root.
            </p>

            <Figure
                src="./images/merkle-tree.png"
                caption="Simple merkle root calculation of coinbase and three transactions."
                label="fig-merkle-tree"
            />

            <h3>hashPrevBlock</h3>

            <p>
                This is the hash of the previous block in the blockchain. It designates the parent of the
                current block and it is effectively what chains the blocks together.
            </p>

            <h3>target</h3>

            <p>
                Target bits or just bits is represented as an 8 hex-digit number. The first 2 digits are the
                exponent and the rest the coefficient.
            </p>

            <Emphbox>
                <pre>{`target = coefficient * 2^(8 * (exponent - 3))`}</pre>
            </Emphbox>

            <p>
                The highest possible target (the easiest target) is defined as <code>0x1d00ffff</code> and
                gives a 32-byte target of:
            </p>

            <Emphbox>
                <pre style={{ fontSize: '0.8em' }}>{`0x00000000ffff0000000000000000000000000000000000000000000000000000`}</pre>
            </Emphbox>

            <p>In Python that would be calculated as follows:</p>

            <CodeBlock language="python" code={`>>> 0x00ffff * 2**(8*(0x1d - 3))
26959535291011309493156476344723991336010898738574164086137773096960
>>> format(26959535291011309493156476344723991336010898738574164086137773096960, '064X')
'00000000FFFF0000000000000000000000000000000000000000000000000000'`} />

            <p>
                Another representation of target, easier for humans to understand, is <em>difficulty</em>{' '}
                which represents the ratio between the highest target and the current target:
            </p>

            <Emphbox>
                <pre>{`Difficulty = highest_target / current_target`}</pre>
            </Emphbox>

            <h3>nonce</h3>

            <p>
                The nonce is just a number used to differentiate the hash while trying to reach the target.
                Given that it is only 4 bytes it can only handle ~4.2 billion combinations. Miners started
                to use the unused space of coinbase's transaction input as an extra nonce allowing an immense
                amount of extra nonces to be used.
            </p>

            <h3>Difficulty Adjustment</h3>

            <Figure
                src="./images/hashrate-difficulty.png"
                caption="Hashrate and difficulty adjustment."
                label="fig-hashrate-difficulty"
                scale={0.5}
            />

            <p>
                Specifically, Bitcoin nodes check every 2016 blocks (~2 weeks) the timestamps between
                consecutive blocks and sums them to find out how much time <em>t</em> it took.
            </p>

            <Emphbox>
                <pre>{`new_difficulty = old_difficulty * (2_weeks / t)`}</pre>
            </Emphbox>

            <h3>Mining Process in a nutshell</h3>

            <ol>
                <li>Gather valid TXs into blocks</li>
                <li>Get the longest chain's top block hash and add it in hashPrevBlock</li>
                <li>Add timestamp, nonce and extra nonce in the first TX (coinbase)</li>
                <li>Calculate the merkle root of valid TXs and add it to hashMerkleRoot</li>
                <li>Hash the header to find a solution smaller than the specified target
                    <ul>
                        <li>modify timestamp, nonce or extra nonce as appropriate</li>
                        <li>rehash until a solution is found or the longest chain changed</li>
                    </ul>
                </li>
            </ol>

            <h2 id="story-of-a-block">The Story of a Block</h2>

            <p>
                Once a node finds a solution to the PoW problem it will propagate it to its peers. They will
                check if the block (and every transaction) is valid and if it is they will propagate it to
                all their peers.
            </p>

            <Figure
                src="./images/block-propagation.png"
                caption="Example of block propagation through the network."
                label="fig-block-propagation"
            />

            <p>
                The new block is being added on top of the existing blocks (every ~10 minutes). Blocks are
                linked with cryptographic hashes forming a chain of blocks, called <em>Blockchain</em>.
            </p>

            <Figure
                src="./images/node-perspective-2.png"
                caption="A node receives blocks and links them to form the blockchain."
                label="fig-node-perspective-2"
            />

            <h2 id="nakamoto-consensus">Nakamoto Consensus and Trust</h2>

            <p>
                Each node receives blocks and builds its own blockchain in isolation. A fundamental
                innovation that bitcoin introduced is the Nakamoto consensus, i.e. how do different nodes
                come to agreement on what is the current state of the blockchain.
            </p>

            <p>
                If two miners find a block (almost) at the same time then network peers will get a different
                block first. In Nakamoto consensus the basic rule is that miners should <em>follow the
                    longer chain</em> (the one with the most computation).
            </p>

            <Figure
                src="./images/nakamoto-consensus.png"
                caption="Nakamoto Consensus example."
                label="fig-nakamoto-consensus"
                scale={0.8}
            />

            <ol style={{ listStyleType: 'lower-roman' }}>
                <li>Initially our example network has only two blocks and all nodes are in sync.</li>
                <li>Then node <strong>I</strong> finds the next block, which is disseminated to all other nodes and again everyone is in sync.</li>
                <li>Next, let's suppose that two nodes find a solution at about the same time. These blocks will typically be very similar but will be different.</li>
                <li>The nodes will propagate their blocks and some peers will get one of the blocks and some the other. At this stage we do not have consensus.</li>
                <li>However, after a while a new block will be found. In our example, this is node <strong>F</strong>.</li>
                <li>When the block is propagated to the nodes with the green block on top they will realise that there is a longer chain. The green block is typically called an <em>orphan</em> block. And now all nodes are in sync again.</li>
            </ol>

            <h3>Establishing Trust</h3>

            <Figure
                src="./images/blockchain-trust.png"
                caption="Linked blocks and Trust."
                label="fig-blockchain-trust"
            />

            <p>
                If an attacker wishes to attempt a double spend attack they will need to create a new block
                with the modified transaction. However, the attacker also needs to create all subsequent
                blocks to succeed. To achieve that, the attacker will need to have the majority of the
                network's hash rate, which is what is typically called the <strong>51% attack</strong>.
            </p>

            <Note>
                <p>
                    Even though Bitcoin and Nakamoto Consensus provide us with some of the strongest
                    probabilistic guarantees it is theoretically possible to be influenced by malevolent
                    actors.
                </p>
            </Note>

            <h2 id="basic-interaction">Basic interaction with a node</h2>

            <p>
                After installing the Bitcoin software we can notice that it includes several executables:
            </p>

            <dl>
                <dt><code>bitcoind</code></dt>
                <dd>The daemon server that implements the Bitcoin protocol and networking functionality. Provides a JSON-RPC API (ports: mainnet: 8332, testnet: 18332, regtest: 18443, sigtest: 38332).</dd>

                <dt><code>bitcoin-cli</code></dt>
                <dd>Provides a command-line interface to <em>talk</em> to the daemon server.</dd>

                <dt><code>bitcoin-qt</code></dt>
                <dd>Provides a graphical user interface to the Bitcoin peer and wallet.</dd>

                <dt><code>bitcoin-tx</code></dt>
                <dd>Allows to create, parse or modify transactions.</dd>

                <dt><code>bitcoin-wallet</code></dt>
                <dd>Allows to create, parse or modify wallets.</dd>
            </dl>

            <h3>Bitcoin software configuration and development environments</h3>

            <p>
                Some important configuration options for development:
            </p>

            <dl>
                <dt><code>daemon=1</code></dt>
                <dd>Runs the Bitcoin node in the background.</dd>
                <dt><code>server=1</code></dt>
                <dd>Allows JSON-RPC commands but only from localhost.</dd>
                <dt><code>testnet=1</code></dt>
                <dd>The Bitcoin node uses the testnet network for development (i.e. fake funds).</dd>
                <dt><code>regtest=1</code></dt>
                <dd>A local test environment. The blockchain starts at height 0 and we can trivially mine new blocks.</dd>
                <dt><code>signet=1</code></dt>
                <dd>New test network that adds an additional signature requirement for block validation. Available from Bitcoin Core v0.21.0.</dd>
            </dl>

            <p>A typical minimalistic config for development is:</p>

            <CodeBlock language="bash" code={`daemon=1
testnet=1
#regtest=1

server=1
rpcuser=kostas
rpcpassword=toodifficulttoguess

[main]
mempoolsize=300

[test]
mempoolsize=100

[regtest]
mempoolsize=20`} />

            <h3>Examples of Calls using <code>bitcoin-cli</code></h3>

            <p>To get help of all available commands:</p>
            <CodeBlock language="bash" code={`$ bitcoin-cli help`} />

            <p>After version 0.22 a bitcoin wallet is not created by default. We can create a default wallet with:</p>
            <CodeBlock language="bash" code={`$ bitcoin-cli -named createwallet wallet_name="testwallet" load_on_startup=true`} />

            <p>To get the current block height:</p>
            <CodeBlock language="bash" code={`$ bitcoin-cli getblockcount
1806981`} />

            <p>To get the current balance of all addresses:</p>
            <CodeBlock language="bash" code={`$ bitcoin-cli getbalance
1.51815479`} />

            <p>To get a new legacy address:</p>
            <CodeBlock language="bash" code={`$ bitcoin-cli getnewaddress "" legacy
mvBGdiYC8jLumpJ142ghePYuY8kecQgeqS`} />

            <p>
                By default Bitcoin v0.20+ use <code>bech32</code> (or native segwit) addresses.
            </p>

            <p>To send 0.01 BTC to an address:</p>
            <CodeBlock language="bash" code={`$ bitcoin-cli sendtoaddress mvBGdiYC8jLumpJ142ghePYuY8kecQgeqS 0.01
ff8322626c21c5bdfa1d27f75a55a1cb1d3b764bb34063f64b38f0803c370c08`} />

            <p>To display all UTXOs with at least 2 confirmations:</p>
            <CodeBlock language="bash" code={`$ bitcoin-cli listunspent 2
[
  {
    "txid": "30d98980c56a139438f0c969ca30d4be2c7f865d098b905362263c5daca2afa7",
    "vout": 0,
    "address": "mgs9DLttzvWFkZ46YLSNKSZbgSNiMNUsdJ",
    "amount": 1.01452015,
    "confirmations": 20183,
    ...
  }
  ...
]`} />

            <h2 id="what-to-read-next">What to read next?</h2>

            <p>
                We should now have a basic understanding of how Bitcoin works and how to interact with a
                node. Make sure you are comfortable with the command-line, use <code>help</code> to see what
                commands are available and experiment!
            </p>

            <p>
                After that you have some options on how to proceed. If you want some more background
                knowledge of how the Bitcoin network operates, continue with chapters 2 and 3. If you want
                to go straight to how to create transactions and write Bitcoin scripts programmatically go
                directly to chapters 5 and 6.
            </p>

            <h2 id="exercises">Exercises</h2>

            <Exercise number={1}>
                <p>Prepare a bitcoin environment by installing a Bitcoin node configured for testnet.</p>
            </Exercise>
            <Exercise number={2}>
                <p>Using <code>bitcoin-cli</code> create a new legacy address.</p>
            </Exercise>
            <Exercise number={3}>
                <p>Use a Bitcoin testnet faucet to get some testnet bitcoins (tBTC) to one of your addresses.</p>
            </Exercise>
            <Exercise number={4}>
                <p>Ask your classmates or friends for their testnet address and send them some tBTC using <code>bitcoin-cli</code>.</p>
            </Exercise>
            <Exercise number={5}>
                <p>Use a block explorer to see the status of the transaction that you created in the previous exercise.</p>
            </Exercise>
            <Exercise number={6}>
                <p>Encrypt your wallet and back it up.</p>
            </Exercise>
            <Exercise number={7}>
                <p>Go through the rest of the API and get familiar with more commands.</p>
            </Exercise>
            <Exercise number={8}>
                <p>Search for historical data on Bitcoin's difficulty adjustments and make sure you understand what you see.</p>
            </Exercise>

            <ChapterNav
                prev={{ path: '/', title: 'Preface' }}
                next={{ path: '/p2p-networking', title: 'P2P Networking' }}
            />
        </>
    )
}
