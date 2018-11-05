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
		string location;
	}

	struct driver{
		uint256 count;
		mapping(uint256 => accident) accidents;
	}

	mapping(string => driver) Drivers;

	function newDriversInfo(string ID) public {
		Drivers[ID].count = 0;
	}

	function addAccidentInfo(string ID, string _video_hash, string _time, string _location, uint256 index) public {
		Drivers[ID].accidents[index].video_hash = _video_hash;
		Drivers[ID].accidents[index].time = _time;
		Drivers[ID].accidents[index].location = _location;
		Drivers[ID].count++;
	}

	function getAccidentCount(string ID) public view returns (uint256) {
		return Drivers[ID].count;
	}

	function getAccident(string ID, uint256 index) public view returns (string, string, string){
		return
		(Drivers[ID].accidents[index].video_hash,
		Drivers[ID].accidents[index].time,
		Drivers[ID].accidents[index].location);
	} 
}