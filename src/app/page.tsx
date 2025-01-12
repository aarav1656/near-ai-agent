import React from 'react';
import { Terminal, Cpu, Wallet, Bitcoin } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
     
      <div className="border-b-2 border-green-400">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 animate-pulse"></h1>
            <p className="text-xl mb-8">BUILD AND EXECUTE TRANSACTIONS ON BITCOIN & EVM CHAINS</p>
            <Terminal className="mx-auto w-16 h-16 mb-8" />
            <button className="bg-green-400 text-black px-8 py-3 rounded hover:bg-green-300 transition-colors">
              Launch App
            </button>
          </div>
        </div>
      </div>

      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">FEATURES</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border-2 border-green-400 p-6 rounded hover:bg-green-400/10 transition-colors">
            <Wallet className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-4">Multi-Chain Support</h3>
            <p>Generate and manage addresses across Bitcoin and Ethereum networks with custom derivation paths.</p>
          </div>
          
          <div className="border-2 border-green-400 p-6 rounded hover:bg-green-400/10 transition-colors">
            <Cpu className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-4">AI-Powered Transactions</h3>
            <p>Build and execute transactions using natural language through our advanced AI agent.</p>
          </div>
          
          <div className="border-2 border-green-400 p-6 rounded hover:bg-green-400/10 transition-colors">
            <Bitcoin className="w-8 h-8 mb-4" />
            <h3 className="text-xl font-bold mb-4">Bitcoin Integration</h3>
            <p>Seamlessly create and manage Bitcoin transactions directly from your NEAR wallet.</p>
          </div>
          
          <div className="border-2 border-green-400 p-6 rounded hover:bg-green-400/10 transition-colors">
            <h2>Ethereum</h2>
            <h3 className="text-xl font-bold mb-4">Ethereum Support</h3>
            <p>Execute Ethereum transactions and interact with smart contracts using simple commands.</p>
          </div>
        </div>
      </div>

      
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-green-400">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="font-mono">
            <p className="mb-2">$ generate ethereum transaction</p>
            <p className="text-gray-500 mb-2">> Enter amount: 0.001 ETH</p>
            <p className="text-gray-500 mb-2">> Enter recipient: 4b67E6...</p>
            <p className="text-green-400">Transaction generated successfully!</p>
          </div>
        </div>
      </div>
 
      <footer className="border-t-2 border-green-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>Built with ❤️ by Aarav and Kamal on NEAR Protocol</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;