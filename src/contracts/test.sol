pragma solidity ^0.5.0;

contract test {
  string public a;
  string public b;
  uint256 public c;
  constructor(string memory _a, string memory _b, uint256 _c) public {
    a = _a;
    b = _b;
    c = _c;
  }
}
