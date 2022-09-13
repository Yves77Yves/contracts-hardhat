const { ethers } = require('hardhat')
const {
  // time,
  loadFixture
} = require('@nomicfoundation/hardhat-network-helpers')
// const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect } = require('chai')
// const { keccak256, toUtf8Bytes, toUtf8String } = require('ethers/lib/utils')
const { constants } = require('@openzeppelin/test-helpers')
const { BigNumber } = require('ethers')

async function testDSponsoTests({
  creationTx,
  DSponsorDeployer,
  ERC721Contract,
  sponsor1, // own token 1
  sponsor2, // own token 2
  sponsee
}) {
  const propKey = 'propKey'
  const propValue = 'value'

  const DSponsorContractFromAddress = creationTx.events.find(
    (e) => e.event === 'NewDSponsor'
  ).args[0]

  const DSponsorContract = await DSponsorDeployer.attach(
    DSponsorContractFromAddress
  )

  expect(await DSponsorContract.getAccessContract()).to.be.equal(
    ERC721Contract.address
  )

  await expect(DSponsorContract.setProperty(propKey, true)).to.be.reverted

  await expect(DSponsorContract.connect(sponsee).setProperty(propKey, true))
    .to.emit(DSponsorContract, 'PropertyUpdate')
    .withArgs(propKey, true)

  await expect(
    DSponsorContract.connect(sponsee).setSponsoData(1, propKey, propValue)
  ).to.be.revertedWithCustomError(DSponsorContract, 'UnallowedSponsorOperation')

  await expect(
    DSponsorContract.connect(sponsor2).setSponsoData(1, propKey, propValue)
  ).to.be.revertedWithCustomError(DSponsorContract, 'UnallowedSponsorOperation')

  await expect(
    DSponsorContract.connect(sponsor1).setSponsoData(1, propKey, propValue)
  )
    .to.emit(DSponsorContract, 'NewSponsoData')
    .withArgs(1, propKey, propValue)
}

describe('DSponsor - Main', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function initFixture() {
    const signers = await ethers.getSigners()

    const [deployer, sponsee, sponsor1, sponsor2, user1] = signers

    const ERC20MockDeployer = await ethers.getContractFactory('ERC20Mock')
    const ERC20Mock = await ERC20MockDeployer.deploy()

    const ERC721MockDeployer = await ethers.getContractFactory('ERC721Mock')
    const ERC721Mock = await ERC721MockDeployer.deploy()

    const PaymentSplitterMockDeployer = await ethers.getContractFactory(
      'PaymentSplitterMock'
    )
    // const PaymentSplitterMock = await PaymentSplitterMockDeployer.deploy([ deployer.address ], [100])

    const DSponsorMainDeployer = await ethers.getContractFactory('DSponsorMain')
    const DSponsorMainContract = await DSponsorMainDeployer.deploy()

    const DSponsorTreasuryDeployer = await ethers.getContractFactory(
      'DSponsorTreasuryFactory'
    )
    const DSponsorTreasury = await DSponsorTreasuryDeployer.deploy()

    const protocolAddress = await DSponsorTreasury.PROTOCOL_ADDRESS_FEE()
    const protocolFee = await DSponsorTreasury.PROTOCOL_PERCENT_FEE()

    const DSponsorDeployer = await ethers.getContractFactory('DSponsor')
    const DSponsorNFTDeployer = await ethers.getContractFactory('DSponsorNFT')

    const ERC20Amount = BigNumber.from('100000')

    let tx
    for (let { address } of signers) {
      tx = await ERC20Mock.mint(address, 10 * ERC20Amount)
      await tx.wait()
    }

    return {
      deployer,
      sponsee,
      sponsor1,
      sponsor2,
      user1,

      ERC20Amount,

      ERC20Mock,
      ERC721Mock,
      PaymentSplitterMockDeployer,

      DSponsorMainContract,

      DSponsorDeployer,
      DSponsorNFTDeployer,

      protocolAddress,
      protocolFee
    }
  }

  it('Creates a valid DSponsoNFT contract', async function () {
    const {
      PaymentSplitterMockDeployer,
      DSponsorNFTDeployer,
      DSponsorMainContract,
      sponsee,
      ERC20Mock,
      ERC20Amount,
      sponsor1,
      sponsor2,
      protocolAddress,
      protocolFee
    } = await loadFixture(initFixture)

    const name = 'name'
    const symbol = 'symbol'
    const maxSupply = 5

    let creationTx = await DSponsorMainContract.createDSponsorNFT(
      name,
      symbol,
      maxSupply,
      sponsee.address
    )

    creationTx = await creationTx.wait()

    const { args } = creationTx.events.find((e) => e.event === 'NewDSponsorNFT')

    const DSponsorNFTAddress = args[0]
    const treasuryAddress = args[2]

    const DSponsorNFTContract = await DSponsorNFTDeployer.attach(
      DSponsorNFTAddress
    )

    expect(await DSponsorNFTContract.getController()).to.be.equal(
      sponsee.address
    )

    await expect(
      DSponsorNFTContract.setPrice(ERC20Mock.address, true, ERC20Amount)
    ).to.be.revertedWithCustomError(
      DSponsorNFTContract,
      'ForbiddenControllerOperation'
    )

    await expect(
      DSponsorNFTContract.connect(sponsee).setPrice(
        ERC20Mock.address,
        true,
        ERC20Amount
      )
    )
      .to.emit(DSponsorNFTContract, 'MintPriceChange')
      .withArgs(ERC20Mock.address, true, ERC20Amount)

    let tx = await ERC20Mock.connect(sponsor1).approve(
      DSponsorNFTContract.address,
      ERC20Amount * 20
    )
    await tx.wait()
    tx = await ERC20Mock.connect(sponsor2).approve(
      DSponsorNFTContract.address,
      ERC20Amount * 20
    )
    await tx.wait()

    await expect(
      DSponsorNFTContract.connect(sponsor1).payAndMint(
        ERC20Mock.address,
        sponsor1.address,
        ''
      )
    )
      .to.emit(DSponsorNFTContract, 'Mint')
      .withArgs(
        ERC20Mock.address,
        ERC20Amount,
        sponsor1.address,
        '',
        sponsor1.address,
        0
      )

    await expect(
      DSponsorNFTContract.connect(sponsor2).payAndMint(
        ERC20Mock.address,
        sponsor2.address,
        ''
      )
    ).to.changeTokenBalances(DSponsorNFTContract, [sponsor2.address], [1])

    await expect(
      DSponsorNFTContract.connect(sponsor2).payAndMint(
        ERC20Mock.address,
        sponsor2.address,
        ''
      )
    ).to.changeTokenBalances(ERC20Mock, [sponsor2.address], [-ERC20Amount])

    const TreasuryContract = await PaymentSplitterMockDeployer.attach(
      treasuryAddress
    )

    // release with sponsor = 0

    /*

    await expect(
      TreasuryContract.connect(sponsee).release(
        //  ERC20Mock.address,
        sponsee.address
      )
    ).to.changeTokenBalances(
      ERC20Mock,
      [treasuryAddress, sponsee],
      [ERC20Amount]
    )
    */

    // releasable protocol
  })

  it('Creates a valid DSponso contract from an ERC721 contract address', async function () {
    const {
      ERC721Mock,
      DSponsorMainContract,
      DSponsorDeployer,
      sponsee,
      sponsor1,
      sponsor2
    } = await loadFixture(initFixture)

    let creationTx = await DSponsorMainContract.createFromContract(
      ERC721Mock.address,
      'rulesURI',
      sponsee.address
    )

    creationTx = await creationTx.wait()

    let tx = await ERC721Mock.connect(sponsor1).mint(1)
    await tx.wait()
    tx = await ERC721Mock.connect(sponsor2).mint(2)
    await tx.wait()

    await testDSponsoTests({
      creationTx,
      DSponsorDeployer,
      ERC721Contract: ERC721Mock,
      sponsor1,
      sponsor2,
      sponsee
    })
  })

  it('Creates valid DSponsoNFT and DSponso contracts', async function () {
    const {
      DSponsorMainContract,
      DSponsorDeployer,
      sponsee,
      sponsor1,
      sponsor2
    } = await loadFixture(initFixture)

    const name = 'name'
    const symbol = 'SYM'
    const rulesURI = 'rules'
    const maxSupply = 5

    let creationTx = await DSponsorMainContract.createWithNewNFT(
      name,
      symbol,
      maxSupply,
      rulesURI,
      sponsee.address
    )
    creationTx = await creationTx.wait()

    /**
     * Get NFT Contract
     *
     * Minting
     *
     * Test
     */

    /*
    await testDSponsoTests({
      creationTx,
      DSponsorDeployer,
      ERC721Contract: DSponsoNFT,
      sponsor1,
      sponsor2,
      sponsee
    })
    */
  })
})
