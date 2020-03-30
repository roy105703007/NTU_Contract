pragma solidity >=0.4.21 <0.7.0;
//pragma experimental ABIEncoderV2;

import "./CareRecordConsent.sol";

contract RegistryContract{

    address public owner;

    struct User {
        string u_id; //user 身分證字號
        address CareRecordConsentAddr; //user 授權合約地址
        address etherAddr; //user ethereum (EOA);
        address witnessAddr; //user 見證人address
        uint accountStatus; //見證人是否驗證此user 0=>未見證、1=>已見證
    }

    event setNewUser(string u_id, address etherAddr, address _witnessAddr, address CareRecordConsentAddr, uint now);
    event changeAccountStatus(string u_id, uint accountStatus, uint now);
    event changeEthAddr(string u_id, address CareRecordConsentAddr, address etherAddr, uint accountStatus, uint now);
    event changeWitness(string u_id, address NewWitnessAddr, uint now);
    event changeCareRecordConsentAddr(string u_id, address CareRecordConsentAddr, uint now);
    event manageWitness(address witnessAddr, bool oldIsWitnesses, bool NewIsWitnesses,uint now);

    mapping (string=>User) users; //user清單(uid)
    mapping (address=>bool) witnesses; //見證人清單(地址)
    string[] userIndex;
    address[] witnessIndex;
    
    constructor() public {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    modifier isWitness() { //msg.sender必須是見證人
        require(witnesses[msg.sender]);
        _;
    }
    modifier isSameWitness(string memory _u_id) { //確認msg.sender是 之前user所選之同個見證人
        require(msg.sender == users[_u_id].witnessAddr);
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    //新增user
    function registerUser(string memory _u_id, address _etherAddr, address _witnessAddr) public isWitness {
        require(msg.sender == _witnessAddr); //見證人必須是user所選取之見證人 [same as isSameWitness(), but _witnessAddr not set yet]
        require(bytes(users[_u_id].u_id).length == 0);
        users[_u_id].u_id = _u_id;
        users[_u_id].etherAddr = _etherAddr;
        users[_u_id].accountStatus = 1;
        users[_u_id].witnessAddr = _witnessAddr;
        users[_u_id].CareRecordConsentAddr = address(new CareRecordConsent(owner, _etherAddr, _u_id, address(this), owner));
        userIndex.push(_u_id);
        emit setNewUser(_u_id, _etherAddr, _witnessAddr, users[_u_id].CareRecordConsentAddr, now);
    }

    function setOldUser(string memory _u_id, address _etherAddr, uint accountStatus, address _witnessAddr, address _careRecordConsentAddr, uint time) public isOwner {
        require(bytes(users[_u_id].u_id).length == 0);
        users[_u_id].u_id = _u_id;
        users[_u_id].etherAddr = _etherAddr;
        users[_u_id].accountStatus = accountStatus;
        users[_u_id].witnessAddr = _witnessAddr;
        users[_u_id].CareRecordConsentAddr = _careRecordConsentAddr;
        userIndex.push(_u_id);
        emit setNewUser(_u_id, _etherAddr, _witnessAddr, _careRecordConsentAddr, time);
    }
    
    //更新見證人
    function setWitness(string memory _u_id, address _NewWitnessAddr) public isOwner {
        require(users[_u_id].accountStatus == 0);//尚未被驗證才可以更換見證人
        users[_u_id].witnessAddr = _NewWitnessAddr;
        emit changeWitness(_u_id, _NewWitnessAddr, now);
    }
    
    //更新user之 授權合約地址
    function setCareRecordConsentAddr(string memory _u_id, address _CareRecordConsentAddr) public isOwner {
        require(users[_u_id].accountStatus == 1);//被驗證後才可以進行授權、並取得授權合約地址
        users[_u_id].CareRecordConsentAddr = _CareRecordConsentAddr;
        emit changeCareRecordConsentAddr(_u_id, _CareRecordConsentAddr, now);
    }
    
    //設定見證人驗證之狀態
    function setAccountStatus(string memory _u_id, uint _accountStatus) public isOwner {
        users[_u_id].accountStatus = _accountStatus;
        emit changeAccountStatus(_u_id, _accountStatus, now);
    }

    //設定user的以太帳號(申請新憑證)，見證人可隨選，不必是註冊時所選之見證人
    function setEthAddr(string memory _u_id, address _newEtherAddr) public isWitness {
        users[_u_id].etherAddr = _newEtherAddr;
        // 更改CareRecordConsent中的user
        CareRecordConsent(users[_u_id].CareRecordConsentAddr).transferUser(_newEtherAddr);
        emit changeEthAddr(users[_u_id].u_id, users[_u_id].CareRecordConsentAddr, _newEtherAddr, users[_u_id].accountStatus, now);
    }

    //新增見證人
    function addWitness(address _witnessAddr) public isOwner {
        require(!witnesses[_witnessAddr], "the witness is already exist");
        bool oldWitnessStatus;
        oldWitnessStatus = witnesses[_witnessAddr];
        witnesses[_witnessAddr] = true;
        
        witnessIndex.push(_witnessAddr);
        emit manageWitness(_witnessAddr, oldWitnessStatus, witnesses[_witnessAddr], now);
    }

    //刪除見證人
    function deleteWitness(address _witnessAddr) public isOwner {
        require(witnesses[_witnessAddr], "the witness is not exist");
        bool oldWitnessStatus;
        oldWitnessStatus = witnesses[_witnessAddr];
        witnesses[_witnessAddr] = false;

        //從陣列刪除該見證人
        uint len = witnessIndex.length;
        for(uint i = 0 ; i < len ; i++){
            if(witnessIndex[i] == _witnessAddr){
                witnessIndex[i] = witnessIndex[len - 1];
                witnessIndex.length--;
                break;
            }
        }

        emit manageWitness(_witnessAddr, oldWitnessStatus, witnesses[_witnessAddr], now);
    }
    
    //取得user數量
    function getUserCount() public view returns(uint userCount) {
        return userIndex.length;
    }

    //get user information
    function getUserInfo(string memory _u_id) public isOwner view returns (string memory u_id, address CareRecordConsentAddr, address etherAddr, uint accountStatus) {
        return(users[_u_id].u_id, users[_u_id].CareRecordConsentAddr, users[_u_id].etherAddr, users[_u_id].accountStatus);
    }
    
    //get 見證人清單
    function getWitnesses() public view returns(address[] memory) {
        return witnessIndex;
    }

/*尚未支援回傳string[]
    //get 所有user
    function getAllUserInfo() public isOwner view  returns (string[], address[], address[], uint[]){
        string[] memory u_ids = new string[](userIndex.length);
        address[] memory assetAccounts = new address[](userIndex.length);
        address[] memory etherAddrs = new address[](userIndex.length);
        uint[]    memory accountStatus = new uint[](userIndex.length);

        for (uint i = 0; i < userIndex.length; i++) {
            User storage user = users[userIndex[i]];
            u_ids[i] = user.u_id;
            assetAccounts[i] = user.assetAccount;
            etherAddrs[i] = user.etherAddr;
            accountStatus[i] = user.accountStatus;
        }

        return (u_ids, assetAccounts, etherAddrs, accountStatus);
    }
*/

}
