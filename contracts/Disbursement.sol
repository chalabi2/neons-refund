// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Disbursement {
    address public owner;
    address[] public recipients;
    uint256[] public amounts;

    constructor(address[] memory _recipients, uint256[] memory _amounts) {
        require(_recipients.length == _amounts.length, "Recipients and amounts arrays must have the same length");

        owner = msg.sender;
        recipients = _recipients;
        amounts = _amounts;
    }

    function disburse() external payable {
        require(msg.sender == owner, "Only the contract owner can disburse tokens");
        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }
        require(msg.value >= total, "Sent value less than the total disbursement amount");

        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "Transfer failed");
        }
    }
}
