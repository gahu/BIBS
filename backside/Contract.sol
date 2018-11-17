pragma solidity ^0.4.25;

contract AccInfo{
   address Creator;

    modifier onlyCreator() {
        require(msg.sender == Creator);
        _;
    }

    constructor() public{
        Creator = msg.sender;
    }

   function getCreator() constant public returns(address){
      return Creator;
   }

   struct accident{ 
      string video_hash;
      string time;
      string latitude;
      string longitude;
   }
   uint256 count = 1;
   
   mapping(uint256 => accident) Accidents;

   function addAccidentInfo(string _video_hash, string _time, string _latitude, string longitude) 
   public {
      Accidents[count].video_hash = _video_hash;
      Accidents[count].time = _time;
      Accidents[count].latitude = _latitude;
      Accidents[count].longitude = _longitude;
      count++;
   }

   function getAccidentCount() public view returns (uint256) {
      return count;
   }

   function getAccident(uint256 index) public view returns (string, string, string, string){
      return
      (Accidents[index].video_hash,
      Accidents[index].time,
      Accidents[index].latitude,
      Accidents[index].longitude);
   } 
}