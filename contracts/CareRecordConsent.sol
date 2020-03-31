pragma solidity >=0.4.21 <0.7.0;


contract CareRecordConsent {
    address public owner; //平台方帳號
    address public EBM; //EBM帳號
    address public user; //user帳號
    string uid; //user id
    address public registryContract; //註冊合約帳號

    // 授權機構=>授權對象=>sourceKey=>授權開始時間
    mapping(string => mapping(bytes32 => mapping(bytes32 => uint256))) sStart;

    // 授權機構=>授權對象=>sourceKey=>授權結束時間
    mapping(string => mapping(bytes32 => mapping(bytes32 => uint256))) sEnd;

    // 授權機構=>授權對象=>類別=>授權開始時間
    mapping(string => mapping(bytes32 => mapping(uint256 => uint256))) lStart;

    // 授權機構=>授權對象=>類別=>授權結束時間
    mapping(string => mapping(bytes32 => mapping(uint256 => uint256))) lEnd;

    event AddAuthWithSourceKeyEvent(
        string oid,
        bytes32[] target,
        bytes32[] sourceKey,
        uint256 _start,
        uint256 _end
    );
    event AddAuthWithLevelEvent(
        string oid,
        bytes32[] target,
        uint256[] level,
        uint256 _start,
        uint256 _end
    );
    event AskAuthEvent(
        string indexed id,
        bytes32 indexed sourceKey,
        string oid,
        uint256 role,
        uint256 level1,
        uint256 level2,
        uint256 time
    );
    event SetRegistryContractEvent(address _registryContract);
    event TransferOwnerEvent(address newOwner);
    event TransferEBMEvent(address newEBM);
    event TransferUserEvent(address newUser);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyEBM() {
        require(msg.sender == EBM);
        _;
    }

    modifier onlyUser() {
        require(msg.sender == user);
        _;
    }

    modifier onlyRegistryContract() {
        require(msg.sender == registryContract);
        _;
    }

    // 部署合約時設定 owner, user, uid, registryContract, EBM address
    constructor(
        address _owner,
        address _user,
        string memory _uid,
        address _registryContract,
        address _EBM
    ) public {
        owner = _owner;
        user = _user;
        uid = _uid;
        registryContract = _registryContract;
        EBM = _EBM;
    }

    // 新增授權 使用sourceKey (授權機構，授權對象，sourceKey，開始時間，結束時間)
    function addAuthWithSourceKey(
        string memory oid,
        bytes32[] memory target,
        bytes32[] memory sourceKey,
        uint256 _start,
        uint256 _end
    ) public onlyUser {
        for (uint256 i = 0; i < target.length; i++) {
            for (uint256 j = 0; j < sourceKey.length; j++) {
                require(_start <= _end);
                sStart[oid][target[i]][sourceKey[j]] = _start;
                sEnd[oid][target[i]][sourceKey[j]] = _end;
            }
        }
        emit AddAuthWithSourceKeyEvent(oid, target, sourceKey, _start, _end);
    }

    // 新增授權 使用類別 (授權機構，授權對象，類別，開始時間，結束時間)
    function addAuthWithLevel(
        string memory oid,
        bytes32[] memory target,
        uint256[] memory level,
        uint256 _start,
        uint256 _end
    ) public onlyUser {
        for (uint256 i = 0; i < target.length; i++) {
            for (uint256 j = 0; j < level.length; j++) {
                require(_start <= _end);
                lStart[oid][target[i]][level[j]] = _start;
                lEnd[oid][target[i]][level[j]] = _end;
            }
        }
        emit AddAuthWithLevelEvent(oid, target, level, _start, _end);
    }

    // 更改授權 使用類別 舊的(授權機構，授權對象，類別，開始時間，結束時間)＋(授權機構，授權對象，類別，開始時間，結束時間)
    function updateAuthWithLevel(
        string memory old_oid,
        bytes32[] memory old_target,
        uint256[] memory old_level,
        uint256 _old_start,
        uint256 _old_end,
        string memory oid,
        bytes32[] memory target,
        uint256[] memory level,
        uint256 _start,
        uint256 _end
    ) public onlyUser {
        for (uint256 i = 0; i < old_target.length; i++) {
            for (uint256 j = 0; j < old_level.length; j++) {
                lStart[old_oid][old_target[i]][old_level[j]] = _old_start;
                lEnd[old_oid][old_target[i]][old_level[j]] = _old_end;
            }
        }
        for (uint256 i = 0; i < target.length; i++) {
            for (uint256 j = 0; j < level.length; j++) {
                require(_start <= _end);
                lStart[oid][target[i]][level[j]] = _start;
                lEnd[oid][target[i]][level[j]] = _end;
            }
        }
    }

    // 授權詢問紀錄(查詢人機構，查詢人角色，查詢人id，Level1，Level2，sourceKey，現在時間)
    function RecordOfAskAuth(
        string memory oid,
        uint256 role,
        string memory id,
        uint256 level1,
        uint256 level2,
        bytes32 sourceKey,
        uint256 _now
    ) public onlyOwner {
        emit AskAuthEvent(id, sourceKey, oid, role, level1, level2, _now);
    }

    // 查詢授權(授權機構，授權對象角色，授權對象id，level1，level2，sourceKey，病歷來源機構，現在時間)
    function isAuth(
        string memory oid,
        bytes32 target,
        uint256 level1,
        uint256 level2,
        bytes32 sourceKey,
        uint256 time
    ) public view onlyOwner returns (bool) {
        return
            (time >= lStart[oid][target][0] && time <= lEnd[oid][target][0]) ||
            (time >= lStart[oid][target][level1] &&
                time <= lEnd[oid][target][level1]) ||
            (time >= lStart[oid][target][level2] &&
                time <= lEnd[oid][target][level2]) ||
            (time >= sStart[oid][target][sourceKey] &&
                time <= sEnd[oid][target][sourceKey]);
    }

    // 查詢授權開始和結束時間(授權機構，授權對象，sourceKey，開始時間，結束時間)
    function getAuthTimeWithSourceKey(
        string memory oid,
        bytes32 target,
        bytes32 sourceKey
    ) public view onlyUser returns (uint256, uint256) {
        return (sStart[oid][target][sourceKey], sEnd[oid][target][sourceKey]);
    }

    // 查詢授權開始和結束時間(授權機構，授權對象，sourceKey，開始時間，結束時間)
    function getAuthTimeWithLevel(
        string memory oid,
        bytes32 target,
        uint256 level
    ) public view onlyUser returns (uint256, uint256) {
        return (lStart[oid][target][level], lEnd[oid][target][level]);
    }

    // 更換Owner
    function transferOwner(address newOwner) public onlyOwner {
        owner = newOwner;
        emit TransferOwnerEvent(newOwner);
    }

    // 更換EBM address
    function transferEBM(address newEBM) public onlyOwner {
        EBM = newEBM;
        emit TransferEBMEvent(newEBM);
    }

    // 更換User，從RedistryContract setEthAddr 中呼叫此 function
    function transferUser(address newUser) public onlyRegistryContract {
        user = newUser;
        emit TransferUserEvent(newUser);
    }

    // 更換註冊合約地址
    function transferRegistryContract(address newRegistryContract)
        public
        onlyOwner
    {
        registryContract = newRegistryContract;
        emit SetRegistryContractEvent(newRegistryContract);
    }
}
