import CodeBlock from '../components/CodeBlock'
import { Note, Summary, Exercise, Emphbox } from '../components/Callouts'
import Figure from '../components/Figure'
import ChapterNav from '../components/ChapterNav'

export default function KeysAndAddresses() {
    return (
        <>
            <div className="chapter-header">
                <div className="chapter-number">Chapter 5</div>
                <h1>Keys and Addresses</h1>
            </div>

            <Summary>
                <p>
                    In this chapter we introduce Bitcoin's keys and addresses and describe how they are created
                    and the rationale behind that process. We then go through different wallet types and how
                    these keys can be used in practice.
                </p>
            </Summary>

            <h2 id="private-keys">Private Keys</h2>

            <p>
                Bitcoin uses the{' '}
                <a href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm" target="_blank" rel="noopener noreferrer">Elliptic Curve Digital Signature Algorithm (ECDSA)</a>{' '}
                to create its private-public key pairs. The exact elliptic curve parameters used in Bitcoin
                are defined by{' '}
                <a href="https://en.bitcoin.it/wiki/Secp256k1" target="_blank" rel="noopener noreferrer">secp256k1</a>.
            </p>

            <Note>
                <p>
                    In ECDSA a private key can be used to calculate the corresponding public key, and since a
                    Bitcoin address is calculated from the public key, if you hold a private key securely you
                    effectively have everything.
                </p>
            </Note>

            <p>
                The ECDSA private key in Bitcoin is just a very large random number consisting of 256 bits
                or 32 bytes or 64 hexadecimal digits. Nearly all 256-bit numbers can be valid private keys as
                specified in secp256k1.
            </p>

            <p>
                To display a private key (the bytes) we need to format it appropriately. It could be displayed
                in hex but the most common format used to display a private key is Wallet Import Format (WIF)
                or WIF-compressed (WIFC); both are
                a <a href="https://en.bitcoin.it/wiki/Base58Check_encoding" target="_blank" rel="noopener noreferrer">Base58Check</a>{' '}
                encoding of the ECDSA key;{' '}
                <a href="https://en.wikipedia.org/wiki/Base58" target="_blank" rel="noopener noreferrer">Base58</a>{' '}
                with a version prefix to specify the network and a 32-bit checksum.
            </p>

            <p>
                A WIF-compressed adds an extra byte (0x01) at the end of the ECDSA key before the Base58Check
                encoding. It specifies whether the public key (and by extension addresses) will be compressed
                or not. By default most wallets use WIFC format in order to reduce the size of the blockchain.
            </p>

            <Note>
                <p>
                    The WIFC will be 33 bytes long. The compression is happening when creating the public key
                    which will be 33 bytes instead of 65 bytes. Note that the segregated witness upgrade allows
                    only compressed public keys.
                </p>
            </Note>

            <p>The following is pseudocode of the process that converts the private key to WIF.</p>

            <Emphbox>
                <pre>{`key_bytes = (32 bytes number) [ + 0x01 if compressed ]
network_prefix = (1 byte version number)
data = network_prefix + key_bytes
data_hash = SHA-256( SHA-256( data ) )
checksum = (first 4 bytes of data_hash)
wif = Base58CheckEncode( data + checksum )`}</pre>
            </Emphbox>

            <p>
                Note that all the above functions operate on big-endian bytes. The network prefix specifies the
                Bitcoin network that this private key would be used. The same private key can be of course used
                in both mainnet and testnet or even other compatible cryptocurrencies by using the appropriate
                prefix when generating the WIF. The Base58 WIF prefix depends on the network prefix and
                whether it is compressed or not, as shown in the table below.
            </p>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th colSpan="2">Mainnet</th>
                            <th colSpan="2">Testnet</th>
                        </tr>
                        <tr>
                            <th></th>
                            <th>Network Prefix</th>
                            <th>Base58 Prefix</th>
                            <th>Network Prefix</th>
                            <th>Base58 Prefix</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>WIF</td><td>128 | 0x80</td><td>5</td><td>239 | 0xef</td><td>9</td></tr>
                        <tr><td>WIF-C</td><td>128 | 0x80</td><td>K or L</td><td>239 | 0xef</td><td>c</td></tr>
                    </tbody>
                </table>
            </div>

            <p>
                As an example let us use the following hexadecimal number (it is important to understand that
                a random number with enough entropy is required for your private key to be secure; a number
                representing your date of birth or your name's characters, etc. will be found immediately by
                software and you will lose your funds):
            </p>

            <Emphbox>
                <pre>{`0dde70823a4bb0ca3bd75a2010e8d5dc091185e73d8b4257a981c695a3eba95b`}</pre>
            </Emphbox>

            <p>You can now consult the table below for its compressed version and the corresponding WIF and WIF-C.</p>

            <div className="table-wrapper">
                <table>
                    <tbody>
                        <tr><td>HEX</td><td style={{ fontSize: '0.85em' }}>0dde70823a4bb0ca3bd75a2010e8d5dc091185e73d8b4257a981c695a3eba95b</td></tr>
                        <tr><td>HEX-C</td><td style={{ fontSize: '0.85em' }}>0dde70823a4bb0ca3bd75a2010e8d5dc091185e73d8b4257a981c695a3eba95b<strong>01</strong></td></tr>
                        <tr><td>WIF</td><td>91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p</td></tr>
                        <tr><td>WIF-C</td><td>cN3fHnPVw4h7ZQSRz2HgE3ko69LTaZa5y3JWpFhoXtAke4MiqVQo</td></tr>
                    </tbody>
                </table>
            </div>

            <p>Let's use the bitcoin-utils library to construct the WIF and WIFC.</p>

            <CodeBlock language="python" caption="Example of creating WIF and WIFC using Python" code={`>>> from bitcoinutils.setup import setup
>>> from bitcoinutils.keys import PrivateKey
>>> setup('testnet')                                   # use testnet parameters
'testnet'
>>> secret_exponent = 0x0dde70823a4bb0ca3bd75a2010e8d5dc091185e73d8b4257a981c695a3eba95b
>>> priv = PrivateKey(secret_exponent = secret_exponent)
>>> priv.to_wif(compressed=False)
'91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p'
>>> priv.to_wif(compressed=True)                       # the default
'cN3fHnPVw4h7ZQSRz2HgE3ko69LTaZa5y3JWpFhoXtAke4MiqVQo'`} />

            <p>
                The actual Python implementation of the functionality demonstrated above can be found
                at <a href="https://github.com/karask/python-bitcoin-utils/blob/42875a3fa90d267f2e5e17e017cb28fc8a90c5a8/bitcoinutils/keys.py#L169-L193" target="_blank" rel="noopener noreferrer"><code>to_wif()</code></a>{' '}
                on github. You can also check how we can get to the private key bytes from WIF
                in <a href="https://github.com/karask/python-bitcoin-utils/blob/42875a3fa90d267f2e5e17e017cb28fc8a90c5a8/bitcoinutils/keys.py#L129-L166" target="_blank" rel="noopener noreferrer"><code>_from_wif()</code></a>.
                Feel free to consult the rest of the code and/or the examples in the repository.
            </p>

            <p>
                Another tool that you can use from the command line
                is <a href="https://github.com/libbitcoin/libbitcoin-explorer/wiki/Download-BX" target="_blank" rel="noopener noreferrer">BX</a>.
                It has extensive capabilities including creating WIFs.
            </p>

            <Emphbox>
                <CodeBlock language="bash" code={`$ ./bx base58check-encode --version 239 \\
0dde70823a4bb0ca3bd75a2010e8d5dc091185e73d8b4257a981c695a3eba95b
91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p

$ ./bx base58check-encode --version 239 \\
0dde70823a4bb0ca3bd75a2010e8d5dc091185e73d8b4257a981c695a3eba95b01
cN3fHnPVw4h7ZQSRz2HgE3ko69LTaZa5y3JWpFhoXtAke4MiqVQo`} />
            </Emphbox>


            <h2 id="public-keys">Public Keys</h2>

            <p>
                In ECDSA a public key is generated from the private key. Elliptic curves operate over{' '}
                <a href="https://en.wikipedia.org/wiki/Finite_field" target="_blank" rel="noopener noreferrer">finite fields</a>{' '}
                and thus all points on the curve are limited to integer coordinates; a finite field is
                typically accomplished by applying modulo p, where p is a prime number. The specific curve
                that Bitcoin uses (secp256k1) is y² = x³ + 7 (see figure below). Then the public
                key P is generated by multiplying, using elliptic curve multiplication, the private key k with
                a special constant G called the generator point (this is a special point in the elliptic curve
                that is pre-defined in secp256k1): P = k × G. Elliptic curve multiplication of an integer
                with a point results in another point in the curve, which is the public key.
            </p>

            <Figure
                src="./images/ecdsa-curve.png"
                caption="The secp256k1 ECDSA curve."
                label="fig-ecdsa-curve"
            />

            <p>
                The public key is a point P in the elliptic curve. P = (x,y), where both x and y are 32-byte
                integers. Thus a public key can be expressed with 64 bytes. In Bitcoin, we encode a public key
                by a prefix that specifies some extra information.
            </p>

            <Note>
                <p>
                    Remember that we can represent a public key in two forms, compressed and uncompressed. This
                    is where we can reduce the size of the blockchain by using the compressed form.
                </p>
            </Note>

            <p>
                An encoded uncompressed public key is 65 bytes long since it has the two points (32 bytes
                each) concatenated and a prefix of <code>0x04</code> to specify an uncompressed public key.
            </p>

            <p>
                Since the curve is mirrored in the x axis the y coordinate can only take 2 values for a
                specific x (positive/negative). Thus, an encoded compressed public key is only 33 bytes long
                and has only the x coordinate with a prefix of <code>0x02</code> (when y is positive/even)
                or <code>0x03</code> (when y is negative/odd).
            </p>

            <p>
                Let's use the bitcoin-utils library to construct a private key object from a WIF and use that
                to create a public key object to show its two forms.
            </p>

            <CodeBlock language="python" caption="Python example to generate compressed and uncompressed public keys" code={`>>> from bitcoinutils.setup import setup
>>> from bitcoinutils.keys import PrivateKey, PublicKey
>>> setup('testnet')
'testnet'
>>> priv = PrivateKey.from_wif('91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p')
>>> pub = priv.get_public_key()
>>> pub.to_hex()                # default is compressed form
'02c1acdac799fb0308b4b6475ddf7967676759d31484ab55555482472f3bc7c3e7'
>>> pub.to_hex(compressed=False)
'04c1acdac799fb0308b4b6475ddf7967676759d31484ab55555482472f3bc7c3e7\\
addc4cbba6656a4be4bc6933a6af712b897a543a09c4b899e5f7b943d38108a8'`} />

            <p>
                You can see that the uncompressed public key has the same x coordinate as the compressed one
                plus the y coordinate.
            </p>

            <p>
                To create the PublicKey from the PrivateKey object we make use of the Python ECDSA library as
                can be seen in <a href="https://github.com/karask/python-bitcoin-utils/blob/fb0849f81117943563b17f1870a9607d48ca9653/bitcoinutils/keys.py#L351-L355" target="_blank" rel="noopener noreferrer"><code>get_public_key()</code></a>{' '}
                on github. The PublicKey object holds the x and y coordinates and can convert accordingly. It
                checks if y is even or odd and prefixes it with 0x02 and 0x03 respectively. You can check the
                code of <a href="https://github.com/karask/python-bitcoin-utils/blob/fb0849f81117943563b17f1870a9607d48ca9653/bitcoinutils/keys.py#L453-L469" target="_blank" rel="noopener noreferrer"><code>to_hex()</code></a>{' '}
                on github. It is always recommended to reuse well-tested cryptography libraries than
                implementing your own.
            </p>

            <p>We can get the public keys from the private keys using BX again.</p>

            <Emphbox>
                <CodeBlock language="bash" code={`$ ./bx wif-to-public 91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p
04c1acdac799fb0308b4b6475ddf7967676759d31484ab55555482472f3bc7c3e7\\
addc4cbba6656a4be4bc6933a6af712b897a543a09c4b899e5f7b943d38108a8

$ ./bx wif-to-public cN3fHnPVw4h7ZQSRz2HgE3ko69LTaZa5y3JWpFhoXtAke4MiqVQo
02c1acdac799fb0308b4b6475ddf7967676759d31484ab55555482472f3bc7c3e7`} />
            </Emphbox>


            <h2 id="addresses">Addresses</h2>

            <p>
                Addresses can be shared to anyone who wants to send you money. They are typically generated
                from the public key, consist of a sequence of characters and digits and start with 1 for the
                mainnet and with m or n for testnet (or for segwit addresses bc1 and tb1 for mainnet and
                testnet respectively).
            </p>

            <p>
                An address typically represents the owner of a private/public pair but it can also represent a
                more complex script as we will see in a future chapter.
            </p>

            <p>
                Notice that we do not share the public key as one would expect in public key cryptography but
                rather the address, which is derived from the public key. Some benefits are:
            </p>

            <ul>
                <li>Shorter addresses</li>
                <li>Quantum computer resistance</li>
            </ul>

            <Note>
                <p>
                    Until one spends from an address the public key will never appear on the blockchain and thus
                    to potential attackers and since the address is hashed from the public key not even quantum
                    computers could brute force to get the public key and then the private key. Note, however,
                    that even if that is the case the majority of addresses would be hacked thus destroying trust
                    in (and the value of) the network anyway!
                </p>
            </Note>

            <h3>Legacy Addresses</h3>

            <p>
                An address is really just the hash of the public key, called public key hash (or PKH). That is
                how it is represented on the blockchain. The way we format addresses to display them (starting
                with 1, m/n, etc.) are just for our convenience. The format that we use is the Base58Check
                encoding of the public key hash; Base58 with version prefix to specify the network and a
                32-bit checksum.
            </p>

            <p>
                The following is pseudocode of the process that converts the public key to public key hash and
                then address:
            </p>

            <Emphbox>
                <pre>{`network_prefix = (1 byte version number)
keyHash = RIPEMD-160( SHA-256( publicKey ) )
data = network_prefix + keyHash
dataHash = SHA-256( SHA-256( data ) )
checksum = (first 4 bytes of dataHash)
address = Base58CheckEncode( data + checksum )`}</pre>
            </Emphbox>

            <p>
                Note that all the above functions operate on big-endian bytes. The network prefix specifies the
                Bitcoin network that this address would be used.
            </p>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th colSpan="2">Mainnet</th>
                            <th colSpan="2">Testnet</th>
                        </tr>
                        <tr>
                            <th></th>
                            <th>Network Prefix</th>
                            <th>Base58 Prefix</th>
                            <th>Network Prefix</th>
                            <th>Base58 Prefix</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>P2PKH</td><td>0 | 0x00</td><td>1</td><td>111 | 0x6f</td><td>m or n</td></tr>
                        <tr><td>P2SH</td><td>5 | 0x05</td><td>3</td><td>196 | 0xc4</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>

            <p>
                <code>P2PKH</code> stands for Pay to Public Key Hash and is the typical legacy address.{' '}
                <code>P2SH</code> stands for Pay to Script Hash and is the typical legacy script hash address;
                an address that is protected with an arbitrary script rather than just a private-public key
                pair as in the P2PKH case.
            </p>

            <p>Let's use the bitcoin-utils library to construct some addresses; compressed and uncompressed.</p>

            <CodeBlock language="python" caption="Python example to generate compressed and uncompressed addresses" code={`>>> from bitcoinutils.setup import setup
>>> from bitcoinutils.keys import PrivateKey, PublicKey, P2pkhAddress
>>> setup('testnet')
'testnet'
>>> priv = PrivateKey.from_wif('91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p')
>>> pub = priv.get_public_key()
>>> addr1 = pub.get_address()
>>> addr2 = pub.get_address(compressed=False)
>>> addr1.to_string()
'n42m3hGC52QTChUbXq3QAPVU6nWkG9xuWj'
>>> addr2.to_string()
'n2JjAgC6UqFf8DvsZXhWcyNzm8w8YKj7MQ'`} />

            <Note>
                <p>
                    Since the hash of a compressed public key would be different from the hash of an
                    uncompressed public key we have two distinct legacy addresses.
                </p>
            </Note>

            <p>
                The actual Python implementation of converting a public key hash (the application of SHA256 and
                then RIPEMD160, also called HASH160) can be found
                at <a href="https://github.com/karask/python-bitcoin-utils/blob/52b7d906f2db8ec4ed4945a04b7e4da2d1db369c/bitcoinutils/keys.py#L589-L597" target="_blank" rel="noopener noreferrer"><code>_to_hash160()</code></a>{' '}
                on github. For code to convert from public key hash to address
                consult <a href="https://github.com/karask/python-bitcoin-utils/blob/52b7d906f2db8ec4ed4945a04b7e4da2d1db369c/bitcoinutils/keys.py#L802-L824" target="_blank" rel="noopener noreferrer"><code>to_string()</code></a>.
                Feel free to consult the rest of the code and/or the examples in the repository for segwit
                address creation, etc.
            </p>

            <h3>Native Segregated Witness Addresses</h3>

            <p>
                Segregated Witness (segwit) is a consensus change that was activated in August 2017 and
                introduces an update on how transactions are constructed. It introduces two new transaction
                types, Pay-to-Witness-Public-Key-Hash (P2WPKH) and Pay-to-Witness-Script-Hash (P2WSH). These
                new transaction types are going to be explained in the Scripting 2 chapter.
            </p>

            <p>
                Native segwit addresses use a different format to display the public key hash
                called <a href="https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki" target="_blank" rel="noopener noreferrer">Bech32 encoding</a>{' '}
                (instead of Base58check).
            </p>

            <p>
                The network prefix specifies the Bitcoin network that this address would be used. Specifically,
                mainnet addresses start with <code>bc1</code>, testnet with <code>tb1</code> and regtest
                (legacy addresses use the same prefix as testnet) with <code>bcrt1</code>. The size of the
                address differentiates between public key hashes and script hashes; P2WPKH are 20 bytes long
                and P2WSH are 32 bytes long.
            </p>

            <p>Let's use the bitcoin-utils library to construct a segwit address.</p>

            <CodeBlock language="python" caption="Example of displaying a segwit address from a public key using Python" code={`>>> from bitcoinutils.setup import setup
>>> from bitcoinutils.keys import PrivateKey, PublicKey, P2wpkhAddress
>>> setup('testnet')
'testnet'
>>> priv = PrivateKey.from_wif('91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p')
>>> pub = priv.get_public_key()
>>> addr = pub.get_segwit_address()
>>> addr.to_string()
'tb1q7m6ak6k050sxzxjjekhey73k0f3rqnxsqa08k2'`} />

            <h3>Nested Segregated Witness Addresses</h3>

            <p>
                When segwit was introduced a lot of wallets did not support the new bech32 addresses, so
                users could not use them to send funds to segwit addresses. To remedy that, nested segwit
                addresses could be used.
            </p>

            <p>
                Effectively you could nest or wrap a segwit address into a P2SH address. As already mentioned
                P2SH addresses can be created from arbitrary scripts and thus could also include a witness
                script. P2SH and segwit will be explained in more detail in the Scripting chapters.
            </p>

            <Note>
                <p>
                    After the segwit upgrade one needs to choose the type of address to create (e.g. when
                    using <code>getnewaddress</code>). The supported types
                    were <code>legacy</code>, <code>p2sh-segwit</code> and <code>bech32</code>. The default,
                    starting from version 0.16.0, was nested segwit addresses (<code>p2sh-segwit</code>) and
                    from version 0.19 onwards the default is segwit addresses (<code>bech32</code>). The
                    default can be changed in the configuration using <code>addresstype</code>.
                </p>
            </Note>

            <h3>Vanity Addresses</h3>

            <p>
                These are normal addresses that contain a specific string. They are calculated randomly by
                creating random private keys and then checking if the corresponding address starts with that
                string, e.g. <code>1KK</code>.
            </p>

            <CodeBlock language="python" caption="Example of creating a vanity address using Python" code={`import random
from bitcoinutils.setup import setup
from bitcoinutils.keys import PrivateKey

setup('mainnet')

vanity_string = '1KK'
found = False
attempts = 0

while(not found):
    p = PrivateKey(secret_exponent = random.getrandbits(256))
    a = p.get_public_key().get_address()
    attempts += 1
    if(a.to_string().startswith(vanity_string)):
        found = True

print("Attempts: {}".format(attempts))
print("Address: {}".format(a.to_string()))
print("Secret Key: {}".format(p.to_wif()))`} />

            <p>
                You will notice that it takes some time even for a short string. Legacy addresses always start
                with 1 so we can disregard that. Since addresses use base58 each character will take an
                average of 58 attempts to be found. The next character an additional 58 attempts (thus
                58×58). We can generalize with 58<sup>n</sup> where n is the number of characters the vanity
                address should start with.
            </p>

            <p>
                There are efficient implementations for calculating vanity addresses in C, Go, Rust or other
                compiled system languages that will calculate much faster than our simple example above, but
                still to create a vanity address that starts with <code>1Kostas</code> will require
                38,068,692,544 attempts (58<sup>6</sup>). That will take considerable time regardless of the
                efficiency of the program or the hardware used.
            </p>

            <p>
                In practice, these large vanity addresses are created via <em>vanity address pools</em>. Such
                pools have specialized hardware (i.e. mining hardware) that can create vanity addresses fast,
                albeit for a fee. However, how can they send you your private key that corresponds to the
                vanity address without them knowing it?
            </p>

            <h4>Vanity Address Pools</h4>

            <p>
                Vanity address pools take advantage of an elliptic curve arithmetics property in which the
                public key of the sum of two public keys corresponds to the private key of the sum of the
                corresponding private keys. For example consider Alice having the key pair a-A and Bob the
                key pair b-B, then:
            </p>

            <Emphbox>
                <pre>{`A+B will produce the public key of the a+b private key.`}</pre>
            </Emphbox>

            <p>
                Consider that Alice wants to use a pool operated by Bob to get a vanity address. The figure
                below illustrates the process to securely get to the private key that corresponds to the
                vanity address.
            </p>

            <Figure
                src="./images/vanity-address-pools.png"
                caption="Example of how a vanity address pool securely shares the private key to a user."
                label="fig-vanity-address-pools"
            />

            <ul>
                <li>First Alice creates a key pair and sends the public key <code>A</code> to Bob.</li>
                <li>Bob creates a key pair and adds the new public key <code>B1</code> to Alice's key. Then uses the resulting public key to generate an address. If this address does not match the vanity string required by Alice, it repeats the process by creating another key pair, and so on. When a match is found the respective private key, e.g. <code>b9</code>, is send to Alice.</li>
                <li>Now Alice, and only Alice, can construct a private key that corresponds to the vanity address by adding it to her private key.</li>
            </ul>


            <h2 id="wallets">Wallets</h2>

            <p>
                A wallet is software that allows us to manage the private and public keys as well as our
                Bitcoin addresses. They usually have functionality to send bitcoins, check balances, create
                contact lists and other. Usually a key (i.e. address) is used only once. Depending on how the
                private keys are handled there are two types of wallets:
            </p>

            <dl>
                <dt>Non-deterministic</dt>
                <dd>All the private keys on the wallet are just randomly generated. Several private keys are pre-generated and new keys are created if needed. If you backup your wallet and then create new keys, you will need to backup your wallet again.</dd>
                <dt>Deterministic</dt>
                <dd>A seed is used to create a master private key, which can be used to create all other private keys (thus public keys and addresses as well). If you backup your seed you are safe no matter how many keys you use since all can be generated from the seed.</dd>
            </dl>

            <p>
                Nowadays, most wallets are <em>Hierarchical Deterministic (HD)</em> since they offer more
                flexibility, easier backups and enhanced security in certain use cases. HD wallets are
                described in detail in <em>Bitcoin Improvement Proposals (BIPs)</em>{' '}
                <a href="https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki" target="_blank" rel="noopener noreferrer">32</a>,{' '}
                <a href="https://github.com/bitcoin/bips/blob/master/bip-0043.mediawiki" target="_blank" rel="noopener noreferrer">43</a>{' '}
                and{' '}
                <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki" target="_blank" rel="noopener noreferrer">44</a>.
            </p>

            <h2 id="more-examples">More Examples</h2>

            <p>
                This section will provide more examples of how to create and use keys and addresses using
                the <code>bitcoin-utils</code> Python library.
            </p>

            <h3>Create a P2SH-P2WPKH address</h3>

            <p>
                In this example we will create and display a P2SH address that wraps a P2WPKH script. For
                more details on what P2SH and P2WPKH are please refer to the Scripting chapters.
            </p>

            <CodeBlock language="python" code={`>>> from bitcoinutils.setup import setup
>>> from bitcoinutils.keys import PrivateKey, P2shAddress
>>> setup('testnet')
'testnet'
>>> native_p2wpkh = PrivateKey.from_wif('cTmyBsxMQ3vyh4J3jCKYn2A'\\
...         'u7AhTKvqeYuxxkinsg6Rz3BBPrYKK').get_public_key().get_segwit_address()
>>> print("P2WPKH:", native_p2wpkh.to_string())
P2WPKH: tb1qsd4ax84vhem5hxgxus2u232nw9ylgftkz0szf2
>>> nested_p2wpkh = P2shAddress.from_script(native_p2wpkh.to_script_pub_key())
>>> print("P2SH(P2WPKH):", nested_p2wpkh.to_string())
P2SH(P2WPKH): 2N8Z5t3GyPW1hSAEJZqQ1GUkZ9ofoGhgKPf`} />

            <h3>Sign message with private key and verify</h3>

            <p>
                We can use a private key to sign a message. In asymmetric cryptography, the recipient can then
                use the corresponding public key to verify that the message was not tampered with.
            </p>

            <CodeBlock language="python" caption="Use public key to sign a message and then verify" code={`>>> from bitcoinutils.setup import setup
>>> from bitcoinutils.keys import P2pkhAddress, PrivateKey, PublicKey
>>> setup('testnet')
'testnet'
>>> priv = PrivateKey.from_wif('91h2ReUJRwJhTNd828zhc8RRVMU4krX9q3LNi4nVfiVwkMPfA9p')
>>> address = priv.get_public_key().get_address()
>>> message = "The test!"
>>> signature = priv.sign_message(message)
>>> print("The signature is:", signature)
The signature is: INzSwXNYNUkPFImslSFDzvqoib3ZdODcaBSZHvx5e4z1wc64cF1dVMZbDFtZxYBlD\\
L/dsjK2iBD5qAf7VcmSdQo=
>>> if PublicKey.verify_message(address.to_string(), signature, message):
...     print("The signature is valid!")
... else:
...     print("The signature is NOT valid!")
...
The signature is valid!`} />

            <Note>
                <p>
                    We verify using the address instead of the public key. In ECDSA cryptography the public key
                    can be reconstructed given the signature and the public key hash (or address).
                </p>
            </Note>

            <h2 id="exercises">Exercises</h2>

            <Exercise number={1}>
                <p>Describe possible outcomes of mistyping a Bitcoin address when trying to send some bitcoins.</p>
            </Exercise>
            <Exercise number={2}>
                <p>Use a <em>vanity generator</em>, like <a href="https://github.com/samr7/vanitygen" target="_blank" rel="noopener noreferrer">vanitygen</a>, to create some addresses.</p>
            </Exercise>
            <Exercise number={3}>
                <p>Use Python and the <code>bitcoin-utils</code> library to create a simple vanity generator.</p>
            </Exercise>
            <Exercise number={4}>
                <p>Write a function that creates a Bitcoin address given a public key. The only Python libraries that you are allowed to use are <code>hashlib</code> for the hashing algorithms and <code>binascii</code> to convert between hexadecimal and bytes.</p>
            </Exercise>
            <Exercise number={5}>
                <p>Create and display a P2SH address that contains a P2PK script using any random private key.</p>
            </Exercise>

            <ChapterNav
                prev={{ path: '/technical-fundamentals', title: 'Technical Fundamentals' }}
                next={{ path: '/scripting-1', title: 'Scripting 1' }}
            />
        </>
    )
}
