import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Preface from './pages/Preface'
import HowBitcoinWorks from './pages/HowBitcoinWorks'
import P2PNetworking from './pages/P2PNetworking'
import Forking from './pages/Forking'
import TechnicalFundamentals from './pages/TechnicalFundamentals'
import KeysAndAddresses from './pages/KeysAndAddresses'
import Scripting1 from './pages/Scripting1'
import Scripting2 from './pages/Scripting2'
import AdvancedTopics from './pages/AdvancedTopics'


export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Preface />} />
                <Route path="/how-bitcoin-works" element={<HowBitcoinWorks />} />
                <Route path="/p2p-networking" element={<P2PNetworking />} />
                <Route path="/forking" element={<Forking />} />
                <Route path="/technical-fundamentals" element={<TechnicalFundamentals />} />
                <Route path="/keys-and-addresses" element={<KeysAndAddresses />} />
                <Route path="/scripting-1" element={<Scripting1 />} />
                <Route path="/scripting-2" element={<Scripting2 />} />
                <Route path="/advanced-topics" element={<AdvancedTopics />} />
            </Routes>
        </Layout>
    )
}
