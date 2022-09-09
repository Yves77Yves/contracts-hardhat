const {
  time,
  loadFixture
} = require('@nomicfoundation/hardhat-network-helpers')
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs')
const { expect } = require('chai')
const { keccak256, toUtf8Bytes, toUtf8String } = require('ethers/lib/utils')

describe('DSponsorNFT', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function initFixture() {
    const [deployer, sponsee, sponsor1, sponsor2, user1, user2] =
      await ethers.getSigners()

    const name = 'DSponsorNFT-test'
    const symbol = 'DNFTTEST'
    const baseURI = 'https://baseuri.fr/'
    const roleURI = 'https://roleuri.fr/'
    const maxSupply = 5
    const properties = ['SQUARE_IMG', 'URL']
    const royaltyAddress = '0x64E8f7C2B4fd33f5E8470F3C6Df04974F90fc2cA'
    const royaltyFraction = 50 // 0.5% fee
    /*
    const DSponsorNFTDeployer = await ethers.getContractFactory('DSponsorNFT')
    const DSponsorNFT = await DSponsorNFTDeployer.deploy(
      name,
      symbol,
      baseURI,
      roleURI,
      maxSupply,
      sponsee.address,
      properties,
      royaltyAddress,
      royaltyFraction
    )
*/
    return {
      deployer,
      sponsee,
      sponsor1,
      sponsor2,
      user1,
      user2,

      name,
      symbol,
      baseURI,
      roleURI,
      maxSupply,
      properties,
      royaltyAddress,
      royaltyFraction

      //  DSponsorNFT
    }
  }

  describe('Deployment', async function () {
    it('Should support ERC2981 and ERC721 interfaces', async function () {
      const { DSponsorNFT } = await loadFixture(initFixture)

      /*

      const supportsDummy = await DSponsorNFT.supportsInterface('0x80ac58cf')
      const supportsERC1555 = await DSponsorNFT.supportsInterface('0x4e2312e0') // interfaceID == 0x4e2312e0 -  ERC-1155 `ERC1155TokenReceiver` support (i.e. `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")) ^ bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`).
      const supportsERC165 = await DSponsorNFT.supportsInterface('0x01ffc9a7')
      const supportsERC20 = await DSponsorNFT.supportsInterface('0x36372b07')
      const supportsERC2981 = await DSponsorNFT.supportsInterface('0x2a55205a')
      const supportsERC721 = await DSponsorNFT.supportsInterface('0x80ac58cd')
      const supportsERC721Enumerable = await DSponsorNFT.supportsInterface(
        '0x780e9d63'
      )
      const supportsERC721Metadata = await DSponsorNFT.supportsInterface(
        '0x5b5e139f'
      )

      expect(supportsDummy).to.equal(false)
      expect(supportsERC1555).to.equal(false)
      expect(supportsERC165).to.equal(true)
      expect(supportsERC20).to.equal(false)
      expect(supportsERC2981).to.equal(true)
      expect(supportsERC721).to.equal(true)
      expect(supportsERC721Enumerable).to.equal(false)
      expect(supportsERC721Metadata).to.equal(true)
      */
    })
  })

  describe('NFT Minting', async function () {
    it('Mint function should revert if number of tokens exceed MAX_SUPPLY value', async function () {})
  })
})

/*  
  
          await expect(...).to.changeEtherBalances(
            [owner, lock],
            [lockedAmount, -lockedAmount]
   */
