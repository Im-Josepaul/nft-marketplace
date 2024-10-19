// contracts/FactoryERC1155.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC1155.sol";

contract Marketplace {

    ERC1155Token[] public tokens; //an array that contains different ERC1155 tokens deployed
    mapping(uint256 => address) public indexToContract; //index to contract address mapping
    mapping(uint256 => address) public indexToOwner; //index to ERC1155 owner address
    mapping (uint => uint) public idToIndex; //id to index of tokens array

    event ERC1155Deployed(address owner, address tokenContract); //emitted when ERC1155 token is deployed
    event ERC1155Minted(address owner, address tokenContract, uint amount); //emmited when ERC1155 token is minted

    /*
    deployERC1155 - deploys a ERC1155 token with given parameters - returns deployed address

    _contractName - name of our ERC1155 token
    _uri - URI resolving to our hosted metadata
    _ids - IDs the ERC1155 token should contain
    _names - Names each ID should map to. Case-sensitive.
    */
    function deployERC1155(string memory _uri, uint _id, string memory _name, uint256 _price, address _owner) public {
        ERC1155Token t = new ERC1155Token(_uri, _name, _id,_price);
        tokens.push(t);
        indexToContract[tokens.length - 1] = address(t);
        indexToOwner[tokens.length - 1] = _owner;
        idToIndex[_id] = tokens.length-1;
        emit ERC1155Deployed(msg.sender,address(t));
    }

    /*mint(a
    mintERC1155 - mints a ERC1155 token with given parameters

    _index - index position in our tokens array - represents which ERC1155 you want to interact with
    _name - Case-sensitive. Name of the token (this maps to the ID you created when deploying the token)
    _amount - amount of tokens you wish to mint
    */
    function mintERC1155(uint _index, uint256 amount) public {
        uint id = getIdfromtoken(_index);
        tokens[_index].mint(indexToOwner[_index], id, amount);
        emit ERC1155Minted(tokens[_index].owner(), address(tokens[_index]), amount);
    }

    /*
    Helper functions below retrieve contract data given an ID or name and index in the tokens array.
    */
    function getCountERC1155byIndex(uint256 _index, uint256 _id) public view returns (uint amount) {
        return tokens[_index].balanceOf(indexToOwner[_index], _id);
    }

    function getCountERC1155byName(uint256 _index) public view returns (uint amount) {
        uint id = getIdfromtoken(_index);
        return tokens[_index].balanceOf(indexToOwner[_index], id);
    }

    function getIdfromtoken(uint _index) public view returns (uint) {
        return tokens[_index].getId();
    }

    function getNamefromtoken(uint _index) public view returns (string memory) {
        return tokens[_index].getName();
    }

    function getIndexById(uint _id) public view returns (uint256) {
        return idToIndex[_id];
    }    

    function getERC1155byIndexAndId(uint _index, uint _id)
        public
        view
        returns (
            address _contract,
            address _owner,
            string memory _uri,
            uint supply
        )
    {
        ERC1155Token token = tokens[_index];
        return (address(token), token.owner(), token.uri(_id), token.balanceOf(indexToOwner[_index], _id));
    }

    // Add this function to your Marketplace contract
    function buyNFT(uint _index, uint _amount, address payable _buyerAddress) public payable {
        // Ensure the caller sent enough ETH
        require(msg.value >= _amount * 1 ether, "Insufficient funds");

        ERC1155Token token = tokens[_index];
        address deployerAddress = indexToOwner[_index];

        uint tokenId = getIdfromtoken(_index);
        
        // Transfer the token
        token.safeTransferFrom(deployerAddress, _buyerAddress,tokenId, _amount, "");

        // Send the payment to the deployer
        (bool success, ) = deployerAddress.call{value: msg.value}("");
        require(success, "Failed to send Ether");
    }
}