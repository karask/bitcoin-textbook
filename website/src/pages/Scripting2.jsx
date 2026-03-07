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
                    This chapter describes more advanced scripting concepts in order to provide the reader with
                    the tools to do more complex things with Bitcoin. It introduces the concept of timelocks
                    and explains the several locking mechanisms that exist. Finally, it explores Hash
                    Time-Locked Contracts and Atomic Swaps and how they relate to timelocks.
                </p>
            </Summary>

            <h2 id="timelocks">Timelocks</h2>

            <p>
                Timelocks restrict the spending of some bitcoins until a specified future time or block
                height. They can be at the <em>transaction level</em> or the <em>script level</em>. They
                can also be <em>absolute</em> or <em>relative</em>.
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
                            <td><code>OP_CHECKLOCKTIMEVERIFY</code>(CLTV)</td>
                            <td><code>OP_CHECKSEQUENCEVERIFY</code> (CSV)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Absolute: Transaction Level — nLocktime</h3>

            <p>
                A field in the transaction specifying the earliest time a transaction can be added to the
                blockchain. If less than 500 million it is interpreted as a block height otherwise as a
                Unix timestamp.
            </p>

            <h3>Absolute: Script Level — CLTV</h3>

            <p>
                CLTV marks a transaction output as unspendable until a specified future time. Unlike
                nLocktime, CLTV resides in the <code>scriptPubKey</code> and is permanent. Using
                {' '}<code>OP_CHECKLOCKTIMEVERIFY</code> we can verify that the transaction's nLocktime is at
                least as large as the script's CLTV value.
            </p>

            <Emphbox>
                <pre>{`<expire_time> OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160
  <PKHash> OP_EQUALVERIFY OP_CHECKSIG`}</pre>
            </Emphbox>

            <CodeBlock language="python" caption="Example of creating (and spending) a P2SH address for absolute timelocked transaction" code={`from bitcoinutils.setup import setup
from bitcoinutils.utils import to_satoshis
from bitcoinutils.transactions import Transaction, TxInput, TxOutput, Sequence
from bitcoinutils.keys import P2pkhAddress, P2shAddress, PrivateKey
from bitcoinutils.script import Script

def main():
    setup('testnet')

    # secret key of address that has the UTXO to send to the P2SH address
    sk = PrivateKey('cTmyBsxMQ3vyh4J3jCKYn2Au7AhTKvqeYuxxkinsg6Rz3BBPrYKK')

    # P2SH address that contains the absolute timelock
    seq = Sequence(TYPE_ABSOLUTE_TIMELOCK, 1000)
    redeem_script = Script([seq.for_script(), 'OP_CHECKLOCKTIMEVERIFY',
                              'OP_DROP', 'OP_DUP', 'OP_HASH160',
                              sk.get_public_key().get_address().to_hash160(),
                              'OP_EQUALVERIFY', 'OP_CHECKSIG'])
    addr = P2shAddress.from_script(redeem_script)
    print(addr.to_string())

if __name__ == "__main__":
    main()`} />

            <h3>Relative: Transaction Level — nSequence</h3>

            <p>
                The sequence number in each transaction input can specify a relative locktime. It encodes
                whether to use blocks or time and the actual value. It acts as a relative lock from the time
                that the UTXO that it references was mined.
            </p>

            <Figure
                src="./images/nsequence-field.png"
                caption="The nSequence field."
                label="fig-nsequence-field"
            />

            <h3>Relative: Script Level — CSV</h3>

            <p>
                <code>OP_CHECKSEQUENCEVERIFY</code> enables a script to verify relative timelocks. It
                compares the value in the script with the input's nSequence value.
            </p>

            <h2 id="rbf-cpfp">RBF and CPFP</h2>

            <h3>Replace-by-Fee (RBF)</h3>

            <p>
                RBF allows an unconfirmed transaction to be replaced by another version of the same
                transaction that pays a higher fee. This is signaled by setting nSequence to less
                than <code>0xfffffffe</code>.
            </p>

            <h3>Child-Pays-for-Parent (CPFP)</h3>

            <p>
                CPFP allows a child transaction to pay a high enough fee for both itself and its parent.
                The miner includes both transactions because the combined fee is profitable.
            </p>

            <h2 id="htlc">Hash Time-Locked Contracts (HTLC)</h2>

            <p>
                An HTLC allows a sender to lock funds so that the recipient can claim them by providing a
                secret preimage within a time limit. If the recipient does not claim the funds before the
                timelock expires, the sender can reclaim them.
            </p>

            <Emphbox>
                <pre>{`OP_IF
  OP_SHA256 <secretHash> OP_EQUALVERIFY OP_DUP OP_HASH160 <recipientPKH>
OP_ELSE
  <timeout> OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160 <senderPKH>
OP_ENDIF
OP_EQUALVERIFY OP_CHECKSIG`}</pre>
            </Emphbox>

            <Figure
                src="./images/htlc.png"
                caption="Simplified HTLC flow."
                label="fig-htlc"
            />

            <h2 id="atomic-swaps">Atomic Swaps</h2>

            <p>
                Atomic Swaps are decentralized cross-chain exchanges that use HTLCs to ensure that both
                parties exchange or both can refund. They are called <em>atomic</em> because either all of
                the trade takes place or none does.
            </p>

            <Figure
                src="./images/atomic-swaps.png"
                caption="Cross-chain Atomic Swap."
                label="fig-atomic-swaps"
            />

            <p>
                The process uses two HTLCs that share the same secret preimage. If one side reveals the
                secret to claim funds on one chain, the other side can use that secret to claim funds on
                the other chain.
            </p>

            <h2 id="exercises">Exercises</h2>

            <Exercise number={1}>
                <p>
                    Create a P2SH address that requires two conditions to be met: anyone can spend the
                    output after a specific block height and additionally, they need to provide a specific
                    secret number.
                </p>
            </Exercise>
            <Exercise number={2}>
                <p>
                    Create a P2SH address that can be spent either by the sender using a relative timelock
                    or by the recipient with their signature.
                </p>
            </Exercise>
            <Exercise number={3}>
                <p>
                    Create a custom Bitcoin contract using P2SH that involves timelocks, multisig, and
                    hash preimages.
                </p>
            </Exercise>

            <ChapterNav
                prev={{ path: '/scripting-1', title: 'Scripting 1' }}
                next={{ path: '/advanced-topics', title: 'Advanced Topics' }}
            />
        </>
    )
}
