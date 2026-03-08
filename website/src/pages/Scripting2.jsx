import CodeBlock from '../components/CodeBlock'
import { Note, Summary, Exercise, Emphbox } from '../components/Callouts'
import Figure from '../components/Figure'
import ChapterNav from '../components/ChapterNav'

export default function Scripting2() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 7</div>
                <h1>Scripting 2</h1>
            </div>

            <Summary>
                <p>
                    This chapter is built upon the previous one and continues to explore more advanced scripts
                    and techniques for locking and unlocking funds in the Bitcoin network. Several examples
                    are provided.
                </p>
            </Summary>

            <h2 id="timelocks">Timelocks</h2>

            <p>
                Timelocks is a mechanism for postdating transactions or to lock funds for specific periods
                of time. It applies only to version 2 transactions. There are two different types of
                locking, one for absolute and one for relative time. In each one we can specify timelocks
                at transaction level or at script level.
            </p>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Absolute</th>
                            <th>Relative</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Transaction level</strong></td>
                            <td><code>nLocktime</code></td>
                            <td><code>nSequence</code></td>
                        </tr>
                        <tr>
                            <td><strong>Script level</strong></td>
                            <td><code>OP_CHECKLOCKTIMEVERIFY</code> (CLTV)</td>
                            <td><code>OP_CHECKSEQUENCEVERIFY</code> (CSV)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Absolute: Transaction Level — nLocktime</h3>

            <p>
                This feature was part of the initial Bitcoin implementation. Every transaction can include a
                timelock (<code>nLocktime</code>) to specify the earliest time that a transaction may be
                added to a block. Possible values:
            </p>

            <div className="table-wrapper">
                <table>
                    <tbody>
                        <tr><td><code>0</code></td><td>Transaction is always valid.</td></tr>
                        <tr><td><code>&lt; 500 million</code></td><td>Specifies the earliest block height that this transaction can be added.</td></tr>
                        <tr><td><code>&gt;= 500 million</code></td><td>Specifies the block header time (Unix Epoch) after which the transaction can be added to a block.</td></tr>
                    </tbody>
                </table>
            </div>

            <p>
                Absolute <code>nLocktime</code> is used in some wallets to prevent fee sniping. Fee sniping
                is a theoretical attack that involves large miners/pools mining two (or possibly more) blocks
                in an attempt to reorganize past blocks. The Bitcoin Core wallet (from 0.11.0) creates
                transactions that include an <code>nLocktime</code> of the current best height plus one.
                Thus, the transaction is valid for the next block as normal but in the case of a reorg a
                miner cannot add this transaction in a previous block.
            </p>

            <p>
                The original idea behind <code>nSequence</code> was that a transaction in the mempool would
                be replaced by using the same input with a higher sequence value. This assumes that miners
                would prefer higher sequence number transactions instead of more profitable ones which would
                never work. For this reason the <code>nSequence</code> input field was repurposed to specify
                additional transaction semantics like timelocks. Typical transactions have
                an <code>nSequence</code> of <code>0xFFFFFFFF</code>.
            </p>

            <p>
                Note that nLocktime creates a transaction that cannot be included in the blockchain until the
                specified block/time. This means that the person who created the transaction could create
                another transaction to spend the funds, invalidating the nLocktime transaction.
            </p>

            <h3>Absolute: Script Level — CLTV</h3>

            <p>
                Absolute locktime is achieved at the script level using
                the <code>CHECKLOCKTIMEVERIFY</code> or <em>CLTV</em> opcode. In late 2015 the BIP-65
                soft-fork redefined <code>OP_NOP2</code> as <code>OP_CHECKLOCKTIMEVERIFY</code> allowing
                timelocks to be specified per transaction output. To spend the output, the signature and
                public key are required as usual but the nLocktime field of the spending transaction also
                needs to be set to an equal or greater value of CLTV's timelock value. If not the script
                will fail immediately.
            </p>

            <p>
                A <code>scriptPubKey</code> example that locks an output until
                an <code>expiry_time</code> <em>and</em> a P2PKH equivalent would look like:
            </p>

            <Emphbox>
                <pre>{`<expiry_time> OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160
  <PKHash> OP_EQUALVERIFY OP_CHECKSIG`}</pre>
            </Emphbox>

            <p>
                To spend a transaction output with a timelock we need to specify the future block
                in <code>nLocktime</code> and activate the <code>nSequence</code> of the particular input
                that we want to spend to <code>0xFFFFFFFE</code>.
            </p>

            <Note>
                <p>
                    Since a script with <code>CHECKLOCKTIMEVERIFY</code> becomes part of the blockchain it
                    cannot be invalidated as described above with the transaction-level equivalent.
                </p>
            </Note>

            <h3>Relative: Transaction Level — nSequence</h3>

            <p>
                Relative timelocks were introduced in mid-2016 with BIPs 68 and 113 as a soft-fork that
                made use of the <code>nSequence</code> field of an input. <code>nSequence</code> was
                repurposed for relative timelocks. If the most significant bit of
                the <code>nSequence</code> 32-bit field was <code>0</code> then it was interpreted as a
                relative timelock. Then, bit 23 would specify the type (block height or Unix Epoch time)
                and the last 16 bits the value.
            </p>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Type (bit 23)</th>
                            <th>Meaning of last (least significant) 16 bits</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>0</td><td>The number of blocks that need to pass based on the height of the UTXO which the input spends.</td></tr>
                        <tr><td>1</td><td>The number of 512 seconds intervals that need to pass based on the timestamp of the UTXO which the input spends.</td></tr>
                    </tbody>
                </table>
            </div>

            <Figure
                src="./images/nsequence-field.png"
                caption="The nSequence field."
                label="fig-nsequence-field"
            />

            <h3>Relative: Script Level — CSV</h3>

            <p>
                The script-level equivalent of relative timelocks is using <code>CHECKSEQUENCEVERIFY</code> or <em>CSV</em> defined
                in BIP-112. It replaces <code>OP_NOP3</code> with <code>OP_CHECKSEQUENCEVERIFY</code>. When
                we create a transaction that spends a UTXO that contains a CSV, that input requires to
                have <code>nSequence</code> set with an equal or greater value to the CSV parameter value.
                Otherwise it will fail immediately.
            </p>

            <h3>Timelock types summary</h3>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Time</th>
                            <th>In blockchain</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>nLocktime</td>
                            <td>Transaction</td>
                            <td>Absolute</td>
                            <td>No</td>
                            <td>Similar to a will. Your heirs could get the funds in ~2040 but you could spend them (change will) in between.</td>
                        </tr>
                        <tr>
                            <td>nLocktime + CLTV</td>
                            <td>Script</td>
                            <td>Absolute</td>
                            <td>Yes</td>
                            <td>Lock funds as part of a deal that allows no one access until a specific date. Used in CLTV-based payment channels.</td>
                        </tr>
                        <tr>
                            <td>nSequence</td>
                            <td>Input</td>
                            <td>Relative</td>
                            <td>No</td>
                            <td>Lock funds as part of a deal that prohibits the other party to spend funds until ~3 months have passed but you can.</td>
                        </tr>
                        <tr>
                            <td>nSequence + CSV</td>
                            <td>Script</td>
                            <td>Relative</td>
                            <td>Yes</td>
                            <td>Lock funds as part of a deal that allows no one access until ~3 months have passed. Used in payment channels and Lightning Network.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Example: create a P2SH address with a relative timelock</h3>

            <p>
                Since the script we are going to create is not standard we need to wrap it using a P2SH
                output. Any funds sent to that address will be locked for 20 blocks as well as with a
                P2PKH-equivalent script.
            </p>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.transactions import Transaction, TxInput, TxOutput, Sequence
from bitcoinutils.keys import P2pkhAddress, P2shAddress, PrivateKey
from bitcoinutils.script import Script
from bitcoinutils.constants import TYPE_RELATIVE_TIMELOCK

def main():
    # always remember to setup the network
    setup('testnet')

    # This script creates a P2SH address containing a CHECKSEQUENCEVERIFY plus
    # a P2PKH; locking funds with a key as well as for 20 blocks

    # set values
    relative_blocks = 20

    seq = Sequence(TYPE_RELATIVE_TIMELOCK, relative_blocks)

    # secret key corresponding to the pubkey needed for the P2SH (P2PKH) transaction
    p2pkh_sk = PrivateKey('cRvyLwCPLU88jsyj94L7iJjQX5C2f8koG4G2gevN4BeSGcEvfKe9')

    # get the address (from the public key)
    p2pkh_addr = p2pkh_sk.get_public_key().get_address()

    # create the redeem script
    redeem_script = Script([seq.for_script(), 'OP_CHECKSEQUENCEVERIFY', 'OP_DROP',
                           'OP_DUP', 'OP_HASH160', p2pkh_addr.to_hash160(),
                           'OP_EQUALVERIFY', 'OP_CHECKSIG'])

    # create a P2SH address from a redeem script
    addr = P2shAddress.from_script(redeem_script)
    print(addr.to_string())

if __name__ == "__main__":
    main()`} />


            <h3>Example: spend funds from a P2SH timelocked address</h3>

            <p>
                Assuming that someone has sent funds to the P2SH address that we created above we can use
                this program to spend it. As usual and for simplicity, values are hardcoded and no change
                outputs are specified.
            </p>

            <CodeBlock language="python" code={`from bitcoinutils.setup import setup
from bitcoinutils.utils import to_satoshis
from bitcoinutils.transactions import Transaction, TxInput, TxOutput, Sequence
from bitcoinutils.keys import P2pkhAddress, P2shAddress, PrivateKey
from bitcoinutils.script import Script
from bitcoinutils.constants import TYPE_RELATIVE_TIMELOCK

def main():
    # always remember to setup the network
    setup('testnet')

    # set values
    relative_blocks = 20
    txid = '76c102821b916a625bd3f0c3c6e35d5c308b7c23e78b8866b06a3a466041db0a'
    vout = 0

    seq = Sequence(TYPE_RELATIVE_TIMELOCK, relative_blocks)

    # create transaction input from tx id of UTXO (contained 11.1 tBTC)
    txin = TxInput(txid, vout, sequence=seq.for_input_sequence())

    # secret key needed to spend P2PKH that is wrapped by P2SH
    p2pkh_sk = PrivateKey('cRvyLwCPLU88jsyj94L7iJjQX5C2f8koG4G2gevN4BeSGcEvfKe9')
    p2pkh_pk = p2pkh_sk.get_public_key().to_hex()
    p2pkh_addr = p2pkh_sk.get_public_key().get_address()

    # create the redeem script - needed to sign the transaction
    redeem_script = Script([seq.for_script(), 'OP_CHECKSEQUENCEVERIFY', 'OP_DROP',
                           'OP_DUP', 'OP_HASH160', p2pkh_addr.to_hash160(),
                           'OP_EQUALVERIFY', 'OP_CHECKSIG'])

    # send/spend to any random address
    to_addr = P2pkhAddress('n4bkvTyU1dVdzsrhWBqBw8fEMbHjJvtmJR')
    txout = TxOutput(to_satoshis(11), to_addr.to_script_pub_key())

    # no change address - the remaining 0.1 tBTC will go to miners

    # create transaction from inputs/outputs
    tx = Transaction([txin], [txout])

    # use the private key to create the signature for the txin
    sig = p2pkh_sk.sign_input(tx, 0, redeem_script)

    # set the scriptSig (unlocking script) -- unlock the P2PKH (sig, pk)
    # plus the redeem script, since it is a P2SH
    txin.script_sig = Script([sig, p2pkh_pk, redeem_script.to_hex()])
    signed_tx = tx.serialize()

    print("\\nRaw signed transaction:\\n" + signed_tx)
    print("\\nTxId:", tx.get_txid())

if __name__ == "__main__":
    main()`} />


            <h3>Timelocks important caveat</h3>

            <p>
                Remember that <code>nLockTime</code> is set for the whole transaction and that it is either
                specified as a block height or as block header time (Unix Epoch). Thus, if the transaction
                tries to spend two inputs one with block height CLTV and the other with time CLTV it would
                be impossible to spend.
            </p>

            <Emphbox>
                <pre>{`Input 0:
  1 OP_CLTV
Input 1:
  500000001 OP_CLTV`}</pre>
            </Emphbox>

            <p>
                The same would apply even for a single locking script that had both types of absolute
                locking. Relative timelocks use <code>nSequence</code> which is per input and thus for CSV
                the issue comes up only when a single script has both types of locking.
            </p>


            <h2 id="rbf-cpfp">RBF and CPFP</h2>

            <p>
                <em>Replace-by-fee</em> and <em>child-pays-for-parent</em> are two mechanisms that can help
                when transactions are stuck in the mempool due to low fees.
            </p>

            <h3>Replace-By-Fee (RBF)</h3>

            <p>
                Replace-by-fee, specified in BIP-125, is a mechanism for replacing any transaction that is
                still in the mempool. It is primarily useful for re-sending a transaction of yours in case
                it was stuck, e.g. due to low fees.
            </p>

            <p>
                Similar to timelocks it applies only to version 2 transactions and you need to
                set <code>nSequence</code> to a value of <code>0x01</code> to <code>0x7fffffff</code>.
                However, since such a value also enables relative timelocks one has to be careful. Typically,
                for RBF you set the <code>nSequence</code> value to <code>1</code>, which makes relative
                timelocks irrelevant, or from <code>0xf0000000</code> to <code>0xfffffffd</code> which
                disables relative timelocks.
            </p>

            <p>
                To work, in addition to setting the <code>nSequence</code> the transaction needs to reuse
                one or more of the same UTXOs and increase the fees. Using the Bitcoin core wallet there is
                an easy way to RBF a transaction by using <code>bumpfee</code>:
            </p>

            <Emphbox>
                <pre>{`$ bitcoin-cli -named bumpfee txid=53fe...ffb4`}</pre>
            </Emphbox>

            <h3>Child-Pays-for-Parent (CPFP)</h3>

            <p>
                Child-pays-for-parent or CPFP is a mechanism for including a previous transaction (parent) in
                a block by creating a transaction (child) that spends one of the UTXOs of the parent. Miners
                will notice that the new transaction uses another one and will consider both transactions'
                fees when deciding whether to include it in the next block.
            </p>

            <p>
                For example if someone sends you bitcoins but the transaction was stuck (e.g. due to low
                fees) you as a recipient can create a transaction that tries to spend the bitcoins from your
                address from the unconfirmed transaction. The fees of this transaction should be quite high
                to properly incentivize the miner.
            </p>

            <Note>
                <p>
                    The <em>sender</em> of some funds can use RBF to increase the fee to unstick a transaction
                    from the mempool. The <em>recipient</em> of some funds can use CPFP to indirectly increase
                    the fee to unstick a transaction from the mempool.
                </p>
            </Note>


            <h2 id="htlc">Hash Time-Locked Contracts (HTLC)</h2>

            <h3>Hashlocks</h3>

            <p>
                A hashlock is a type of locking script that restricts the spending of an output until a
                specific piece of data, e.g. a passphrase, is publicly revealed. Such a locking script
                would be:
            </p>

            <Emphbox>
                <pre>{`OP_HASH256 <passphrase_hash> OP_EQUAL`}</pre>
            </Emphbox>

            <p>
                This makes it possible to create multiple outputs locked with the same hashlock and when one
                is spent the rest will also be available for spending, since by spending one the passphrase
                will be revealed. However, since the passphrase will become public, everyone will be able to
                spend the rest of the outputs. Thus, outputs protected by hashlocks are typically also
                protected by specific signatures so that only the owners of the corresponding keys could
                spend the remaining outputs. This is similar to what 2FA offers (something one owns and
                something one knows).
            </p>

            <Emphbox>
                <pre>{`OP_HASH256 <passphrase_hash> OP_EQUALVERIFY
OP_DUP OP_HASH160 <PKHash> OP_EQUALVERIFY OP_CHECKSIG`}</pre>
            </Emphbox>


            <h3>HTLC</h3>

            <p>
                A <em>Hashed Time-Locked Contract</em> (BIP-199) is a combination of a hashlock and a
                timelock that requires the receiver of a payment to either provide a passphrase or forfeit
                the payment allowing the sender to take the funds back. For example:
            </p>

            <Emphbox>
                <pre>{`OP_IF
    OP_SHA256 <passphrase_hash> OP_EQUALVERIFY
    OP_DUP OP_HASH160 <receiver PKH>
OP_ELSE
    100 OP_CHECKSEQUENCEVERIFY OP_DROP
    OP_DUP OP_HASH160 <sender PKH>
OP_ENDIF
OP_EQUALVERIFY
OP_CHECKSIG`}</pre>
            </Emphbox>

            <p>
                The above locking script would be created by both sender and receiver collaborating. The
                receiver knows the passphrase, also called <em>pre-image</em>, but only shares its hash,
                also called <em>digest</em>. The sender can then send some funds to that P2SH address. The
                receiver can claim the funds if they reveal the passphrase. If not, after 100 blocks pass
                the sender can claim the funds.
            </p>

            <p>
                Let's go through this scenario in more detail. Alice wants to learn some information, e.g.
                a passphrase, and is willing to pay to get it. Bob has the passphrase and is willing
                to <em>sell</em> it. To setup an HTLC:
            </p>

            <ul>
                <li>Alice (sender) and Bob (receiver) exchange public keys</li>
                <li>Alice and Bob agree upon a timeout threshold</li>
                <li>Bob sends the <code>passphrase_hash</code> (digest) to Alice</li>
                <li>They can now both create the script and P2SH address</li>
                <li>Alice sends funds to the new P2SH address</li>
            </ul>

            <Figure
                src="./images/htlc.png"
                caption="HTLC setup with potential scenarios."
                label="fig-htlc"
            />

            <p>
                According to the locking script there are only two possible scenarios:
            </p>

            <ol>
                <li>Bob claims the funds and in doing so reveals the passphrase.</li>
                <li>Bob does not claim the funds until the agreed timeout. Alice can take the funds back.</li>
            </ol>

            <h3>HTLC Applications</h3>

            <p>
                HTLC transactions are a safe and cheap method of exchanging secrets for money over the
                blockchain. Applications include Atomic Swaps, Lightning Network, Zero-knowledge contingent
                payments and potentially several others.
            </p>


            <h2 id="atomic-swaps">Atomic Swaps</h2>

            <p>
                Atomic Swaps is a way of trustlessly exchanging funds between different blockchains. You can
                swap funds in a predetermined exchange rate. For example Alice wants to send 1 BTC to Bob in
                the Bitcoin blockchain and receive 100 LTC from Bob in the Litecoin blockchain. It is
                important that these two transactions <em>effectively</em> happen atomically, either both
                happen or none.
            </p>

            <p>
                To accomplish that we can use two HTLC contracts, one in each blockchain. The same passphrase
                should be used, thus once the funds from one of the blockchains is claimed (passphrase
                revealed) it can immediately be claimed in the other.
            </p>

            <Figure
                src="./images/atomic-swaps.png"
                caption="Atomic swap between Bitcoin and Litecoin blockchains."
                label="fig-atomic-swaps"
            />

            <p>Let us describe a step-by-step example demonstrating the mechanism:</p>

            <ol>
                <li><strong>Initial setup</strong>
                    <ul>
                        <li>Alice and Bob exchange public keys on both Bitcoin and Litecoin.</li>
                        <li>Alice and Bob agree upon the timeout thresholds, say 48 and 24 hours.</li>
                        <li>Alice knows of a passphrase (pre-image) which is hashed to produce a digest; the latter is shared with Bob.</li>
                    </ul>
                </li>
                <li><strong>Both create HTLCs</strong>
                    <ul>
                        <li>The funds can be redeemed by the passphrase and their counterpart's signature, or by both Alice's and Bob's signatures.</li>
                        <li>Alice sends 1 BTC to the Bitcoin's HTLC and Bob sends 100 LTC to the Litecoin's HTLC. <em>No one</em> broadcasts the transaction!</li>
                    </ul>
                </li>
                <li><strong>Both create refund transactions</strong>
                    <ul>
                        <li>Alice creates a timelocked refund transaction that would be valid after 48 hours.</li>
                        <li>Bob creates a timelocked refund transaction that would be valid after 24 hours.</li>
                        <li>Both pass the refund transaction to their counterpart for their signature.</li>
                        <li>They now both have a final refund transaction that is ready to be broadcasted if something goes wrong.</li>
                    </ul>
                </li>
                <li><strong>Alice and Bob both broadcast the funding transaction from step (ii).</strong></li>
                <li><strong>Alice unlocks the Litecoin HTLC by the "passphrase" clause revealing the passphrase in the process.</strong></li>
                <li><strong>Bob uses the passphrase to unlock the Bitcoin HTLC as well and the atomic swap was successful.</strong></li>
            </ol>

            <p>
                Note that the above ordering is not strict in any sense. As long as the refund transactions
                are both signed before the passphrase is revealed everyone is safe.
            </p>

            <p>
                It is important to understand that active participation is required in this exchange. For
                example, if Bob does not use the passphrase to claim the bitcoin in time after the passphrase
                is revealed, Alice can use her refund transaction and also get her bitcoin back!
            </p>

            <Note>
                <p>
                    Participants in an atomic swap need to inspect the blockchain for the relevant
                    transactions!
                </p>
            </Note>

            <p>
                Atomic swaps allow for trustless exchange between assets of different blockchains. One
                potential use case is trustless decentralized exchanges.
            </p>


            <h2 id="exercises">Exercises</h2>

            <Exercise number={1}>
                <p>
                    Create an address that locks the funds with an absolute timelock some time in the future
                    (use block height or timestamp).
                </p>
            </Exercise>
            <Exercise number={2}>
                <p>
                    Create a script that unlocks the funds from an address with an absolute timelock like the
                    one created in the previous exercise.
                </p>
            </Exercise>
            <Exercise number={3}>
                <p>
                    Implement the example HTLC scenario described above. Create the appropriate scripts for
                    both Alice and Bob.
                </p>
            </Exercise>
            <Exercise number={4}>
                <p>
                    Write the HTLC locking script that Alice needs to create for the atomic swap in step (ii).
                </p>
            </Exercise>
            <Exercise number={5}>
                <p>
                    Write the unlocking script that Alice needs to use to claim the litecoin in step (v).
                </p>
            </Exercise>
            <Exercise number={6}>
                <p>
                    Try to design a platform that would facilitate atomic swaps between Bitcoin and Litecoin.
                    Think about it holistically and in practical terms; i.e. how would you design and
                    implement such a platform. Keep a note of all the potential difficulties.
                </p>
            </Exercise>

            <ChapterNav
                prev={{ path: '/scripting-1', title: 'Scripting 1' }}
                next={{ path: '/advanced-topics', title: 'Advanced Topics' }}
            />
        </>
    )
}
