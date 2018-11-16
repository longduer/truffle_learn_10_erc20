pragma solidity  ^0.4.22;

contract Ballot {

    struct Voter {
        uint256 weight;
        bool voted;
        address delegate;
        uint256 vote;
    }

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    address public chairperson;

    mapping(address=>Voter) public voters;

    Proposal[] public proposals;

    function proposalsNumber() public view returns (uint256 proposalsNumber_){
        proposalsNumber_ = proposals.length;
    }

    constructor(bytes32[] proposalNames) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        for(uint256 i =0 ;i<proposalNames.length;i++){
            proposals.push(Proposal({
                name:proposalNames[i],
                voteCount:0
                }));
        }
    }

    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "only chairperson can give right to vote."
        );

        require(
            !voters[voter].voted,
            "the voter already voted."
        );

        require(
            voters[voter].weight==0,
            "voter's initial weight must be 0"
        );
        voters[voter].weight = 1;
    }

    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted,"you have already voted.");

        require(to != msg.sender,"self-delegation is not allowed.");

        while(voters[to].delegate != address(0)){
            to = voters[to].delegate;
            require(to!=msg.sender,"Found loop in delegation.");
        }

        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if(delegate_.voted){
            proposals[delegate_.vote].voteCount += sender.weight;
        }else {
            delegate_.weight += sender.weight;
        }
    }

    function vote(uint256 proposal) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted,"already voted.");
        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for(uint256 p = 0 ;p<proposals.length;p++){
            if(proposals[p].voteCount>winningVoteCount){
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}