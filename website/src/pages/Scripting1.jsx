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
                output is spent it can never be used again (think of cash — if you give a 20 euro note you
                can never reuse it; you might be given change but it will be different notes or coins). All
                the bitcoins are transferred elsewhere (to a recipient, back to yourself as change, etc.).
                Outputs that are available to be spent are called{' '}
                <em>Unspent Transaction Outputs (UTXOs)</em> and Bitcoin nodes keep track of the complete
                UTXO set.
            </p>

            <Note>
                <p>
                    Each time funds are sent to an address a new output (UTXO) is created. Thus, the balance of
                    an address depends on all the UTXOs that correspond to it. Bitcoin wallets hide UTXOs to
                    make the whole experience friendlier but some wallets allow you to specify which UTXOs you
                    want to spend if needed. When we create transactions programmatically we will deal primarily
                    with UTXOs.
                </p>
            </Note>

            <p>
                When an output (UTXO) is created we also specify the conditions under which this output can
                be spent. When you specify an input (the UTXO of a previous transaction) to spend from you
                have to prove that you satisfy the conditions set by the UTXO.
            </p>

            <p>
                The spending conditions and the proof that authorizes transfer are not fixed. A scripting
                language is used to define them. When a new output is created a script is placed in the UTXO
                called <code>scriptPubKey</code> or more informally locking script. When we want to spend
                that UTXO we create a new transaction with an input that references the UTXO that we wish to
                spend together with an unlocking script or more formally a <code>scriptSig</code>.
            </p>

            <p>The standard transaction output types supported by the Bitcoin protocol are:</p>

            <ul>
                <li><strong>P2PK</strong> — Pay to Public Key (not used anymore)</li>
                <li><strong>P2MS</strong> — Legacy multisignature transactions; now P2SH/P2WSH/P2TR are used instead</li>
                <li><strong>P2PKH</strong> — Pay to Public Key Hash</li>
                <li><strong>P2SH</strong> — Pay to Script Hash</li>
                <li><strong>P2WPKH</strong> — Pay to Witness Public Key Hash</li>
                <li><strong>P2WSH</strong> — Pay to Witness Script Hash</li>
                <li><strong>P2TR</strong> — Pay to Taproot</li>
                <li><strong>OP_RETURN</strong> — Allows storing up to 80 bytes in an output</li>
                <li><strong>Non-standard</strong> — Any other valid transaction (valid non-standard transactions are rejected and not relayed by nodes but can be mined if arranged with a miner)</li>
            </ul>

            <p>
                The most common transaction output type offering a standard way of transferring bitcoins
                around is P2PKH (and P2WPKH), which is effectively "pay to a Bitcoin address". It is also
                possible, and used in the past, to pay directly to a public key with P2PK but that is not
                used anymore. Another very important transaction output type is P2SH (and P2WSH) which allows
                locking scripts of arbitrary complexity to be used.
            </p>

            <p>
                To define a locking and unlocking script we make use of a scripting language, simply
                called <em><a href="https://en.bitcoin.it/wiki/Script" target="_blank" rel="noopener noreferrer">Script</a></em>.
                This relatively simple language consists of several operations each of them identified by
                an <em>opcode</em> in hexadecimal. It is a simple stack-based language that uses reverse
                polish notation (e.g. <code>2 3 +</code>) and does not contain potentially dangerous
                programming constructs, like loops; it is a domain-specific language.
            </p>

            <h3>P2PKH</h3>

            <p>
                Let's examine the standard transaction of spending a Pay to Public Key Hash. The locking
                script (<code>scriptPubKey</code>) that secures the funds in a P2PKH address is the following:
            </p>

            <Emphbox>
                <pre>{`OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG`}</pre>
            </Emphbox>

            <p>
                As we have seen in the Keys and Addresses chapter, the public key hash (PKHash) can be
                derived from the Bitcoin address and vice versa. Thus, the above script locks the funds that
                have been sent in the address that corresponds to that PKHash.
            </p>

            <p>
                To spend the funds the owner of the private key that corresponds to that address/PKHash needs
                to provide an unlocking script that if we prepend to the locking script the whole script will
                evaluate to true. An unlocking script for a P2PKH will look like this:
            </p>

            <Emphbox>
                <pre>{`<Signature> <PublicKey>`}</pre>
            </Emphbox>

            <p>
                Using the private key we provide an ECDSA signature of part of the transaction that we create
                (see the Signatures section for more details). We also provide the public key for additional
                verification. The public key only appears in the blockchain after we spend from an address.
            </p>

            <p>
                The validation to spend a UTXO consists of running the script
                of <code>scriptSig</code> plus <code>scriptPubKey</code>. Both scripts are added in the
                stack and executed as one script.
            </p>

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

            <p>
                This section explained how funds residing in UTXOs are locked/unlocked and how scripts are
                evaluated for validation. In the next section we will go through several examples of how we
                can create simple transactions programmatically.
            </p>


            <h2 id="creating-p2pkh-transactions">Creating P2PKH Transactions</h2>

            <h3>Automatically Create a Transaction</h3>

            <p>
                We can use Bitcoin's built-in command <code>sendtoaddress</code> to send bitcoins to an
                address.
            </p>

            <CodeBlock language="bash" code={`$ ./bitcoin-cli sendtoaddress mnB6gSoVfUAPu6MhKkAfgsjPfBWmEEmFr3 0.1
18f23a2c3bea97d30e0e09376222b6888943e7dc86df43ff5dfa1ff59c10d8ec`} />

            <p>
                In this example we use the node to send <code>0.1</code> bitcoins to a testnet address.
                Notice that we do not specify any details on which UTXOs to spend from. The node wallet will
                decide which UTXOs it will spend and in which address the change (there is almost always
                change) will go; i.e. we do not have any control when sending funds this way.
            </p>

            <Note>
                <p>
                    Notice that the result is the transaction identifier (txid) of this transaction.
                </p>
            </Note>

            <h3>Creating a Transaction using a Node</h3>

            <p>
                In this example we want to select the inputs explicitly. We need to know the txids and the
                output indexes (vout). As an example, we can get those with:
            </p>

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
                In this instance we get an error saying that the transaction has an exceptionally high fee.
                We have not specified any output for change so <code>1.1</code> bitcoins would be given to
                miners (<code>1.3-0.2</code>). Most wallets have similar protection mechanisms to help
                safeguard from user errors.
            </p>

            <h3>Using HTTP JSON-RPC</h3>

            <p>
                JSON-RPC is a simple protocol that specifies how to communicate with remote procedure calls
                using JSON as the format. It can be used with several transport protocols but most typically
                it is used over HTTP. A user name and password has to be provided
                in <code>bitcoin.conf</code>. By default only local connections are allowed, but other
                connections can be allowed for trusted IPs with the <code>rpcallowip</code> configuration
                option.
            </p>

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

            <p>
                Library <code>python-bitcoin-utils</code> (can be installed directly with <code>pip install
                    bitcoin-utils</code>) wraps a Bitcoin RPC library and provides a proxy object that allows a
                Python program to call all the CLI commands programmatically via JSON-RPC. For example:
            </p>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.proxy import NodeProxy

# always remember to setup the network
setup('testnet')

# get a node proxy using default host and port
proxy = NodeProxy('rpcuser', 'rpcpw').get_proxy()

# call the node's getblockcount JSON-RPC method
count = proxy.getblockcount()

print(count)`} />

            <p>
                All API calls can be used, including the ones to create a transaction with
                either <code>sendtoaddress</code> or <code>createrawtransaction</code> + <code>signrawtransaction</code> + <code>sendrawtransaction</code>.
            </p>

            <h3>Creating Transactions Programmatically</h3>

            <p>
                The Bitcoin node allows the creation of basic transactions but it does not support arbitrary
                scripts. We can create those programmatically by explicitly specifying the locking/unlocking
                conditions. We will use the <code>python-bitcoin-utils</code> library to demonstrate.
            </p>

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
                to spend. For a P2PKH UTXO the signature proves: that the signer is the owner of the private
                key, that the proof of authorization is undeniable, and that the parts of the transaction
                that were signed cannot be modified after it has been signed.
            </p>

            <p>
                The digital signature algorithm used is ECDSA and each signature is serialized using DER.
                There are different ways to sign inputs of a transaction so as to provide different
                commitments. To specify these commitments, i.e. which parts of the transaction will be
                signed, we add a special 1 byte flag called SIGHASH at the end of the DER signature.
            </p>

            <p>
                Each transaction input needs to be signed separately from others. Parts of the new transaction
                will be hashed to create a digest and the digest is what is signed and included in the
                unlocking script. To determine which parts are hashed the following rules are followed:
            </p>

            <ul>
                <li>All other inputs' unlocking scripts (scriptSigs) should be empty</li>
                <li>The input's unlocking script (scriptSig), the one that we sign, should be set to the locking script (scriptPubKey) of the UTXO that we are trying to spend</li>
                <li>Follow additional rules according to the SIGHASH flag</li>
            </ul>

            <p>The possible SIGHASH flags, values and meaning are:</p>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr><th>SIGHASH Flag</th><th>Value</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><code>ALL</code></td><td>0x01</td><td>Signs all the inputs and outputs, protecting everything except the signature scripts against modification. This transaction is final.</td></tr>
                        <tr><td><code>NONE</code></td><td>0x02</td><td>Signs all of the inputs but none of the outputs, allowing anyone to change where the satoshis are going. It can be used as a blank check to a miner.</td></tr>
                        <tr><td><code>SINGLE</code></td><td>0x03</td><td>Signs all the inputs and only one output, the one corresponding to this input (same output index number as this input), ensuring nobody can change your part of the transaction but allowing other signers to change their part.</td></tr>
                        <tr><td><code>ALL|ANYONECANPAY</code></td><td>0x81</td><td>Signs only this one input and all the outputs. It allows anyone to add or remove inputs. It can be used to implement kickstarter-style crowdfunding.</td></tr>
                        <tr><td><code>NONE|ANYONECANPAY</code></td><td>0x82</td><td>Signs only this one input and allows anyone to add or remove other inputs or outputs. This input can be spent even in another transaction!</td></tr>
                        <tr><td><code>SINGLE|ANYONECANPAY</code></td><td>0x83</td><td>Signs this one input and its corresponding output. Allows anyone to add or remove other inputs. A potential use would be as a means to exchange colored coin tokens with satoshis.</td></tr>
                    </tbody>
                </table>
            </div>

            <Figure
                src="./images/example-transaction.png"
                caption="Example transaction with two inputs and two outputs."
                label="fig-example-transaction"
            />

            <p>
                For an example of <code>SINGLE</code>, consider the transaction shown above. Alice needs to
                pay 1.5 bitcoins to Zed and they agreed with Bob that he will contribute 0.5 of that amount.
                Then Alice creates a transaction with two inputs, UTXO1 that she owns (with 1 BTC) and UTXO2
                that Bob owns (with 1 BTC) and a single output that sends 1.5 bitcoins to Zed. She signed
                UTXO1 with SIGHASH <code>SINGLE</code> and sends the incomplete transaction to Bob. Bob cannot
                choose a UTXO other than UTXO2 since it will invalidate Alice's signature of UTXO1. However,
                he is free to add other outputs so he creates an output that sends the remaining bitcoins to
                one of his addresses. He can then sign UTXO2 with SIGHASH <code>ALL</code> which will
                effectively finalize the transaction.
            </p>

            <ul>
                <li>The sequence numbers of other inputs are not included in the signature, and can be updated.</li>
                <li>With multiple inputs, each signature hash type can sign different parts of the transaction. If a 2-input transaction has one input signed with <code>NONE</code> and the other with <code>ALL</code>, the <code>ALL</code> signer can choose where to spend the funds without consulting the <code>NONE</code> signer.</li>
            </ul>

            <h2 id="p2sh">Pay to Script Hash (P2SH)</h2>

            <h3>Multi-signature transaction output type</h3>

            <p>
                To demonstrate the advantages of P2SH we will first go through a simple use case.
                Consider the scenario where we accept funds in an address that is not controlled by one
                person. For example it is typical for companies to allow spending from corporate accounts
                only if, say, 2 people agree. These are called multi-signature accounts. A 2-of-3
                multi-signature locking script would look like:
            </p>

            <Emphbox>
                <pre>{`2 <Director's Public Key> <CFO's Public Key> <COO's Public Key>
3 CHECKMULTISIG`}</pre>
            </Emphbox>

            <p>
                If someone needs to send money to that output script then they need to know it! The company
                would need to send this script to all their customers. This is not practical since the whole
                script is recorded on the blockchain for every transaction and more importantly has privacy
                issues; the company is revealing the public keys that control the funds.
            </p>

            <h3>Pay to script hash (P2SH)</h3>

            <p>
                P2SH is a type of transaction output (BIP-16) that moves the responsibility for supplying the
                conditions to redeem a transaction from the sender of the funds to the redeemer (receiver).
                The locking script is simple:
            </p>

            <Emphbox>
                <pre>{`OP_HASH160 [20-byte-hash-value] OP_EQUAL`}</pre>
            </Emphbox>

            <p>The 20-byte hash value is the hash of the redeem script:</p>

            <Emphbox>
                <pre>{`RIPEMD-160( SHA-256( 2 <Director's Public Key> <CFO's Public Key>
<COO's Public Key> 3 CHECKMULTISIG ) )`}</pre>
            </Emphbox>

            <p>
                Using this hash we create a Bitcoin address using the version prefix
                of <code>0x05</code> that creates addresses that start with <code>3</code>. We then only need
                to disseminate this address to the company's customers. They can send funds oblivious to how
                these funds are locked.
            </p>

            <p>
                As an example, to spend the funds, the company can create the following unlocking script:
            </p>

            <Emphbox>
                <pre>{`<Director's signature> <CFO's signature>
<2 <Director's Public Key> <CFO's Public Key> <COO's Public Key>
 3 CHECKMULTISIG>`}</pre>
            </Emphbox>

            <p>
                It has two parts, the redeem script's unlocking conditions (which in this case are two of the
                signatures) plus the redeem script. Notice how the redeem script is revealed only when the
                company spends the funds.
            </p>

            <h3>Summary / Advantages</h3>

            <ul>
                <li>P2SH allows us to create arbitrary redeem scripts; we can thus create quite complex scripts and not be limited to the few standard transaction output types.</li>
                <li>Reduces the size of the funding transactions typically resulting in saving blockchain space.</li>
                <li>Increases privacy by hiding the locking conditions.</li>
            </ul>

            <h3>Example: create a P2SH address based on a P2PK script</h3>

            <p>
                As we have seen P2SH allows us to wrap arbitrary scripts hiding the script itself until it
                is spent. To demonstrate we will wrap a simple P2PK script and display the P2SH address that
                corresponds to that script.
            </p>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.keys import P2shAddress, PrivateKey
from bitcoinutils.script import Script

def main():
    # always remember to setup the network
    setup('testnet')

    # secret key corresponding to the pubkey needed for the P2PK locking
    p2pk_sk = PrivateKey('cRvyLwCPLU88jsyj94L7iJjQX5C2f8koG4G2gevN4BeSGcEvfKe9')

    # get the public key
    p2pk_pk = p2pk_sk.get_public_key()

    # create the redeem script
    redeem_script = Script([p2pk_pk.to_hex(), 'OP_CHECKSIG'])

    # create a P2SH address from a redeem script
    addr = P2shAddress.from_script(redeem_script)
    print(addr.to_string())

if __name__ == "__main__":
    main()`} />

            <p>
                The result is address <code>2MvzN3FntupGqY66FuGzoK9HFXqPFyMxfVU</code> which can be shared
                to anyone that wishes to send us some funds.
            </p>

            <h3>Example: spend funds from a P2SH address</h3>

            <p>
                Assuming that someone has sent funds to the P2SH address we just created let us spend it
                programmatically. We hardcode the UTXOs for brevity but we can always use the proxy object
                to get the UTXOs programmatically.
            </p>

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
                Segregated Witness is a consensus change that introduces an update on how transactions are
                constructed. In particular it separates (segregates) the unlocking script (witness) from the
                rest of the input; a transaction input does not contain an unlocking script anymore and the
                latter is found in another structure that goes alongside the transaction.
            </p>

            <Figure
                src="./images/tx-with-without-segwit.png"
                caption="Example transaction with (i) a non-segwit input and (ii) a segwit input."
                label="fig-tx-with-without-segwit"
            />

            <p>
                The segwit upgrade is described in detail in BIPs 141, 143, 144 and 145.
            </p>

            <h3>Transaction malleability</h3>
            <p>
                Each transaction is uniquely identified by its <em>transaction identifier</em> or <code>txid</code>.
                The <code>txid</code> is constructed by hashing the serialized transaction. It is possible to
                slightly change the unlocking script, e.g. by a miner, so as the resulting transaction is
                semantically identical to the original; thus still valid. That is a problem because even the
                slightest modification will change the <code>txid</code>.
            </p>
            <p>
                With segwit inputs, however, the unlocking script is not part of the <code>txid</code> construction
                and thus it is impossible to modify it. A non-malleable <code>txid</code> is more reliable and
                allows for more advanced scripts/solutions like the Lightning Network.
            </p>

            <h3>Effective block size increase</h3>
            <p>
                The actual block size remains the same, at 1MB. However, the unlocking scripts are now not
                counted as part of the block and thus more transactions can fit into the 1MB limit.
            </p>
            <p>
                Segwit introduces the concept of block <em>weight</em>, a new metric for the size of blocks.
                A block can have a maximum weight of 4MBs. The non-witness part bytes of a transaction are
                now multiplied by 4 to get its weight while the witness part bytes are multiplied by 1, a
                discount of 75%. This allows for an effective block size increase of about 2.8x, if all
                transactions use segwit.
            </p>
            <p>
                The <em>virtual</em> size, or <code>vsize</code> of a transaction is the size in bytes of a
                transaction including the segwit discount. For non-segwit transactions <code>size</code> and <code>vsize</code> are
                identical.
            </p>

            <h3>Segwit transaction output types</h3>
            <p>
                Segwit introduces two new transaction types, <em>Pay-to-Witness-Public-Key-Hash (P2WPKH)</em> and <em>Pay-to-Witness-Script-Hash (P2WSH)</em>, which are the segwit equivalent of P2PKH and P2SH respectively.
            </p>

            <h3>P2WPKH</h3>
            <p>
                In segwit version 0, a P2WPKH witness program is just the 20-byte public key hash.
                The <code>scriptSig</code> should be empty and the witness contains the unlocking script.
            </p>

            <Emphbox>
                <pre>{`scriptPubKey: 0 6b85f9a17492c691c1d861cc1c722ff683b27f5a
scriptSig:
witness: <signature> <pubkey>`}</pre>
            </Emphbox>

            <p>The validation is executed as follows:</p>
            <ol>
                <li>The '0' in scriptPubKey specifies that the following is a version 0 witness program.</li>
                <li>The length of the witness program (20-bytes) indicates that it is a P2WPKH type.</li>
                <li>The witness must consist of exactly two items.</li>
                <li>The <code>HASH160</code> of the pubkey must match the 20-bytes witness program.</li>
                <li>Finally, the signature is verified by: <code>&lt;signature&gt; &lt;pubkey&gt; CHECKSIG</code>.</li>
            </ol>

            <h3>P2WSH</h3>
            <p>
                In segwit version 0, a P2WSH witness program is just the 32-byte script hash.
                The <code>scriptSig</code> should be empty and the witness contains the script that unlocks
                the funds as well as the <em>witness script</em>.
            </p>

            <Emphbox>
                <pre>{`scriptPubKey: 0 3b892c61cc15f9a17<32 bytes>c1c722ff683b27f5a
scriptSig:
witness: 0 <signature1> <1 <pubkey1> <pubkey2> 2 CHECKMULTISIG>`}</pre>
            </Emphbox>

            <p>The validation is executed as follows:</p>
            <ol>
                <li>The '0' in scriptPubKey specifies that the following is a version 0 witness program.</li>
                <li>The length of the witness program (32-bytes) indicates that it is a P2WSH type.</li>
                <li>The witness must consist of the unlocking script followed by the witness script.</li>
                <li>The <code>SHA256</code> of the witness script must match the 32-bytes witness program.</li>
                <li>Finally, the witness script is deserialized and executed after the remaining witness stack.</li>
            </ol>

            <h3>Nested Segwit (P2SH-P2WPKH)</h3>

            <p>
                It is possible for a non-segwit aware wallet to pay to a segwit address by embedding P2WPKH
                or P2WSH into a P2SH. The recipient will provide a P2SH address to the sender who can send
                funds as usual. The recipient can then use the redeem script which is actually the witness
                script to spend the funds.
            </p>

            <h3>Implemented as a soft-fork</h3>

            <p>
                Changing the transaction format is normally a hard-fork. To go around that and implement the
                new functionality as a soft-fork:
            </p>

            <ul>
                <li>The original transaction format was not changed. The <code>scriptSig</code> would just be empty and the witnesses would go in a new structure.</li>
                <li>A witness merkle root is calculated from all transactions' witness scripts and included in an <code>OP_RETURN</code> output of the coinbase transaction.</li>
                <li>Witness data are provided only when nodes ask for them and thus old nodes will get blocks without the witness data.</li>
            </ul>

            <h3>Example: spend a native segwit output type</h3>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.utils import to_satoshis
from bitcoinutils.transactions import Transaction, TxInput, TxOutput
from bitcoinutils.keys import P2pkhAddress, PrivateKey
from bitcoinutils.script import Script

def main():
    # always remember to setup the network
    setup('testnet')

    # the key that corresponds to the P2WPKH address
    priv = PrivateKey("cVdte9ei2xsVjmZSPtyucG43YZgNkmKTqhwiUA8M4Fc3LdPJxPmZ")
    pub = priv.get_public_key()
    fromAddress = pub.get_segwit_address()

    # amount is needed to sign the segwit input
    fromAddressAmount = to_satoshis(0.01)

    # UTXO of fromAddress
    txid = '13d2d30eca974e8fa5da11b9608fa36905a22215e8df895e767fc903889367ff'
    vout = 0

    toAddress = P2pkhAddress('mrrKUpJnAjvQntPgz2Z4kkyr1gbtHmQv28')
    txin = TxInput(txid, vout)

    # script code required for signing; for p2wpkh it is the same as p2pkh
    script_code = Script(['OP_DUP', 'OP_HASH160', pub.to_hash160(),
                           'OP_EQUALVERIFY', 'OP_CHECKSIG'])

    txOut = TxOutput(to_satoshis(0.009), toAddress.to_script_pub_key())

    # create transaction - if at least a single input is segwit we need
    # to set has_segwit=True
    tx = Transaction([txin], [txOut], has_segwit=True)

    sig = priv.sign_segwit_input(tx, 0, script_code, fromAddressAmount)
    tx.witnesses.append( Script([sig, pub.to_hex()]) )

    # print raw signed transaction ready to be broadcasted
    print("\\nRaw signed transaction:\\n" + tx.serialize())
    print("\\nTxId:", tx.get_txid())

if __name__ == "__main__":
    main()`} />


            <h2 id="p2ms">Pay To Multi-signature (P2MS)</h2>

            <p>
                Pay to multi-signature or <em>Pay-to-Multisig</em> is a standard output type that was
                introduced before P2SH. Its aim was to provide a way for bitcoins to be locked by several
                public keys which could belong to different people. Typically, only a subset of signatures
                would be required.
            </p>

            <p>
                This is the typical way to use multisig after P2SH was created because P2MS has several
                drawbacks:
            </p>

            <ul>
                <li>It is limited to 3 public keys while P2SH allows up to 15.</li>
                <li>It has no address format. To send funds to a P2MS the sender needs to know the multisig script.</li>
                <li>The public keys are visible even before an output is spent.</li>
            </ul>

            <Note>
                <p>
                    The <code>CHECKMULTISIG</code> opcode has a bug where it pops an extra element from the
                    stack. For backward compatibility the bug cannot be fixed and thus to avoid the
                    issue we add an additional dummy value at the beginning of the unlocking
                    script. Typically, <code>OP_0</code> is used as a dummy but anything is valid.
                </p>
            </Note>


            <h2 id="storing-data">Storing Data (OP_RETURN)</h2>

            <p>
                The blockchain ensures that all existing entries are tamper-proof resistant; modifications and
                deletions are not allowed. This makes it quite useful for <em>permanently</em> storing data
                that will stand the test of time, which is ideal for certain applications like notary
                services, certificate ownership and others.
            </p>

            <h3>Indirectly</h3>

            <p>
                Bitcoin's blockchain was not designed for storage in general and data could only be stored
                indirectly. Examples include adding data to coinbase transactions, to transaction outputs and
                to multi-signature addresses. The satoshis sent to such fake addresses will be lost forever
                since there is no (known) private key that corresponds to it.
            </p>

            <Note>
                <p>
                    Storing data this way creates an overhead for the UTXO set in every node in the network.
                    These addresses will never be used (i.e. the satoshis there are lost) but the system is
                    not aware so they need to keep track of them as unspent outputs!
                </p>
            </Note>

            <h3>Directly</h3>

            <p>
                The compromise was the introduction of an operator, called <code>OP_RETURN</code> specifically
                dealing with storing small amounts of data on the blockchain. The <code>OP_RETURN</code> opcode
                is followed by a maximum of 80 bytes of data. No satoshis are required to be sent (other than
                the transaction fees) and more importantly, <code>OP_RETURN</code> does not bloat
                the UTXO set.
            </p>

            <p>An example script would be:</p>

            <Emphbox>
                <pre>{`OP_RETURN 4f1edef24e9e2a169f56e1b0ae936d32232652dc51be1860ecd714`}</pre>
            </Emphbox>

            <h3>Example: Create a transaction with an OP_RETURN output</h3>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.utils import to_satoshis
from bitcoinutils.transactions import Transaction, TxInput, TxOutput
from bitcoinutils.keys import P2pkhAddress, PrivateKey
from bitcoinutils.script import Script

def main():
    # always remember to setup the network
    setup('testnet')

    # create transaction input from tx id of UTXO (contained 0.01 tBTC)
    txin = TxInput('ab48f4e23bf6ddf606714141ac87c3e921c8c0bebeb7c8abb2c799e9ff96ce6f', 0)

    # create the OP_RETURN transaction output that contains "Hello!"
    txout = TxOutput(to_satoshis(0), Script(['OP_RETURN', '48656c6f21']))

    # create another output to get the change
    change_addr = P2pkhAddress('mmYNBho9BWQB2dSniP1NJvnPoj5EVWw89w')
    change_txout = TxOutput(to_satoshis(0.008), change_addr.to_script_pub_key())

    # create transaction from inputs/outputs
    tx = Transaction([txin], [txout, change_txout])

    # use the private key to sign the input
    sk = PrivateKey('cRvyLwCPLU88jsyj94L7iJjQX5C2f8koG4G2gevN4BeSGcEvfKe9')

    from_addr = P2pkhAddress('myPAE9HwPeKHh8FjKwBNBaHnemApo3dw6e')
    sig = sk.sign_input(tx, 0, from_addr.to_script_pub_key())

    pk = sk.get_public_key().to_hex()
    txin.script_sig = Script([sig, pk])
    signed_tx = tx.serialize()

    print("\\nRaw signed transaction:\\n" + signed_tx)

if __name__ == "__main__":
    main()`} />


            <h2 id="exercises">Exercises</h2>

            <Exercise number={1}>
                <p>Write a program that spends a UTXO. The user will provide a P2PKH address as a parameter and will then be prompted to choose between the available UTXOs of that address.</p>
            </Exercise>
            <Exercise number={2}>
                <p>In mainnet, how can we estimate what is an appropriate fee to include to a transaction?</p>
            </Exercise>
            <Exercise number={3}>
                <p>Write a scriptPubKey script that requires both a key and password to unlock.</p>
            </Exercise>
            <Exercise number={4}>
                <p>Create a P2SH address that corresponds to a 2-of-2 multisignature scheme. Display the address.</p>
            </Exercise>
            <Exercise number={5}>
                <p>Create a script that spends funds from the P2SH address created in the previous exercise.</p>
            </Exercise>
            <Exercise number={6}>
                <p>Write a Python function that goes through a serialized transaction and calculates what percentage of its size are the <code>scriptSig</code>s.</p>
            </Exercise>
            <Exercise number={7}>
                <p>Write a script that goes through a block and prints the percentage of all the <code>scriptSig</code>s relative to the size of the block.</p>
            </Exercise>
            <Exercise number={8}>
                <p>How can we calculate what the maximum <em>effective</em> block size limit is with segwit?</p>
            </Exercise>
            <Exercise number={9}>
                <p>Create a P2WSH address that contains a P2PK locking script. Then display the address.</p>
            </Exercise>
            <Exercise number={10}>
                <p>Create a transaction that spends UTXOs from a P2WSH address that contains a P2PK locking script.</p>
            </Exercise>
            <Exercise number={11}>
                <p>Create a P2SH(P2WSH) address that contains a P2PK locking script. Then display the address.</p>
            </Exercise>
            <Exercise number={12}>
                <p>Create a transaction that spends UTXOs from a P2SH(P2WSH) address that contains a P2PK locking script.</p>
            </Exercise>
            <Exercise number={13}>
                <p>Create a transaction that sends some bitcoins to a 2-of-2 P2MS standard output type.</p>
            </Exercise>
            <Exercise number={14}>
                <p>Create a transaction that spends some bitcoins from the 2-of-2 P2MS created above. Remember the <code>CHECKMULTISIG</code> bug.</p>
            </Exercise>
            <Exercise number={15}>
                <p>Create a 2-of-3 multisig (wrapped in P2SH) and display the address.</p>
            </Exercise>
            <Exercise number={16}>
                <p>Create a transaction that spends funds from the 2-of-3 multisig created above. Remember the <code>CHECKMULTISIG</code> bug.</p>
            </Exercise>
            <Exercise number={17}>
                <p>The Bitcoin white paper (PDF) is stored on the blockchain. The transaction id is: <code>54e48e5f5c656b26c3bca14a8c95aa583d07ebe84dde3b7dd4a78f4e4186e713</code>. Can you extract the data from this transaction and reconstruct the PDF?</p>
            </Exercise>

            <ChapterNav
                prev={{ path: '/keys-and-addresses', title: 'Keys and Addresses' }}
                next={{ path: '/scripting-2', title: 'Scripting 2' }}
            />
        </>
    )
}
