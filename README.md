# TOK

TOK is an infrastructure built on the Sui blockchain to turn tokenization into something everyday: from common use cases like token creation and management, staking, vesting, lending, renting, and many more, to markets like DEXs, all the way to novel financial tools like security tokens. The big-picture goal is to build a tokenized stock market.

## Repository structure

The repository is divided into two main modules:

### `tok-packages`

Contains the development of all TOK contracts so far:

- `tok_fees`
- `tok_issuer`
- `tok_vesting`
- `tok_staking`
- `tok_ido` (decentralized launchpad) — *incomplete*

These contract versions are **not final**, they are experimental and will go through adjustments in the short term. They only represent the baseline of the ecosystem, since much bigger things are planned for the future.

### `tok-frontend`

Contains the full design of the platform, from the landing page to the modules representing the TOK packages. These modules are still being implemented:

- `tok_fees` and `tok_staking`: available in a couple of weeks
- `tok_launchpad`: available a couple of weeks after that, while the final version is being built

## TOK Token

A TOK utility token is planned for issuance to raise funding and implement the platform's biggest features, in exchange for the possibility of becoming owners of the project. Therefore, once TOK becomes a security, profits will be distributed to TOK token holders.

## Legal framework and regulatory goal

TOK aims to be regulated under the LEAD Law in El Salvador, with the goal of becoming a regulated token issuer and being able to offer more services within that legal framework.

Obtaining this legal permit is one of the project's central goals: it's what would give TOK the backing to operate as a regulated issuer, and along with the platform's future development, it's the reason funding is needed.

## Deployed contracts

| Contract      | Package ID |
|---------------|------------|
| `tok_fees`    | `0x05029a11fbcfa5d6959a41cce21681a65ecfbb5ee57967e2626272f188c8b653` |
| `tok_issuer`  | `0x88288ba5d35289a4410ec0b93c0aae251724b5eab8df81743c44143c72ccbdd4` |
| `tok_vesting` | `0x2e802e5d290de9ff149e301a4d74be1532472f9fad7c366c96b3d20a2c040de1` |
| `tok_staking` | `0x9c574ca2f0fd43d5c893e911e9f6d37f104a01ff3efd1e14876af195517d3a5f` |

## Requirements

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- [Node.js](https://nodejs.org/)
- npm

## Running the project

### tok-frontend (Next.js)

```bash
cd tok-frontend
npm i
npm run dev
```

### tok-packages (Sui Move)

Go into each package and run the tests, for example:

```bash
cd tok-packages/tok_fees
sui move test
```

Repeat the same step for each package (`tok_issuer`, `tok_vesting`, `tok_staking`, `tok_ido`).