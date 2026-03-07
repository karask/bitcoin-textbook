import { Note, Summary } from '../components/Callouts'
import Figure from '../components/Figure'
import ChapterNav from '../components/ChapterNav'

export default function Forking() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 3</div>
                <h1>Forking in a nutshell</h1>
            </div>

            <Summary>
                <p>
                    This chapter will look into the process of upgrading the network. It explains what forking
                    the blockchain means and what are the consequences.
                </p>
            </Summary>

            <h2 id="software-forks">Software Development Forks</h2>

            <p>
                A software project fork occurs when some developers take a copy of the project and develop
                it independently of the original. This is a <em>divergence of direction</em>; effectively we
                now have two separate projects. Some notable examples include:
            </p>

            <ul>
                <li>Linux Mint from Ubuntu (and Ubuntu from Debian)</li>
                <li>MariaDB from MySQL</li>
                <li>PostgreSQL from Ingres</li>
                <li>OpenSSH from OSSH</li>
                <li>Inkscape from Sodipodi</li>
                <li>Plex from XBMC</li>
            </ul>

            <h2 id="blockchain-forks">Blockchain Forks</h2>

            <p>
                A blockchain fork occurs when different peers on the network run code that implements
                incompatible rules. Since running new code might result in a network fork the only way to
                update the Bitcoin protocol is by forking.
            </p>

            <Note>
                <p>
                    Temporary branching on the blockchain can sometimes occur and it is part of the Nakamoto
                    consensus. Forking refers to compatibility breaking changes between peers.
                </p>
            </Note>

            <p>There are two different types of blockchain forking:</p>

            <dl>
                <dt>Soft-forks</dt>
                <dd>Blocks that would be valid (to old nodes) are now invalid</dd>
                <dt>Hard-forks</dt>
                <dd>Blocks that would be invalid (to old nodes) are now valid</dd>
            </dl>

            <h2 id="soft-forks">Soft-forks</h2>

            <p>
                Blocks that would be valid are now invalid; thus new blocks created are a subset of the
                possible blocks that the old rule-set would allow. Both old and new nodes will accept new
                blocks. However, blocks created by old nodes will be accepted only by old nodes.
            </p>

            <p>Soft-forks are backward compatible; they do not force old nodes to upgrade.</p>

            <Figure
                src="./images/soft-fork-example.png"
                caption="A soft-fork example."
                label="fig-soft-fork-example"
                scale={0.8}
            />

            <ol style={{ listStyleType: 'lower-roman' }}>
                <li>Initially our example network has only two blocks and all nodes are in sync.</li>
                <li>Then, a soft-fork upgrade occurs where 67% of the network uses the new rules and one of the new nodes finds a new block. It is accepted by everyone.</li>
                <li>Next, a block with the old ruleset is created. It is only accepted by old nodes.</li>
                <li>Next another block with the new rules is found. The chain with the new rules is now the longest chain!</li>
                <li>The old nodes are forced to follow the longest chain and thus the network is in sync again.</li>
            </ol>

            <h2 id="hard-forks">Hard-forks</h2>

            <p>
                Blocks that would be invalid are now valid; thus new blocks created are a superset of the
                possible blocks that the old rule-set would allow. Irrespective of the hashing rate this
                will result in a chain split.
            </p>

            <Figure
                src="./images/hard-fork-example.png"
                caption="A hard-fork example."
                label="fig-hard-fork-example"
                scale={0.8}
            />

            <ol style={{ listStyleType: 'lower-roman' }}>
                <li>Initially our example network has only two blocks and all nodes are in sync.</li>
                <li>A hard-fork upgrade occurs where 67% uses the new rules. A new block is found but only accepted by new nodes.</li>
                <li>Next a block is found based on old rules, accepted only by old nodes.</li>
                <li>The split is permanent.</li>
            </ol>

            <h3>Hard-fork first example</h3>
            <p>
                In June 2010 Bitcoin core v0.2.10 introduced a change that was not forward compatible. Ample
                time was given for all participants to upgrade and it activated without incident in February 2012.
            </p>

            <h3>Hard-fork second example</h3>
            <p>
                In August 2010 an integer overflow bug was identified in Bitcoin core v0.3.9 where billions
                of bitcoins could be erroneously sent. The community quickly coordinated and released v0.3.10
                which fixed the issue.
            </p>

            <h3>Hard-fork third example</h3>
            <p>
                In March 2013, Bitcoin core v0.8 switched from BerkeleyDB to LevelDB, introducing an
                unexpected bug. Major miners were asked to switch back to v0.7 to minimize disruption.
            </p>

            <h2 id="upgrading-bitcoin">Upgrading Bitcoin</h2>

            <h3>BIP-34</h3>
            <p>
                When miners want to support a proposal they would increase the block version to signal that.
                If 750 out of 1000 blocks have the new version, reject invalid blocks. If 950 out of 1000
                blocks have the new version, reject all old version blocks.
            </p>

            <h3>BIP-9</h3>
            <p>
                BIP-34 allowed only one upgrade at a time. BIP-9 uses the remaining 29 bits of the block
                version field to signal for up to 29 proposals in parallel. Threshold for activation is 95%.
            </p>

            <Note>
                <p>
                    The Bitcoin community opted to do only soft-fork upgrades to minimize disruption. A notable
                    example is the <em>Segregated Witness</em> or <em>segwit</em> upgrade.
                </p>
            </Note>

            <h3>BIP-8</h3>
            <p>
                The current BIP used for upgrading. It uses block height instead of timestamps, has a 90%
                threshold, and gives the option to reject or enforce the upgrade at timeout with the{' '}
                <code>lockontimeout</code> parameter. BIP-8 was used for the activation of Taproot.
            </p>

            <ChapterNav
                prev={{ path: '/p2p-networking', title: 'P2P Networking' }}
                next={{ path: '/technical-fundamentals', title: 'Technical Fundamentals' }}
            />
        </>
    )
}
