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
                it independently of the original. This is not just another development branch, this is a{' '}
                <em>divergence of direction</em>; effectively we now have two separate projects and the
                community splits accordingly.
            </p>

            <p>
                Project forking is an important aspect of open source development allowing different opinions
                and roadmaps to become a reality. Some notable examples are:
            </p>

            <ul>
                <li>Linux Mint from Ubuntu (and Ubuntu from Debian)</li>
                <li>MariaDB from MySQL</li>
                <li>PostgreSQL from Ingres</li>
                <li>OpenSSH from OSSH</li>
                <li>Inkscape from Sodipodi (and Sodipodi from Gill)</li>
                <li>Plex from XBMC</li>
                <li>And many many more.</li>
            </ul>

            <h2 id="blockchain-forks">Blockchain Forks</h2>

            <p>
                A blockchain fork occurs when different peers on the network run code that implements
                incompatible rules. This can happen because of a software project fork when some developers
                take a copy of a blockchain project and develop it independently of the original but it could
                also happen due to a bug in a simple upgrade.
            </p>

            <p>
                If the implemented rules change to a degree that the messages are not compatible with the
                original rules then some peers will start rejecting some of the messages with the possibility
                that the peer to peer network is effectively split into two networks, depending on the kind of
                change that occurred; i.e. the blockchain will fork and different peers will add blocks to
                different blockchains.
            </p>

            <p>
                Since running new code might result in a network (aka chain) fork the only way to update the
                Bitcoin protocol (in particular the consensus rules) is by forking.
            </p>

            <Note>
                <p>
                    Temporary branching on the blockchain can sometimes occur and it is part of the Nakamoto
                    consensus. Forking refers to compatibility breaking changes between peers.
                </p>
            </Note>

            <p>
                Forks can occur when nodes on the network run different versions of the software. This is the
                case when the Bitcoin software is being upgraded, e.g. from core v0.11.2 to core v0.12.0. This
                is a scheduled fork and if all peers agree on the change and upgrade the software in a timely
                manner there will be no issues.
            </p>

            <p>
                Alternatively, competing versions might run, e.g. Bitcoin Core v0.12.0 and Bitcoin Classic
                v0.12.0. The two groups will have different visions on how they wish Bitcoin to evolve and thus
                compete to gain the majority of the hashing power in order for their chain to prevail (prevail
                in terms of hashing power; other than that both networks can co-exist).
            </p>

            <p>
                We can have intentional forks due to software upgrades or alternative implementations, and
                unintentional forks due to incompatibilities caused by bugs.
            </p>

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

            <p>
                In theory, even 51% of the hashrate would be enough for the new chain since it will
                consistently (over a period) have the longer chain. Since the longer chain consists of new
                blocks which are valid by both old and new nodes, the old nodes will switch to the chain
                consisting new node blocks; thus the blockchain itself remains compatible between all the nodes.
            </p>

            <p>
                Soft-forks are backward compatible; valid inputs of the new version are also valid by the old
                version. They do not force old nodes to upgrade or else consider them out of consensus.
            </p>

            <p>
                A easy to understand example would be a new rule that decreases the maximum block size to
                300kB. From now on new nodes will accept as valid only blocks that are 300kB or less. These
                blocks are also valid to the old nodes so it is a soft-fork change. Since the new blocks have
                the majority of the hashrate the chain will eventually consist of only 300kB blocks and old
                nodes will slowly upgrade to the new rules (they don't have to upgrade but their larger than
                300kB blocks will never be finalized in the blockchain, so they might as well upgrade).
            </p>

            <p>
                Another example is Segwit but that involved several changes. Several sophisticated
                modifications were required to implement it as a soft-fork; see the Segregated Witness section
                in the Scripting 2 chapter for more details.
            </p>

            <p>
                To summarize, in a typical soft-fork, the new rules do not clash with the old rules. For a
                step by step example of a soft-fork and how new blocks are added on top see the figure below.
            </p>

            <Figure
                src="./images/soft-fork-example.png"
                caption="A soft-fork example."
                label="fig-soft-fork-example"
                scale={0.8}
            />

            <ol style={{ listStyleType: 'lower-roman' }}>
                <li>Initially our example network has only two blocks and all nodes are in sync.</li>
                <li>Then, a soft-fork upgrade occurs where 67% of the network uses the new rules and one of the new nodes finds a new block. That block is accepted by everyone since new rules are a subset of the old rules. All the nodes are still in sync.</li>
                <li>Next, a block with the old ruleset is created. It is only accepted by old nodes and thus we now have a temporary split.</li>
                <li>Next another block with the new rules is found. It is accepted only by the new rules since the chains' tips are different. Note that the chains are now of equal size.</li>
                <li>Then yet another block with the new rules is found (67% chance!). Again, it is added on top of the chain with an orange block on top. However, the chain with the new rules is now the longest chain!</li>
                <li>The old nodes are forced to follow the longest chain and thus the network is in sync again.</li>
            </ol>

            <p>
                The actual blockchain will always sync to the longest chain and the above mentioned percentages
                have to do with the hashing rate and thus the miners. However, to other stakeholders like users
                and merchants a prolonged soft-fork could prove very disruptive.
            </p>

            <p>
                Specifically, if a merchant is using the old chain for its transactions it is possible that
                their transactions are ignored when the node switches to the new nodes' (longest) chain. In
                between, that would lead to fake confirmations and potential <em>double spends</em>.
            </p>

            <p>
                Typically, if hashrate is obviously leaning to one side the rest of the network nodes will
                follow; miners to stop losing rewards and merchants/users to have more consistent transactions.
            </p>

            <p>
                Note that if the new nodes have 49% or less they will not be able to sustain the longest chain
                and two incompatible chains will be created that cannot re-sync, leading to a{' '}
                <em>temporary</em> hard-fork.
            </p>

            <Note>
                <p>
                    Whenever a longer alternative chain appears nodes have to accept it and substitute their
                    latest blocks up until a common parent is found with the new chain. When that happens we say
                    that a re-organization or <em>reorg</em> occurred.
                </p>
            </Note>


            <h2 id="hard-forks">Hard-forks</h2>

            <p>
                Blocks that would be invalid are now valid; thus new blocks created are a superset of the
                possible blocks that the old rule-set would allow. Neither old or new nodes will accept blocks
                created from the others (of course this assumes that the new incompatible feature is being used
                in that block).
            </p>

            <p>
                Irrespective of the hashing rate this will result in a chain split that will not be able to be
                resolved unless one of the sides changes software.
            </p>

            <p>
                For a step by step example of a hard-fork and how new blocks are added on top see the figure
                below.
            </p>

            <Figure
                src="./images/hard-fork-example.png"
                caption="A hard-fork example."
                label="fig-hard-fork-example"
                scale={0.8}
            />

            <ol style={{ listStyleType: 'lower-roman' }}>
                <li>Initially our example network has only two blocks and all nodes are in sync.</li>
                <li>Then, a hard-fork upgrade occurs where 67% of the network uses the new rules and one of the new nodes finds a new block. The new block is accepted only by the nodes with the new rules and thus we have a split.</li>
                <li>Next a block is found based on the old rules which is accepted only by the nodes running the old rules.</li>
                <li>Finally, another block is found by the nodes running the new rules which goes on the respective chain. The old nodes will never accept the incompatible blocks even from a longer chain. The split is permanent.</li>
            </ol>

            <p>
                If a hard-fork occurs the network is effectively split in two. The mining hashrate is split in
                two as are the merchants and users. If one side does not change their software a hard-fork can
                permanently split the community in two, effectively having two separate coins from that point
                onwards.
            </p>

            <p>
                The same amount of bitcoins will exist in both chains and users will be able to access both.
                Miners, users and merchants have to choose which side to support and in some cases
                merchants/users can choose to support both; one of the coins will probably be termed an altcoin
                and supported as such.
            </p>

            <p>
                All transactions after the split are in danger of being rolled back (e.g. allow some users to
                double-spend) if the fork resolves.
            </p>

            <p>
                A chain fork also has potential replay attacks; signed transaction in one chain to be relayed
                on the other chain. For example, a merchant that gets some bitcoins for a product, replays the
                transaction on the other chain to get the coins of the other chain as well.
            </p>

            <h3>Hard-fork first example</h3>
            <p>
                In June 2010 Bitcoin core v0.2.10 introduced a change to the protocol that was not forward
                compatible. The version messages exchanged by nodes at connection time have changed format and
                included checksum values.
            </p>
            <p>
                Since this would lead to a hard-fork ample time was given for all miners, users and merchants
                to upgrade before the activation of the new feature.
            </p>
            <p>
                The new feature was activated in February 2012 and it happened without any incident.
            </p>

            <h3>Hard-fork second example</h3>
            <p>
                In August 2010 an integer overflow bug was identified in Bitcoin core v0.3.9 where billions
                of bitcoins could be erroneously sent. The community quickly coordinated and released v0.3.10
                which fixed the issue by checking more thoroughly the integer limits.
            </p>
            <p>
                The new version was soon run by the majority of nodes (back then all nodes were mining nodes)
                and thus the new chain overtook the old erroneous one removing the inflation bug.
            </p>

            <h3>Hard-fork third example</h3>
            <p>
                In March 2013, Bitcoin core v0.8 switched its database for storing information about blocks
                and transactions from BerkeleyDB to LevelDB because it was more efficient. However, with the
                upgrade came an unexpected bug that caused incompatibility between nodes running BerkeleyDB and
                the new ones running LevelDB.
            </p>
            <p>
                The bug was that BerkeleyDB had a limit on effectively how many changes it can make to the
                database while LevelDB did not. The limit was reached and old nodes rejected the block that
                caused it while new nodes accepted it; blocks that would be invalid were now valid.
            </p>
            <p>
                The fork was detected quickly by IRC users reporting conflicting block heights on their nodes.
                The new chain had the majority of the hash rate and thus the old nodes were left behind with a
                possibility of finding and notifying them being slim.
            </p>
            <p>
                Major miners were easier to find however and it was quickly agreed that they switch back to
                v0.7 so that the majority of the hashrate was that of the old nodes. This way thousands of
                users being on old nodes would not need to upgrade their clients and that would minimize
                disruption.
            </p>
            <p>
                Indeed, since it was communicated to most miners that a bug caused a split and, more
                importantly, since the majority of the hashrate was in the old chain the rest of the miners had
                strong incentive to revert to the old version as well to be part of the valid chain (and thus
                get rewards).
            </p>
            <p>
                There was no political, economic or other incentive to continue with the new chain and thus it
                died away. Some miners lost their rewards and a merchant fell victim to a successful double
                spend but other than that the incident was painless.
            </p>

            <h2 id="upgrading-bitcoin">Upgrading Bitcoin</h2>

            <p>
                During the first years of its existence upgrading Bitcoin involved notifying node owners to
                upgrade via forums and mailing lists. The community was smaller and more in-line regarding the
                future of Bitcoin.
            </p>

            <p>
                As the network grew however coordinating via forums could not scale well so new mechanisms were
                added to improve the process.
            </p>

            <p>
                New proposals came up on how miners can signal agreement for particular upgrades. If there was
                enough consensus the upgrade would be activated. The first proposal was{' '}
                <a href="https://github.com/bitcoin/bips/blob/master/bip-0034.mediawiki" target="_blank" rel="noopener noreferrer">BIP-34</a>{' '}
                which allowed signalling for one upgrade decision at a time. It was later superseded by{' '}
                <a href="https://github.com/bitcoin/bips/blob/master/bip-0009.mediawiki" target="_blank" rel="noopener noreferrer">BIP-9</a>{' '}
                which allowed, among other benefits, more than one upgrade decision to be made. The current
                activation method is{' '}
                <a href="https://github.com/bitcoin/bips/blob/master/bip-0008.mediawiki" target="_blank" rel="noopener noreferrer">BIP-8</a>{' '}
                which is very similar to BIP-9 but more flexible.
            </p>

            <h3>BIP-34</h3>
            <p>
                The block version was traditionally 1. The BIP suggested that when miners want to support a
                proposal they would increase the block version to signal that to others and specify in the
                coinbase input the block height when the upgrade will be activated given it has enough support.
                The (convention) rules were as follows:
            </p>

            <p>
                To add a new feature a block version number (e.g. 2) would be associated with it as well as
                a block height for activation.
            </p>

            <ul>
                <li>If 750 out of 1000 blocks (510 out of 1000 for testnet) have block version of 2 then reject invalid v2 blocks (if no block height included)</li>
                <li>If 950 out of 1000 blocks (750 out of 1000 for testnet) have block version of 2 then reject all block version 1 blocks</li>
            </ul>

            <p>The BIPs activated with this signaling process were, BIP-32 (v2), BIP-65 (v3) and BIP-66 (v4).</p>

            <h3>BIP-9</h3>
            <p>
                BIP-34 allowed only one upgrade at a time and no easy way to reject a proposal to replace it
                with another. BIP-9 solves these issues with the following (convention) rules:
            </p>

            <ul>
                <li>The remaining 29 bits of the block version field can be used to signal for 29 proposals, potentially in parallel</li>
                <li>A structure is defined with:
                    <ul>
                        <li>name</li>
                        <li>bit, the block version bit used to signal for this change</li>
                        <li>starttime, time (Median Time-Past, BIP-113) when signalling can begin</li>
                        <li>timeout, time (MTP) when change is considered rejected if not activated by then</li>
                    </ul>
                </li>
                <li>Threshold for activation is 95%</li>
                <li>Signalling is based on the whole 2016 blocks of a re-target interval</li>
                <li>If threshold is passed activation occurs one re-target interval later</li>
            </ul>

            <p>
                BIP-9 was used to activate proposal "csv" that contained BIPs 66, 112 and 113 and proposal
                "segwit" that included BIPs 141, 143 and 147.
            </p>

            <Note>
                <p>
                    The Bitcoin community opted to do only soft-fork upgrades to minimize potential disruption to
                    the network. To that end extra precautions and effort is required in the upgrade design and
                    implementation. A notable example is the <em>Segregated Witness</em> or <em>segwit</em>{' '}
                    upgrade. The latter would be easier to implement as a hard-fork but since those are
                    contentious they had to come up with a design that allowed the upgrade to happen as a
                    soft-fork.
                </p>
            </Note>

            <p>
                The segwit upgrade was quite contentious and there was a lot of political agendas and drama
                involved. A good walkthrough was published in{' '}
                <a href="https://bitcoinmagazine.com/articles/long-road-segwit-how-bitcoins-biggest-protocol-upgrade-became-reality" target="_blank" rel="noopener noreferrer">Bitcoin Magazine</a>{' '}
                and a more detailed account of what happened is described in The Blocksize War book by J. Bier.
            </p>

            <h3>BIP-8</h3>
            <p>
                This is the current BIP used for upgrading. It has the following differences from BIP-9:
            </p>
            <ul>
                <li>Uses block height instead of timestamps for signalling; this makes it more predictable</li>
                <li>Threshold for activation is 90%</li>
                <li>Gives the option to reject or enforce the upgrade at the end of the timeout
                    <ul>
                        <li><code>lockontimeout</code> or LOT=False (BIP-9 equivalent behaviour)</li>
                        <li>LOT=True (enforces lock-in)</li>
                    </ul>
                </li>
            </ul>

            <p>BIP-8 was used for the activation of the "taproot" proposal.</p>

            <ChapterNav
                prev={{ path: '/p2p-networking', title: 'P2P Networking' }}
                next={{ path: '/technical-fundamentals', title: 'Technical Fundamentals' }}
            />
        </>
    )
}
