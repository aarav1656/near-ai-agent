import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Wallet, Bitcoin } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="border-b-2 border-green-400"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-6xl font-bold mb-6"
            >
              CHAIN COMMANDER
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl mb-8"
            >
              BUILD AND EXECUTE TRANSACTIONS ON BITCOIN & EVM CHAINS
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Terminal className="mx-auto w-16 h-16 mb-8" />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-400 text-black px-8 py-3 rounded hover:bg-green-300 transition-colors"
            >
              Launch App
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <motion.h2 
          variants={fadeIn}
          className="text-4xl font-bold mb-12 text-center"
        >
          FEATURES
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: <Wallet className="w-8 h-8 mb-4" />,
              title: "Multi-Chain Support",
              description: "Generate and manage addresses across Bitcoin and Ethereum networks with custom derivation paths."
            },
            {
              icon: <Cpu className="w-8 h-8 mb-4" />,
              title: "AI-Powered Transactions",
              description: "Build and execute transactions using natural language through our advanced AI agent."
            },
            {
              icon: <Bitcoin className="w-8 h-8 mb-4" />,
              title: "Bitcoin Integration",
              description: "Seamlessly create and manage Bitcoin transactions directly from your NEAR wallet."
            },
            {
              icon: <Terminal className="w-8 h-8 mb-4" />,
              title: "Ethereum Support",
              description: "Execute Ethereum transactions and interact with smart contracts using simple commands."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ scale: 1.02 }}
              className="border-2 border-green-400 p-6 rounded hover:bg-green-400/10 transition-colors"
            >
              {feature.icon}
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-green-400">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono"
          >
            <p className="mb-2">$ generate ethereum transaction</p>
            <p className="text-gray-500 mb-2">> Enter amount: 0.001 ETH</p>
            <p className="text-gray-500 mb-2">> Enter recipient: 4b67E6...</p>
            <p className="text-green-400">Transaction generated successfully!</p>
          </motion.div>
        </div>
      </motion.div>
 
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t-2 border-green-400 py-8"
      >
        <div className="container mx-auto px-4 text-center">
          <p>Built with ❤️ by Aarav and Kamal on NEAR Protocol</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;