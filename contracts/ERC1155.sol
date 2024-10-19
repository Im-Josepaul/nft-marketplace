// contracts/ERC1155Token.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC1155Token is ERC1155, Ownable {
    string private baseMetadataURI; //the token metadata URI
    string private name; //the token mame
    uint private id;
    uint256 private tokenPrice = 0 wei; //tokenPrice, 0 by default. only used in mint function, not batch.
    address private contractOwner;
    /*
    constructor is executed when the factory contract calls its own deployERC1155 method. Note the Ownable(msg.sender) setting the deployer of the ERC-1155 as the owner
    */
    constructor(string memory _uri, string memory _name, uint _id,uint256 _price) Ownable(msg.sender) ERC1155(_uri) {
        name = _name;
        id = _id;
        setURI(_uri);
        baseMetadataURI = _uri;
        tokenPrice = _price;
        contractOwner = msg.sender;
    }   

    /*
    creates a mapping of strings to ids (i.e ["one","two"], [1,2] - "one" maps to 1, vice versa.)
    */
    /*
    sets our URI and makes the ERC1155 OpenSea compatible
    */
    function uri(uint256 _tokenid) override public view returns (string memory) {
        return string(
            abi.encodePacked(
                baseMetadataURI,
                Strings.toString(_tokenid),".json"
            )
        );
    }

    function getName() public view returns(string memory) {
        return name;
    }

    function getId() public view returns (uint) {
        return id;
    }

    function getTokenprice() public view returns (uint) {
        return tokenPrice;
    }

    /*
    used to change metadata, only owner access
    */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function transferOwnership(address newOwner) public virtual override onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        contractOwner = newOwner;
    }

    /*
    set a mint fee. only used for mint, not batch.
    */

    /*
    mint(address account, uint _id, uint256 amount)

    account - address to mint the token to
    _id - the ID being minted
    amount - amount of tokens to mint
    */
    function mint(address account, uint _id, uint256 amount) 
        public payable
    {
        _mint(account, _id, amount, "");
    }

    /*
    mintBatch(address to, uint256[] memory _ids, uint256[] memory amounts, bytes memory data)

    to - address to mint the token to
    _ids - the IDs being minted
    amounts - amount of tokens to mint given ID
    bytes - additional field to pass data to function
    */
    function mintBatch(address to, uint256[] memory _ids, uint256[] memory amounts, bytes memory data)
        public
    {
        _mintBatch(to, _ids, amounts, data);
    }
}