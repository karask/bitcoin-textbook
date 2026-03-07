import ChapterNav from '../components/ChapterNav'

export default function Preface() {
    return (
        <>
            <div className="chapter-header">
                <h1>Preface</h1>
            </div>

            <p>
                I started teaching Bitcoin programming in 2016. Every year I was trying to improve and update
                my material to keep it as relevant as possible. Luckily, Bitcoin progresses at a steady pace
                while always keeping backwards compatibility. This is convenient because existing material
                will always be valid even though better alternatives might be introduced in the future.
            </p>

            <p>
                To understand the material better and to improve the material in my courses I started an open
                source Python library, called{' '}
                <a href="https://github.com/karask/python-bitcoin-utils" target="_blank" rel="noopener noreferrer">
                    bitcoin-utils
                </a>. The library was created for educational purposes and not for computational efficiency
                and that might be evident in certain parts of the implementation. Before starting this library
                I had investigated several other well-known Python libraries but I did not find an appropriate
                one for teaching. Some were too low-level with limited documentation while others were
                abstracting concepts that I deemed important for students to understand. The book contains a
                lot of examples using this library for demonstration.
            </p>

            <p>
                Throughout the years I have prepared a lot of material based on my early code experiments,
                the bitcoin-utils library and several online resources, especially the{' '}
                <a href="https://bitcoin.stackexchange.com/" target="_blank" rel="noopener noreferrer">
                    Bitcoin Stack Exchange
                </a>{' '}
                and the{' '}
                <a href="https://github.com/bitcoinbook/bitcoinbook" target="_blank" rel="noopener noreferrer">
                    Bitcoin Book
                </a>{' '}
                by A. Antonopoulos. While I try to always credit the initial sources that I have consulted
                over the years it is possible that I have missed some. Please let me know and I will update
                accordingly.
            </p>

            <p>
                This book is not about introducing what{' '}
                <a href="https://github.com/karask/satoshi-paper" target="_blank" rel="noopener noreferrer">
                    Bitcoin
                </a>{' '}
                is. The readers are expected to have some programming knowledge, be comfortable with their
                own operating system as well as have some basic understanding of what Bitcoin is, its utility,
                what addresses and private keys are as well as have some experience using wallets and sending
                bitcoins. When we refer to the coins we will use <em>bitcoin(s)</em> (lowercase 'b')
                and when we refer to the protocol or the network we will use <em>Bitcoin</em> (uppercase 'B').
                However, the first chapters do give a quick summary of Bitcoin and how it works to make sure
                that the fundamentals are covered.
            </p>

            <p>
                This book is about teaching Bitcoin programming; to help people delve deeper, and in
                particular learn how to <em>talk</em> to the Bitcoin network programmatically. The Bitcoin
                library is relatively easy to navigate through, so you can go even deeper when required.
                There is an emphasis on providing practical examples which, I believe, helps understanding.
            </p>

            <p>
                I have been using a Linux-based machine and thus most command-line examples are from{' '}
                <code>bash</code> shell. However, people comfortable with other Operating Systems should
                have no issues to adjust as needed.
            </p>

            <ChapterNav
                next={{ path: '/how-bitcoin-works', title: 'How Bitcoin Works' }}
            />
        </>
    )
}
