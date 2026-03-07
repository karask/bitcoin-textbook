import CodeBlock from '../components/CodeBlock'
import { Note, Summary } from '../components/Callouts'
import ChapterNav from '../components/ChapterNav'

export default function TechnicalFundamentals() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 4</div>
                <h1>Technical Fundamentals</h1>
            </div>

            <Summary>
                <p>
                    This chapter aims to provide some basic technical computer science background required for
                    later material. It is of particular importance if you want to delve deeper and read the
                    code of the Python{' '}
                    <a href="https://github.com/karask/python-bitcoin-utils" target="_blank" rel="noopener noreferrer">
                        bitcoin-utils
                    </a>{' '}
                    library. It aims to concisely explain some fundamental concepts by providing examples.
                </p>
            </Summary>

            <h2 id="bytes-hex">Bytes, Hex, Endianness and Encodings</h2>

            <p>
                Computers internally use the binary numeral system consisting of only two symbols: 0 and 1.
                For ease of processing, bits are aggregated into bytes. Each byte consists of 8 bits.
                We typically use hexadecimal to represent bytes in a more human-friendly way.
            </p>

            <CodeBlock language="python" caption="Python examples" code={`>>> format(0, '04b')      # converts decimal 0 to binary with 0 padding for 4 bits
'0000'
>>> format(15, '04b')     # same for decimal 15
'1111'
>>> format(15, 'X')       # convert decimal 15 to hex string
'F'
>>> format(0x41, '08b')   # converts hex number 41 to binary
'01000001'
>>> 0x41                  # converts hex number 41 to decimal
65
>>> 0x41 == '41'          # compares hex number 41 with string 41
False
>>> b'41' == '41'         # compares byte literal 41 with string 41
False`} />

            <p>
                One byte can represent up to 2<sup>8</sup>=256 numbers (0-255). The byte ordering is
                important and it is called{' '}
                <a href="https://en.wikipedia.org/wiki/Endianness" target="_blank" rel="noopener noreferrer">endianness</a>.
                Big-endian ordering places the most significant byte first. In little-endian the order is reversed.
            </p>

            <CodeBlock language="python" caption="Python examples" code={`>>> import binascii
>>> format(0x03E8, '016b')           # convert hex number 03E8 to binary digits
'0000001111101000'
>>> binascii.unhexlify('03E8')       # convert hex string 03E8 to binary
b'\\x03\\xe8'
>>> b'\\x03\\xe8'[::-1]                # reverse bytes to change endianness
b'\\xe8\\x03'`} />

            <Note>
                <p>
                    Internally Bitcoin uses little-endian byte order. Most hash function libraries create
                    hashes using big-endian and Bitcoin transmits those in that ordering. However, when hashes
                    are <em>displayed</em> Bitcoin uses little-endian order!
                </p>
            </Note>

            <p>
                To display numbers for human consumption we need character encodings that provide mappings
                between bit sequences and characters. UTF-8 is widely used, where character <code>A</code>{' '}
                is mapped to <code>01000001</code>.
            </p>

            <CodeBlock language="python" caption="Python examples" code={`>>> 'A' == b'A'                      # A character is not a byte
False
>>> b'41' == '41'.encode('utf-8')    # Unicode string literals are stored in binary
True
>>> 'ε'.encode()                     # UTF-8 is a variable length encoding
b'\\xce\\xb5'
>>> binascii.unhexlify('41')         # converts string hex value 41 to binary
b'A'
>>> b'A' == b'\\x41'                  # bytes 0x01 to 0x7f shown as UTF-8 chars
True
>>> b'A'.decode('utf-8')             # convert binary to characters
'A'
>>> binascii.hexlify(b'A')           # convert binary value to hex
b'41'`} />

            <h2 id="hash-functions">Cryptographic Hash Functions</h2>

            <p>
                A cryptographic hash function takes an arbitrary block of data and returns a fixed-size bit
                array, the hash value. Properties:
            </p>

            <ul>
                <li>It is deterministic — same data always returns the same hash</li>
                <li>It is quick to compute</li>
                <li>It is a one-way function — given the hash one cannot derive the original value</li>
                <li>Even a trivial change to the data will change the hash completely</li>
                <li>It is collision resistant — infeasible to find two different inputs with the same hash</li>
            </ul>

            <CodeBlock language="python" caption="Python examples" code={`>>> import hashlib
>>> import binascii
>>> b1 = 'Bitcoin'.encode('utf-8')
>>> h1 = hashlib.sha256(b1).digest()
>>> binascii.hexlify(h1).decode()
'b4056df6691f8dc72e56302ddad345d65fead3ead9299609a826e2344eb63aa4'
>>> b2 = 'bitcoin'.encode('utf-8')   # note: lowercase 'b'
>>> h2 = hashlib.sha256(b2).digest()
>>> binascii.hexlify(h2).decode()
'6b88c087247aa2f07ee1c5956b8e1a9f4c7f892a70e324f1bb3d161e05ca107b'`} />

            <Note>
                <p>
                    Bitcoin uses two hashing functions: SHA-256 and RIPEMD-160 which create a hash value of 256
                    and 160 bits respectively (or 32 and 20 bytes or 64 and 40 hex characters).
                </p>
            </Note>

            <h2 id="asymmetric-crypto">Asymmetric Cryptography</h2>

            <p>
                Asymmetric cryptography uses pairs of keys with a specific mathematical relation — a private
                key and a public key. Between two participants this allows:
            </p>

            <ul>
                <li><strong>Encryption</strong> — Alice can encrypt a message with Bob's public key. Only the corresponding private key can decrypt it.</li>
                <li><strong>Authentication / Digital Signatures</strong> — Alice signs a message with her private key. Anyone can verify the signature using her public key.</li>
                <li><strong>Integrity</strong> — No one can modify a signed message since the signature would be invalidated.</li>
                <li><strong>Non-Repudiation</strong> — Signing cannot be refuted by the author once the message has been sent.</li>
            </ul>

            <Note>
                <p>
                    Bitcoin does not use encryption at all. Digital signatures are used to sign transactions in
                    order to authenticate that you are the owner of the coins you wish to transfer.
                </p>
            </Note>

            <ChapterNav
                prev={{ path: '/forking', title: 'Forking' }}
                next={{ path: '/keys-and-addresses', title: 'Keys and Addresses' }}
            />
        </>
    )
}
