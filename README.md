# A Tauri-based Ethereum Wallet

Ethereum wallet application developed using Tauri, a framework for building desktop applications with web frontends. It leverages the power of Rust for its backend operations and TypeScript with Next.js for its frontend.

## Features

- Ethereum wallet creation and management
- Secure encryption and decryption of mnemonic phrases
- Real-time tracking of Ethereum network's block number
- Transaction signing and sending capabilities

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- Node.js (v18.19.0 or later): [Download Node.js](https://nodejs.org/en/download/)
- Rust (v1.74.1 or later): [Install Rust](https://www.rust-lang.org/tools/install)
- Yarn package manager: [Install Yarn](https://yarnpkg.com/getting-started/install)

## Installation and Setup

1. **Clone the Repository:**
   Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/joaquinsoza/tauri-wallet
   ```

2. **Install Dependencies:**
   Navigate to the cloned repository's directory and install the required dependencies:

   ```bash
   cd tauri-wallet
   yarn
   ```

3. **Environment Configuration:**
   There are env examples in the root directory, you will need to add your infura key to them.

   ```bash
   cp .env.example .env && cp .env.local.example .env.local
   ```

   And replace `<INFURA_KEY>` with your [Infura](https://app.infura.io/) key
   This key is used to connect to the Ethereum(Goerli) network.

## Running the Application in Development Mode

To start the application in development mode, use the following command:

```bash
yarn tauri dev
```

This will launch the Wallet application with hot-reload enabled, allowing you to see real-time changes as you develop.

---

Note: The wallet is only working in Goerli network. to use in other networks you would need to manually change the chain_id and rpc urls in the files needed
