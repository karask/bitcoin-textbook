import CodeBlock from '../components/CodeBlock'
import { Note, Summary, Exercise, Emphbox } from '../components/Callouts'
import Figure from '../components/Figure'
import StackVisualizer from '../components/StackVisualizer'
import ChapterNav from '../components/ChapterNav'

export default function Scripting1() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 6</div>
                <h1>Scripting 1</h1>
            </div>

            <Summary>
                <p>
                    This chapter goes deeper into what constitutes a transaction and how scripting is used to
                    lock bitcoins and later unlock them to spend them. Several examples are provided on how to
                    create transactions by calling a node's API or programmatically.
                </p>
            </Summary>

            <h2 id="transactions">Transactions</h2>

            <p>
                A transaction sends bitcoins from one address to another and it consists of 1+ inputs and 1+
                outputs. The inputs of a transaction consist of outputs of previous transactions. When an
                output is spent it can never be used again. Outputs that are available to be spent are called{' '}
                <em>Unspent Transaction Outputs (UTXOs)</em>.
            </p>

            <Note>
                <p>
                    Each time funds are sent to an address a new output (UTXO) is created. Thus, the balance of
                    an address depends on all the UTXOs that correspond to it. When we create transactions
                    programmatically we will deal primarily with UTXOs.
                </p>
            </Note>

            <p>
                When an output is created we specify the conditions under which it can be spent. A scripting
                language is used to define them. The locking script is called <code>scriptPubKey</code> and
                the unlocking script is called <code>scriptSig</code>.
            </p>

            <p>The standard transaction output types are:</p>

            <ul>
                <li><strong>P2PK</strong> — Pay to Public Key (not used anymore)</li>
                <li><strong>P2MS</strong> — Legacy multisignature</li>
                <li><strong>P2PKH</strong> — Pay to Public Key Hash</li>
                <li><strong>P2SH</strong> — Pay to Script Hash</li>
                <li><strong>P2WPKH</strong> — Pay to Witness Public Key Hash</li>
                <li><strong>P2WSH</strong> — Pay to Witness Script Hash</li>
                <li><strong>P2TR</strong> — Pay to Taproot</li>
                <li><strong>OP_RETURN</strong> — Allows storing up to 80 bytes in an output</li>
            </ul>

            <p>
                The scripting language, simply called <em>Script</em>, is a simple stack-based language that
                uses reverse polish notation (e.g. <code>2 3 +</code>) and does not contain potentially
                dangerous programming constructs like loops.
            </p>

            <h3>P2PKH</h3>

            <p>The locking script (<code>scriptPubKey</code>) for P2PKH:</p>

            <Emphbox>
                <pre>{`OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG`}</pre>
            </Emphbox>

            <p>The unlocking script (<code>scriptSig</code>) for P2PKH:</p>

            <Emphbox>
                <pre>{`<Signature> <PublicKey>`}</pre>
            </Emphbox>

            <h3>Validation of P2PKH Spending</h3>

            <p>
                Use the interactive visualizer below to step through the P2PKH validation process. Click
                Next to advance through each step and see how the stack changes:
            </p>

            <StackVisualizer />

            <p>
                Since the script finished and the only element in the stack is now <code>OP_TRUE</code> the
                node validated ownership of the UTXO and it is allowed to be spent. Success!
            </p>

            <Figure
                src="./images/utxos-pkhashes-addresses.png"
                caption="UTXOs, PKHashes and Addresses relationships."
                label="fig-utxos-pkhashes-addresses"
            />

            <h2 id="creating-p2pkh-transactions">Creating P2PKH Transactions</h2>

            <h3>Automatically Create a Transaction</h3>

            <CodeBlock language="bash" code={`$ ./bitcoin-cli sendtoaddress mnB6gSoVfUAPu6MhKkAfgsjPfBWmEEmFr3 0.1
18f23a2c3bea97d30e0e09376222b6888943e7dc86df43ff5dfa1ff59c10d8ec`} />

            <Note>
                <p>
                    Notice that the result is the transaction identifier (txid) of this transaction.
                </p>
            </Note>

            <h3>Creating a Transaction using a Node</h3>

            <p>We need to know the txids and the output indexes (vout):</p>

            <CodeBlock language="bash" code={`$ ./bitcoin-cli listunspent 0
[
  {
    "txid": "b3b7464d3472a9e83da4d5c179620b71724a62eac8bc14ac4543190227183940",
    "vout": 0,
    "address": "n1jnMQCyt9DHR3BYKzdbmXWM8M5UvH9nMW",
    "scriptPubKey": "76a914ddcf9faf5625d6a96790710bbcef98af9a8719e388ac",
    "amount": 1.30000000,
    "confirmations": 0,
    "spendable": true,
    "solvable": true
  }
  ...
]`} />

            <p>Create a transaction specifying the UTXO:</p>

            <CodeBlock language="bash" code={`$ ./bitcoin-cli createrawtransaction '''
> [
>  {
>   "txid": "b3b7464d...183940",
>   "vout": 0
>  }
> ]
> ''' '''
> {
>  "mqazutWCSnuYqEpLBznke2ooGimyCtwCh8": 0.2
> }'''
0100000001403918...efbe09488ac00000000`} />

            <p>Sign the raw transaction:</p>

            <CodeBlock language="bash" code={`$ ./bitcoin-cli signrawtransactionwithwallet 01000000014039...be09488ac00000000
{
  "hex": "0100000001403918270...38aefbe09488ac00000000",
  "complete": true
}`} />

            <p>Then send it:</p>

            <CodeBlock language="bash" code={`$ ./bitcoin-cli sendrawtransaction 0100000001403918270...38aefbe09488ac00000000
error code: -26, error message:, 256: absurdly-high-fee`} />

            <p>
                We get an error saying the fee is too high. We have not specified any change output so 1.1
                bitcoins would go to miners (1.3 - 0.2)!
            </p>

            <h3>Using HTTP JSON-RPC</h3>

            <CodeBlock language="bash" code={`$ curl --user kostas --data-binary '{"jsonrpc": "1.0", "id":"curltest",
"method": "getblockcount", "params": [] }' -H 'content-type: text/plain;'
 http://127.0.0.1:18332/
Enter host password for user 'kostas':

{
  "result": 1746817,
  "error": null,
  "id": "curltest"
}`} />

            <h3>Calling Node Commands Programmatically</h3>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.proxy import NodeProxy

# always remember to setup the network
setup('testnet')

# get a node proxy using default host and port
proxy = NodeProxy('rpcuser', 'rpcpw').get_proxy()

# call the node's getblockcount JSON-RPC method
count = proxy.getblockcount()

print(count)`} />

            <h3>Creating Transactions Programmatically</h3>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.utils import to_satoshis
from bitcoinutils.transactions import Transaction, TxInput, TxOutput
from bitcoinutils.keys import P2pkhAddress, PrivateKey
from bitcoinutils.script import Script

def main():
    # always remember to setup the network
    setup('testnet')

    # create transaction input from tx id of UTXO (contained 0.4 tBTC)
    txin = TxInput('fb48f4e23bf6ddf606714141ac78c3e921c8c0bebeb7c8abb2c799e9ff96ce6c', 0)

    # create transaction output using P2PKH scriptPubKey (locking script)
    addr = P2pkhAddress('n4bkvTyU1dVdzsrhWBqBw8fEMbHjJvtmJR')
    txout = TxOutput(to_satoshis(0.1), Script(['OP_DUP', 'OP_HASH160',
                                  addr.to_hash160(),
                                  'OP_EQUALVERIFY', 'OP_CHECKSIG']) )

    # create another output to get the change - remaining 0.01 is tx fees
    change_addr = P2pkhAddress('mmYNBho9BWQB2dSniP1NJvnPoj5EVWw89w')
    change_txout = TxOutput(to_satoshis(0.29), change_addr.to_script_pub_key())

    # create transaction from inputs/outputs -- default locktime is used
    tx = Transaction([txin], [txout, change_txout])

    # print raw transaction
    print("\\nRaw unsigned transaction:\\n" + tx.serialize())

    # use the private key corresponding to the address that contains the
    # UTXO we are trying to spend to sign the input
    sk = PrivateKey('cRvyLwCPLU88jsyj94L7iJjQX5C2f8koG4G2gevN4BeSGcEvfKe9')

    # note that we pass the scriptPubkey as one of the inputs of sign_input
    from_addr = P2pkhAddress('myPAE9HwPeKHh8FjKwBNBaHnemApo3dw6e')
    sig = sk.sign_input( tx, 0, Script(['OP_DUP', 'OP_HASH160',
                                       from_addr.to_hash160(), 'OP_EQUALVERIFY',
                                       'OP_CHECKSIG']) )

    # get public key as hex
    pk = sk.get_public_key().to_hex()

    # set the scriptSig (unlocking script)
    txin.script_sig = Script([sig, pk])
    signed_tx = tx.serialize()

    # print raw signed transaction ready to be broadcasted
    print("\\nRaw signed transaction:\\n" + signed_tx)

if __name__ == "__main__":
    main()`} />

            <h2 id="signatures">Signatures</h2>

            <p>
                When we create a new transaction we need to provide a signature for each UTXO that we want
                to spend. The digital signature algorithm used is ECDSA. There are different SIGHASH flags
                that specify which parts of the transaction are signed:
            </p>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr><th>SIGHASH Flag</th><th>Value</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><code>ALL</code></td><td>0x01</td><td>Signs all inputs and outputs. Transaction is final.</td></tr>
                        <tr><td><code>NONE</code></td><td>0x02</td><td>Signs all inputs but none of the outputs. Anyone can change outputs.</td></tr>
                        <tr><td><code>SINGLE</code></td><td>0x03</td><td>Signs all inputs and only the corresponding output.</td></tr>
                        <tr><td><code>ALL|ANYONECANPAY</code></td><td>0x81</td><td>Signs only this input and all outputs. Crowdfunding-style.</td></tr>
                        <tr><td><code>NONE|ANYONECANPAY</code></td><td>0x82</td><td>Signs only this one input. Anyone can spend it.</td></tr>
                        <tr><td><code>SINGLE|ANYONECANPAY</code></td><td>0x83</td><td>Signs this input and its corresponding output.</td></tr>
                    </tbody>
                </table>
            </div>

            <Figure
                src="./images/example-transaction.png"
                caption="Example transaction with two inputs and two outputs."
                label="fig-example-transaction"
            />

            <h2 id="p2sh">Pay to Script Hash (P2SH)</h2>

            <p>
                P2SH moves the responsibility for supplying the locking conditions from the sender to the
                redeemer. The locking script is simple:
            </p>

            <Emphbox>
                <pre>{`OP_HASH160 [20-byte-hash-value] OP_EQUAL`}</pre>
            </Emphbox>

            <p>The 20-byte hash value is the hash of the redeem script. For a 2-of-3 multisig:</p>

            <Emphbox>
                <pre>{`RIPEMD-160( SHA-256( 2 <Director's PubKey> <CFO's PubKey>
<COO's PubKey> 3 CHECKMULTISIG ) )`}</pre>
            </Emphbox>

            <p>Advantages of P2SH:</p>
            <ul>
                <li>Allows arbitrary redeem scripts</li>
                <li>Reduces the size of funding transactions</li>
                <li>Increases privacy by hiding locking conditions</li>
            </ul>

            <h3>Example: create a P2SH address based on a P2PK script</h3>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.keys import P2shAddress, PrivateKey
from bitcoinutils.script import Script

def main():
    setup('testnet')

    # secret key corresponding to the pubkey needed for the P2PK locking
    p2pk_sk = PrivateKey('cRvyLwCPLU88jsyj94L7iJjQX5C2f8koG4G2gevN4BeSGcEvfKe9')
    p2pk_pk = p2pk_sk.get_public_key()

    # create the redeem script
    redeem_script = Script([p2pk_pk.to_hex(), 'OP_CHECKSIG'])

    # create a P2SH address from a redeem script
    addr = P2shAddress.from_script(redeem_script)
    print(addr.to_string())

if __name__ == "__main__":
    main()`} />

            <p>The result is address <code>2MvzN3FntupGqY66FuGzoK9HFXqPFyMxfVU</code>.</p>

            <h3>Example: spend funds from a P2SH address</h3>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.utils import to_satoshis
from bitcoinutils.transactions import Transaction, TxInput, TxOutput
from bitcoinutils.keys import P2pkhAddress, P2shAddress, PrivateKey
from bitcoinutils.script import Script

def main():
    setup('testnet')

    # create transaction input from tx id of UTXO (contained 0.1 tBTC)
    txin = TxInput('7db363d5a7fabb64ccce154e906588f1936f34481223ea8c1f2c935b0a0c945b', 0)

    # secret key needed to spend P2PK that is wrapped by P2SH
    p2pk_sk = PrivateKey('cRvyLwCPLU88jsyj94L7iJjQX5C2f8koG4G2gevN4BeSGcEvfKe9')
    p2pk_pk = p2pk_sk.get_public_key().to_hex()
    redeem_script = Script([p2pk_pk, 'OP_CHECKSIG'])

    to_addr = P2pkhAddress('n4bkvTyU1dVdzsrhWBqBw8fEMbHjJvtmJR')
    txout = TxOutput(to_satoshis(0.09), to_addr.to_script_pub_key())

    tx = Transaction([txin], [txout])

    # sign the input with the redeem script
    sig = p2pk_sk.sign_input(tx, 0, redeem_script)

    # set the scriptSig (unlocking script)
    txin.script_sig = Script([sig, redeem_script.to_hex()])
    signed_tx = tx.serialize()

    print("\\nRaw signed transaction:\\n" + signed_tx)
    print("\\nTxId:", tx.get_txid())

if __name__ == "__main__":
    main()`} />

            <Note>
                <p>
                    The first time we spend from the address, i.e. broadcasting this transaction, reveals the
                    redeem script to everyone.
                </p>
            </Note>

            <h2 id="segwit">Segregated Witness (SegWit)</h2>

            <p>
                Segregated Witness is a consensus change that separates (segregates) the unlocking script
                (witness) from the rest of the input. Benefits include fixing <em>transaction
                    malleability</em> and an <em>effective block size increase</em>.
            </p>

            <Figure
                src="./images/tx-with-without-segwit.png"
                caption="Example transaction with (i) a non-segwit input and (ii) a segwit input."
                label="fig-tx-with-without-segwit"
            />

            <h3>Transaction malleability</h3>
            <p>
                With segwit inputs the unlocking script is not part of the <code>txid</code> construction
                and thus it is impossible to modify it. A non-malleable txid is more reliable and allows for
                more advanced solutions like the Lightning Network.
            </p>

            <h3>Effective block size increase</h3>
            <p>
                The non-witness part bytes are multiplied by 4, the witness part bytes by 1. This allows for
                an effective block size increase of about 2.8x.
            </p>

            <h3>P2WPKH</h3>

            <Emphbox>
                <pre>{`scriptPubKey: 0 6b85f9a17492c691c1d861cc1c722ff683b27f5a
scriptSig:
witness: <signature> <pubkey>`}</pre>
            </Emphbox>

            <h3>P2WSH</h3>

            <Emphbox>
                <pre>{`scriptPubKey: 0 3b892c61cc15f9a17<32 bytes>c1c722ff683b27f5a
scriptSig:
witness: 0 <signature1> <1 <pubkey1> <pubkey2> 2 CHECKMULTISIG>`}</pre>
            </Emphbox>

            <h3>Nested Segwit (P2SH-P2WPKH)</h3>

            <p>
                Embedding P2WPKH or P2WSH into a P2SH allows non-segwit aware wallets to pay to segwit
                addresses.
            </p>

            <ChapterNav
                prev={{ path: '/keys-and-addresses', title: 'Keys and Addresses' }}
                next={{ path: '/scripting-2', title: 'Scripting 2' }}
            />
        </>
    )
}
