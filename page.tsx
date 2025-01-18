"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Wallet, Bitcoin, Menu, X, Github, Twitter } from 'lucide-react';

const navVariants = {
  hidden: { y: -100 },
  visible: { 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const glowAnimation = {
  animate: {
    boxShadow: ["0 0 10px #4ade80", "0 0 20px #4ade80", "0 0 10px #4ade80"],
    transition: {
      duration: 2,
      repeat: Infinity,
    }
  }
};

const scanlineEffect = {
  animate: {
    y: ["0%", "100%"],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Scanline effect */}
      <motion.div 
        variants={scanlineEffect}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent h-[10px] pointer-events-none"
      />

      {/* CRT screen effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_80%)] opacity-50" />

      {/* Navbar */}
      <motion.nav 
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="border-b-2 border-green-400 relative z-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold"
            >
              CC_
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {["Features", "Documentation", "Community", "Launch App"].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ 
                    scale: 1.1,
                    textShadow: "0 0 8px rgb(74, 222, 128)",
                  }}
                  className="cursor-pointer"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-green-400"
            >
              <div className="container mx-auto px-4 py-4">
                {["Features", "Documentation", "Community", "Launch App"].map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    whileHover={{ x: 10 }}
                    className="block py-2"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="border-b-2 border-green-400 relative"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3 
              }}
              className="mb-8"
            >
              <Terminal className="mx-auto w-16 h-16" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter"
            >
              CHAIN_
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                |
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl mb-8 tracking-wide"
            >
              EXECUTE.BUILD.DEPLOY_
            </motion.p>
            <motion.button
              variants={glowAnimation}
              animate="animate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-400 text-black px-8 py-3 rounded-none hover:bg-green-300 transition-colors uppercase tracking-wider"
            >
              &gt; Launch Terminal
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-12 tracking-wider"
        >
          &gt; FEATURES_
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: <Wallet className="w-8 h-8 mb-4" />,
              title: "MULTI-CHAIN_",
              description: "Generate and manage addresses across networks with custom paths."
            },
            {
              icon: <Cpu className="w-8 h-8 mb-4" />,
              title: "AI-POWERED_",
              description: "Build transactions using natural language through our AI agent."
            },
            {
              icon: <Bitcoin className="w-8 h-8 mb-4" />,
              title: "BITCOIN_",
              description: "Create and manage Bitcoin transactions with ease."
            },
            {
              icon: <Terminal className="w-8 h-8 mb-4" />,
              title: "ETHEREUM_",
              description: "Execute smart contracts using simple terminal commands."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 15px rgba(74, 222, 128, 0.3)"
              }}
              className="border-2 border-green-400 p-6 cursor-pointer bg-black"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-green-400/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Terminal Demo */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <div className="bg-black rounded-none p-6 border-2 border-green-400">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TypewriterEffect text="$ init transaction --chain ethereum" />
            <TypewriterEffect text="> Amount: 0.001 ETH" delay={2} />
            <TypewriterEffect text="> Recipient: 0x4b67E6..." delay={3} />
            <TypewriterEffect text="Transaction successful! ✓" delay={4} className="text-green-400" />
          </motion.div>
        </div>
      </motion.div>
 
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t-2 border-green-400 py-8"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p>CHAIN_COMMANDER © 2025</p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                href="#"
                className="hover:text-green-300"
              >
                <Github />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                href="#"
                className="hover:text-green-300"
              >
                <Twitter />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

// Typewriter Effect Component
const TypewriterEffect = ({ text, delay = 0, className = "" }) => {
  const characters = text.split("");
  
  return (
    <p className={`mb-2 ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + index * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </p>
  );
};

export default Home;