# TOK — Comprehensive Tokenization & Financial Infrastructure Ecosytem on Sui

TOK is an enterprise-grade decentralized infrastructure layer built on the high-performance **Sui Network**. Our mission is to transform tokenization from a niche Web3 application into a ubiquitous, everyday economic standard. By abstracting the complexity of smart contract development, TOK enables any individual or enterprise to instantiate, manage, and scale digital or fractional assets without writing a single line of code.

Simultaneously, TOK serves as a foundational developer primitives layer—offering modular, highly optimized, and ready-to-use Move smart contracts that developers can instantly compose into independent projects. 

Moving beyond basic asset creation, the TOK ecosystem expands into advanced financial utilities including secure staking, linear vesting streams, decentralized lending, and fractionalized real estate / Real-World Asset (RWA) tokenization. The ultimate vision of TOK is to bridge traditional capital markets with blockchain efficiency by building a fully regulated, decentralized stock exchange.

---

## 🏛️ Strategic Vision & Legal Framework (El Salvador - Ley LED)

TOK is engineered with compliance at its core. Unlike completely opaque or isolated DeFi protocols, TOK is strategically positioned to leverage **El Salvador’s Digital Asset Issuance Law (Ley de Emisión de Activos Digitales - LEY LED)**. 

### Regulated vs. Decentralized Paradigms
1. **Decentralized Launchpad:** An open, permissionless sandbox where global users can freely deploy and initial-market-test utility tokens using the **TOK Factory** and **TOK IDO** contract suites.
2. **Regulated Launchpad:** A structured, high-tier compliance avenue where **TOK acts as the official registered Digital Asset Issuer**. Under this framework, projects undergo rigorous auditing, verification, and legal anchoring to issue fully compliant, asset-backed tokens (Securities) legal within and across progressive jurisdictions.

### TOK Token Utility & Evolution Roadmap
To secure the necessary funding for capital-intensive regulatory licensing, legal structures, and institutional-grade smart contract audits, TOK will issue its native utility token (**TOK**):
* **Phase 1 (Utility Asset):** Operates as the ecosystem's structural layer—used to settle protocol fees, access premium dashboard analytics, boost staking pools, and bootstrap liquidity.
* **Phase 2 (Security Transformation):** Upon obtaining formal regulatory approvals under El Salvador's regulatory authorities, the TOK utility token will legally transition into a **Security Token**. This shift will enable formal compliance structures to automatically distribute accrued protocol revenues and ecosystem earnings directly back to token holders, establishing true co-ownership.

---

## 📂 Repository Architecture

The codebase is cleanly divided into two specialized architectural boundaries to separate core state-machine logic from client interaction layers:

```text
├── tok-packages/           # Core Move Smart Contracts & Sui Toolchain
│   ├── tok_fees/           # Protocol dynamic fee distribution mechanism
│   ├── tok_issuer/         # Token Factory and supply control module
│   ├── tok_vesting/        # Multi-actor token escrow & linear lock streams
│   ├── tok_staking/        # Decentralized yield & asset lock rewards
│   └── tok_ido/            # Permissionless decentralized launchpad (WIP)
└── tok-frontend/           # Next.js Application & Unified Web Interface
    ├── public/             # Static layout assets and media
    └── src/                # Modular front-end components & RPC hooks
```

### 1. Smart Contract Core (`tok-packages`)
This directory contains the immutable Move packages managing asset registries, distribution locks, and accounting balances. 
> ⚠️ **Development Status Warning:** The smart contracts within this folder represent **experimental, non-final testnet iterations**. They are subjected to short-term optimizations, logical modifications, and security hardening ahead of the production audits. They currently demonstrate the structural baseline of our tokenization flow.

### 2. Unified Interface (`tok-frontend`)
A highly responsive, production-ready interface constructed with Next.js. It delivers an intuitive dashboard map that allows regular non-technical users to access and interact with the Move packages back-end.
* **Production Live:** TOK Factory and TOK Vesting management panels are fully functional and integrated with active RPC handlers.
* **Near-Term Rollout (Next 2 Weeks):** Integration of client interfaces for `tok_fees` configuration and `tok_staking` staking pools.
* **Medium-Term Rollout (Next 4 Weeks):** Full deployment of the `tok_ido` Decentralized Launchpad interface matching final contract optimizations.

---

## 📜 Deployed Smart Contracts & Object Registries

The active experimental instances of TOK modules are deployed on the network. Juries and developers can directly inspect the package code, state objects, and verification structures using the following Package IDs:

| Package / Module Name | Network Deployed Object/Package ID | Functional Responsibility |
| :--- | :--- | :--- |
| 🛠️ **`tok_fees`** | `0x05029a11fbcfa5d6959a41cce21681a65ecfbb5ee57967e2626272f188c8b653` | Handles conditional processing fees, gas optimization rebates, and systemic protocol treasury routing. |
| 🏭 **`tok_issuer`** | `0x88288ba5d35289a4410ec0b93c0aae251724b5eab8df81743c44143c72ccbdd4` | Houses the TOK Token Factory enabling dynamic, no-code initialization, metadata binding, minting, and burning. |
| ⏳ **`tok_vesting`** | `0x2e802e5d290de9ff149e301a4d74be1532472f9fad7c366c96b3d20a2c040de1` | Manages automated token escrows, linear delivery streams, and hard cliff-period configurations for team allocations. |
| 🥩 **`tok_staking`** | `0x9c574ca2f0fd43d5c893e911e9f6d37f104a01ff3efd1e14876af195517d3a5f` | Governs yield aggregation models, epoch-based locks, and calculation rules for staking providers. |

---

## 🚀 Environment Requirements & Local Setup

Follow these procedures to install dependencies, run the application interface locally, and execute the Move validation suite.

### Global Prerequisites
Your system environment must have the following developer toolchains installed:
1. **Node.js Environment:** Version `18.x` or higher with package manager `npm`.
2. **Sui CLI Binaries:** Configured to compile and test Move modules locally. Ensure your CLI matches the current active network configuration.

---

### Running the Client Interface (`tok-frontend`)

1. **Change directory** to the web application folder:
   ```bash
   cd tok-frontend
   ```

2. **Install node dependencies** via npm:
   ```bash
   npm install
   ```

3. **Bootstrap the local development environment**:
   ```bash
   npm run dev
   ```

4. **Verify Application Access:** Open your local browser and navigate to `http://localhost:3000` to interact with the TOK management console.

---

### Compiling and Testing Smart Contracts (`tok-packages`)

Each functional module under the `tok-packages` directory is configured as a standalone Move package. To independently verify logical pathways and evaluate the Move unit tests, change into the target package directory and execute the test command.

#### Testing the Fees Module (`tok_fees`)
```bash
cd tok-packages/tok_fees
sui move test
```

#### Testing the Token Factory Module (`tok_issuer`)
```bash
cd tok-packages/tok_issuer
sui move test
```

#### Testing the Vesting Streams Module (`tok_vesting`)
```bash
cd tok-packages/tok_vesting
sui move test
```

#### Testing the Staking Rewards Module (`tok_staking`)
```bash
cd tok-packages/tok_staking
sui move test
```

---

## 🗺️ Long-Term Ecosystem Roadmap
Beyond the primary foundational core modules presented at the Sui Overflow Hackathon, TOK's architectural roadmap plans the progressive integration of the following specialized verticals:
* **Real Estate & RWA Fractionalization:** Contracts allowing physical assets to be structurally wrapped into on-chain fractional property shares.
* **DeFi Lending & Rental Markets:** Decentralized collateral markets permitting holders to secure loans or rent secondary access/rights over tokenized properties and assets.
* **Decentralized Stock Exchange:** A highly regulated trading environment optimizing settlement liquidity through the convergence of DEX flexibility with full compliant order-book tracking.