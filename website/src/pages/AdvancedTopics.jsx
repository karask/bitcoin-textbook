import { Summary } from '../components/Callouts'
import ChapterNav from '../components/ChapterNav'

export default function AdvancedTopics() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 8</div>
                <h1>Advanced Topics</h1>
            </div>

            <Summary>
                <p>
                    This chapter explores advanced Bitcoin topics including Payment Channels, the Lightning
                    Network, and Sidechains. These concepts build on the scripting and timelock primitives
                    from earlier chapters.
                </p>
            </Summary>

            <h2 id="payment-channels">Payment Channels</h2>

            <p>
                Payment channels allow two parties to transact multiple times without broadcasting every
                transaction to the blockchain. Only the opening and closing transactions are recorded
                on-chain, significantly reducing fees and improving throughput.
            </p>

            <h3>Spillman-style Payment Channels</h3>

            <p>
                The simplest form of payment channel using <code>nLocktime</code>. The sender creates a
                funding transaction that requires both parties' signatures, and a refund transaction with
                a timelock. The sender then creates updated "payment" transactions with decreasing
                amounts to themselves and increasing amounts to the recipient.
            </p>

            <h3>CLTV-style Payment Channels</h3>

            <p>
                An improvement over Spillman channels using <code>OP_CHECKLOCKTIMEVERIFY</code>. The
                timelock is placed in the script itself rather than the transaction, providing better
                security guarantees.
            </p>

            <h3>Poon-Dryja Bidirectional Payment Channels</h3>

            <p>
                The payment channel design used by the Lightning Network. It supports bidirectional
                payments and uses a <em>revocation</em> mechanism where old channel states can be
                penalized. Each update creates a new commitment transaction that supersedes the previous
                one. If either party broadcasts an old (revoked) state, the other party can claim all
                funds as a penalty.
            </p>

            <h2 id="lightning-network">Lightning Network</h2>

            <p>
                The Lightning Network is a second-layer protocol that connects payment channels into a
                network. It enables instant, high-volume micropayments by routing payments through
                intermediate nodes using Hash Time-Locked Contracts (HTLCs).
            </p>

            <p>Key properties of the Lightning Network:</p>

            <ul>
                <li><strong>Speed</strong> — transactions are near-instant</li>
                <li><strong>Low fees</strong> — fraction of on-chain fees</li>
                <li><strong>Scalability</strong> — potentially millions of transactions per second</li>
                <li><strong>Privacy</strong> — most transactions are not recorded on-chain</li>
                <li><strong>Trust-minimized</strong> — parties can always fall back to on-chain settlement</li>
            </ul>

            <h2 id="sidechains">Sidechains</h2>

            <p>
                Sidechains are separate blockchains that are interoperable with Bitcoin's main chain. They
                allow bitcoins to be moved between chains using a <em>two-way peg</em> mechanism, enabling
                experimentation with new features without risking the main Bitcoin blockchain.
            </p>

            <div style={{
                marginTop: '3rem',
                padding: '2rem',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
            }}>
                <p style={{ fontSize: 'var(--text-lg)', marginBottom: '0.5rem' }}>
                    🚧 This chapter is under active development
                </p>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
                    Detailed implementations and code examples for Payment Channels, Lightning Network, and
                    Sidechains are coming soon.
                </p>
            </div>

            <ChapterNav
                prev={{ path: '/scripting-2', title: 'Scripting 2' }}
            />
        </>
    )
}
