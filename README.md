# Staking DApp

This project is a graphical interface built with React to demonstrate the functionality of a staking smart contract. The smart contract is written in Solidity and allows users to stake tokens, unstake tokens, and for the owner to issue rewards to the stakers.

## Project Description

The main purpose of this project is to provide a graphical representation of how a staking smart contract works. It includes functionalities such as:
- Staking tokens.
- Unstaking tokens.
- Issuing rewards to stakers.

## Prerequisites

To run this project locally, you need the following tools installed:
- Node.js
- npm (Node Package Manager)
- Ganache (for local Ethereum blockchain setup)

You can download Ganache from [here](https://www.trufflesuite.com/ganache).

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/staking-dapp.git
   cd staking-dapp

2. **Install dependencies**
   ```bash
    npm install

3. **Start ganache**
- Open Ganache and start a new workspace. Ensure that it is running on the default port (7545).

4. **Deploy the smart contract**
   ```bash
    npx hardhat run scripts/deploy.js --network ganache

5. **Run the application**
   ```bash
    npm run dev

6. **Open the application**
- Open your browser and navigate to http://localhost:3000 to view the application.

## Usage
The application provides a simple interface to interact with the staking smart contract. Users can:
- Stake tokens.
- Unstake tokens.
- View their staked balance.
- The owner can issue rewards to the stakers.

To issue rewards, the owner needs to run the following command:
   ```bash
    npx hardhat run scripts/issue-token.js
   ```

## Video Demonstration
For a detailed walkthrough of the project, please refer to the following video: [Demo video](https://www.youtube.com/watch?v=R9Y2oXUvLEk)
