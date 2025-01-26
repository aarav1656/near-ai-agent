import TelegramBot from 'node-telegram-bot-api';
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { NetworkId, setupWalletSelector } from "@near-wallet-selector/core";

export class BitteWalletClient {
  private bot: TelegramBot;
  private walletSelector: any;

  constructor(bot: TelegramBot) {
    this.bot = bot;
    this.initializeWallet();
  }

  private async initializeWallet() {
    const bitteWallet = setupBitteWallet({
      walletUrl: process.env.BITTE_WALLET_URL || 'https://wallet.bitte.ai',
      callbackUrl: process.env.BITTE_CALLBACK_URL,
      deprecated: false,
    });

    this.walletSelector = await setupWalletSelector({
      network: process.env.BITTE_WALLET_NETWORK as NetworkId || "testnet" as NetworkId,
      modules: [bitteWallet],
    });
  }

  public async handleWalletCommands(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    if (msg.text?.startsWith('/connect')) {
      const webAppUrl = `${process.env.BITTE_WALLET_URL}/account/new?password=true`;
      
      const opts = {
        reply_markup: {
          inline_keyboard: [[
            {text: "Connect Bitte Wallet", web_app: {url: webAppUrl}}
          ]]
        }
      };

      await this.bot.sendMessage(
        chatId, 
        "Click below to connect your Bitte Wallet:",
        opts
      );
    }

    else if (msg.text?.startsWith('/wallet')) {
      const helpMessage = `
        Available wallet commands:
        /connect - Connect your Bitte Wallet
        /sign <tx_data> - Sign a transaction
        /balance - Check your wallet balance
      `;
      await this.bot.sendMessage(chatId, helpMessage);
    }
  }

  public async handleTransactionSigning(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    
    if (msg.text?.startsWith('/sign')) {
      const txData = msg.text.slice(6); // Remove '/sign ' prefix
      
      if (!txData) {
        await this.bot.sendMessage(chatId, "Please provide transaction data to sign");
        return;
      }

      const signUrl = `${process.env.BITTE_WALLET_URL}/sign-transaction?transactions_data=${encodeURIComponent(txData)}`;
      
      const opts = {
        reply_markup: {
          inline_keyboard: [[
            {text: "Sign Transaction", web_app: {url: signUrl}}
          ]]
        }
      };

      await this.bot.sendMessage(
        chatId,
        "Click below to sign your transaction:",
        opts
      );
    }
  }
} 