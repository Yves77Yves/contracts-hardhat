# dSponsor contracts

Build a community-owned ad inventory with dSponsor.
As a media or a creator, set up your sponsorships tight to NFTs.

## Features

### DSponsor.sol

Grants each NFT token owner a right to advertise. Compatible with any ERC721 contract.

- Sponsee can specify any set of sponsoring properties, according its off-chain implementation. Could be an audio url, a website link, a logo, ...
- Sponsors can submit data for provided sponsoring properties only
- Sponsee validate (or not) submitted data
- Sponsor can transfer a token to another address, new owner will be the only one able to set sponsoring data linked to the `tokenId`

### DSponsorNFT.sol

Although any ERC721 compliant contract is compatible with `DSponsor` contract, a sponsee may create upwind a `DSponsorNFT` contract, an ERC721 contract with ERC20 pricing and ERC2981 royalties implementations.

- Parameter any native value (ETH amount on Ethereum, MATIC amount on Polygon) as minting price
- Parameter any ERC20 token amount as minting price
- Enable and disable a ERC20 contract or native transactions at any time
- Maximum supply limit built-in
- Opensea optimizations on Polygon : gasless transactions, ...
- Editable royalty fraction (secondary sales fee)

Notes :

- Anyone can mint if payment requirements are met
- 2% protocol fee on revenues
- Need to manually withdraw funds from minting and secondary sales

### DSponsorFactory.sol

Use this contract to create `DSponsor` and `DSponsorNFT`

- `createDSponsorNFT` to create a `DSponsorNFT` contract
- `createFromContract` to create a `DSponsor` contract from existing ERC721 compliant contract
- `createWithNewNFT` to create a `DSponsor` and a `DSponsorNFT` linked together

## Development

_Install dependencies first with `npm i` command_

### Run tests

```shell
npm run test
```

### Check contracts sizes

The maximum size of a contract is restricted to 24 KB by EIP 170. Run this command to check contracts sizes :

```shell
npm run sizes
```

### Security check with Slither

Slither runs a suite of vulnerability detectors, prints visual information about contract details.

1. Install Slither

```shell
pip3 install slither-analyzer
```

See alternatives to install Slither on the [GitHub repo](https://github.com/crytic/slither)

2. Run Slither

```shell
npm run analyze
```

### Deploy

```shell
npm run deploy
```
