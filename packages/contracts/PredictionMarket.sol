// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title PredictionMarket
 * @dev Binary prediction market contract for DegenHouse
 * Users bet YES or NO on a prediction, funds are sent to Gnosis Safe
 * Market state and bet tracking for real-time UI updates
 * 
 * SECURITY FEATURES:
 * - Pausable contract (pause on suspicious activity)
 * - ReentrancyGuard (prevent reentrancy attacks)
 * - Strict input validation
 * - Cooldown enforcement (300s between bets)
 * - Bet count limits (10 per wallet)
 * - Pool concentration limits (10% per wallet)
 * - Bet velocity limits (3 per hour)
 * - Wallet flagging for manual review
 */

enum BetChoice {
    YES,
    NO
}

enum MarketStatus {
    ACTIVE,
    CLOSED,
    RESOLVED
}

struct Market {
    string id;
    string question;
    uint256 yesPool;
    uint256 noPool;
    uint256 startTime;
    uint256 endTime;
    MarketStatus status;
    BetChoice winner;
}

struct Bet {
    address wallet;
    string marketId;
    BetChoice choice;
    uint256 amount;
    uint256 timestamp;
    uint256 betNumber;
}

contract PredictionMarket is Ownable, ReentrancyGuard, Pausable {
    // ============================================================================
    // STATE VARIABLES
    // ============================================================================

    IERC20 public usdt;
    address public gnosisSafe;
    bool private contractPaused;

    // Market data
    Market public market;
    bool public marketExists = false;

    // Bet tracking
    Bet[] public allBets;
    mapping(address => Bet[]) public userBets;
    mapping(address => uint256) public lastBetTimestamp;
    mapping(address => uint256) public betCountPerWallet;

    // Anti-manipulation tracking
    mapping(address => uint256[]) public walletBetTimestamps;
    mapping(address => bool) public flaggedWallets;

    // Constants - VALIDATION PARAMETERS
    uint256 public constant MIN_BET = 5 * 10**6;
    uint256 public constant MAX_BET = 5000 * 10**6;
    uint256 public constant COOLDOWN_SECONDS = 300;
    uint256 public constant MAX_BETS_PER_WALLET = 10;
    uint256 public constant POOL_CAP_PERCENT = 10;
    uint256 public constant HOUSE_FEE_PERCENT = 5;
    uint256 public constant MAX_BETS_IN_1_HOUR = 3;

    // ============================================================================
    // EVENTS
    // ============================================================================

    event MarketCreated(
        string indexed marketId,
        string question,
        uint256 startTime,
        uint256 endTime
    );

    event BetPlaced(
        address indexed wallet,
        string indexed marketId,
        BetChoice choice,
        uint256 amount,
        uint256 betNumber,
        uint256 timestamp
    );

    event PoolUpdated(
        string indexed marketId,
        uint256 yesPool,
        uint256 noPool,
        uint256 timestamp
    );

    event MarketResolved(
        string indexed marketId,
        BetChoice winner,
        uint256 timestamp
    );

    event MarketClosed(
        string indexed marketId,
        uint256 timestamp
    );

    event WalletFlagged(
        address indexed wallet,
        string reason,
        uint256 timestamp
    );

    event ContractPaused(
        string reason,
        uint256 timestamp
    );

    event ContractUnpaused(
        uint256 timestamp
    );

    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================

    constructor(address _gnosisSafe, address _usdt) Ownable(msg.sender) {
        require(_gnosisSafe != address(0), "PredictionMarket: Invalid Gnosis Safe address");
        require(_usdt != address(0), "PredictionMarket: Invalid USDT address");
        require(isContract(_usdt), "PredictionMarket: USDT address is not a contract");

        gnosisSafe = _gnosisSafe;
        usdt = IERC20(_usdt);
        contractPaused = false;
    }

    // ============================================================================
    // PAUSE MECHANISM - SECURITY
    // ============================================================================

    function pauseContract(string memory _reason) external onlyOwner {
        require(!contractPaused, "PredictionMarket: Contract already paused");
        contractPaused = true;
        emit ContractPaused(_reason, block.timestamp);
    }

    function unpauseContract() external onlyOwner {
        require(contractPaused, "PredictionMarket: Contract not paused");
        contractPaused = false;
        emit ContractUnpaused(block.timestamp);
    }

    function isPaused() external view returns (bool) {
        return contractPaused;
    }

    // ============================================================================
    // MARKET MANAGEMENT (OWNER ONLY)
    // ============================================================================

    function createMarket(
        string memory _marketId,
        string memory _question,
        uint256 _endTime
    ) external onlyOwner {
        require(!marketExists, "PredictionMarket: Market already exists");
        require(bytes(_marketId).length > 0, "PredictionMarket: Market ID cannot be empty");
        require(bytes(_question).length > 0, "PredictionMarket: Question cannot be empty");
        require(_endTime > block.timestamp, "PredictionMarket: End time must be in future");
        require(
            _endTime > block.timestamp + 86400,
            "PredictionMarket: Market must be open for at least 24 hours"
        );

        market = Market({
            id: _marketId,
            question: _question,
            yesPool: 0,
            noPool: 0,
            startTime: block.timestamp,
            endTime: _endTime,
            status: MarketStatus.ACTIVE,
            winner: BetChoice.YES
        });

        marketExists = true;

        emit MarketCreated(_marketId, _question, block.timestamp, _endTime);
    }

    function closeMarket() external onlyOwner {
        require(marketExists, "PredictionMarket: No market exists");
        require(market.status == MarketStatus.ACTIVE, "PredictionMarket: Market not active");

        market.status = MarketStatus.CLOSED;

        emit MarketClosed(market.id, block.timestamp);
    }

    function resolveMarket(BetChoice _winner) external onlyOwner {
        require(marketExists, "PredictionMarket: No market exists");
        require(
            market.status == MarketStatus.CLOSED,
            "PredictionMarket: Market must be closed first"
        );

        market.status = MarketStatus.RESOLVED;
        market.winner = _winner;

        emit MarketResolved(market.id, _winner, block.timestamp);
    }

    // ============================================================================
    // VALIDATION - HIGH SECURITY FOCUS
    // ============================================================================

    function _validateBetAmount(uint256 _amount) internal pure {
        require(_amount >= MIN_BET, "PredictionMarket: Bet below minimum (5 USDT)");
        require(_amount <= MAX_BET, "PredictionMarket: Bet exceeds maximum (5000 USDT)");
        require(_amount % 1000000 == 0, "PredictionMarket: Bet must be whole USDT");
    }

    function _validateCooldown(address _wallet) internal view {
        uint256 timeSinceLastBet = block.timestamp - lastBetTimestamp[_wallet];
        require(
            timeSinceLastBet >= COOLDOWN_SECONDS,
            "PredictionMarket: Cooldown period not met (300s required)"
        );
    }

    function _validateBetCount(address _wallet) internal view {
        uint256 currentBetCount = betCountPerWallet[_wallet];
        require(
            currentBetCount < MAX_BETS_PER_WALLET,
            "PredictionMarket: Maximum bets per wallet reached (10)"
        );
    }

    function _validatePoolCap(address _wallet, uint256 _amount) internal view {
        uint256 totalPool = market.yesPool + market.noPool;
        uint256 maxWalletExposure = totalPool > 0
            ? (totalPool * POOL_CAP_PERCENT) / 100
            : MAX_BET * 10;

        uint256 walletTotalBets = getWalletTotalBets(_wallet);
        require(
            walletTotalBets + _amount <= maxWalletExposure,
            "PredictionMarket: Bet exceeds wallet pool cap (10%)"
        );
    }

    function _validateBetVelocity(address _wallet) internal view {
        uint256 oneHourAgo = block.timestamp - 3600;
        uint256 recentBets = 0;

        uint256[] storage timestamps = walletBetTimestamps[_wallet];
        if (timestamps.length == 0) {
            return;
        }

        for (uint256 i = timestamps.length - 1; ; i--) {
            if (timestamps[i] >= oneHourAgo) {
                recentBets++;
            }
            if (i == 0) break;
        }

        require(
            recentBets < MAX_BETS_IN_1_HOUR,
            "PredictionMarket: Bet velocity limit exceeded (max 3 per hour)"
        );
    }

    function _checkFlaggedWallet(address _wallet) internal view {
        require(
            !flaggedWallets[_wallet],
            "PredictionMarket: Wallet flagged for review"
        );
    }

    function _validateBet(address _wallet, uint256 _amount) internal view {
        require(!contractPaused, "PredictionMarket: Contract is paused");
        require(marketExists, "PredictionMarket: No market exists");
        require(market.status == MarketStatus.ACTIVE, "PredictionMarket: Market not active");
        require(_wallet != address(0), "PredictionMarket: Invalid wallet address");
        require(_amount > 0, "PredictionMarket: Bet amount must be positive");

        _validateBetAmount(_amount);
        _validateCooldown(_wallet);
        _validateBetCount(_wallet);
        _validatePoolCap(_wallet, _amount);
        _validateBetVelocity(_wallet);
        _checkFlaggedWallet(_wallet);
    }

    // ============================================================================
    // BET PLACEMENT
    // ============================================================================

    function placeBet(BetChoice _choice, uint256 _amount)
        external
        nonReentrant
    {
        _validateBet(msg.sender, _amount);

        bool transferSuccess = usdt.transferFrom(
            msg.sender,
            gnosisSafe,
            _amount
        );
        require(transferSuccess, "PredictionMarket: USDT transfer failed");

        if (_choice == BetChoice.YES) {
            market.yesPool += _amount;
        } else {
            market.noPool += _amount;
        }

        uint256 newBetNumber = betCountPerWallet[msg.sender] + 1;
        Bet memory newBet = Bet({
            wallet: msg.sender,
            marketId: market.id,
            choice: _choice,
            amount: _amount,
            timestamp: block.timestamp,
            betNumber: newBetNumber
        });

        allBets.push(newBet);
        userBets[msg.sender].push(newBet);
        betCountPerWallet[msg.sender] = newBetNumber;
        lastBetTimestamp[msg.sender] = block.timestamp;
        walletBetTimestamps[msg.sender].push(block.timestamp);

        emit BetPlaced(
            msg.sender,
            market.id,
            _choice,
            _amount,
            newBetNumber,
            block.timestamp
        );

        emit PoolUpdated(market.id, market.yesPool, market.noPool, block.timestamp);
    }

    // ============================================================================
    // GETTERS
    // ============================================================================

    function getMarket()
        external
        view
        returns (
            string memory id,
            string memory question,
            uint256 yesPool,
            uint256 noPool,
            uint256 startTime,
            uint256 endTime,
            MarketStatus status,
            BetChoice winner
        )
    {
        require(marketExists, "PredictionMarket: No market exists");
        return (
            market.id,
            market.question,
            market.yesPool,
            market.noPool,
            market.startTime,
            market.endTime,
            market.status,
            market.winner
        );
    }

    function getPoolInfo()
        external
        view
        returns (
            uint256 yesPool,
            uint256 noPool,
            uint256 totalPool,
            uint256 yesPercent,
            uint256 noPercent
        )
    {
        require(marketExists, "PredictionMarket: No market exists");

        uint256 total = market.yesPool + market.noPool;
        uint256 yesP = total > 0 ? (market.yesPool * 100) / total : 0;
        uint256 noP = total > 0 ? (market.noPool * 100) / total : 0;

        return (market.yesPool, market.noPool, total, yesP, noP);
    }

    function getMarketTimeline()
        external
        view
        returns (
            uint256 startTime,
            uint256 endTime,
            uint256 timeRemaining,
            bool hasEnded
        )
    {
        require(marketExists, "PredictionMarket: No market exists");

        uint256 remaining = block.timestamp < market.endTime
            ? market.endTime - block.timestamp
            : 0;
        bool ended = block.timestamp >= market.endTime;

        return (market.startTime, market.endTime, remaining, ended);
    }

    function getUserBets(address _wallet)
        external
        view
        returns (Bet[] memory)
    {
        return userBets[_wallet];
    }

    function getUserBetCount(address _wallet) external view returns (uint256) {
        return betCountPerWallet[_wallet];
    }

    function getWalletTotalBets(address _wallet)
        public
        view
        returns (uint256 total)
    {
        if (!marketExists) return 0;

        Bet[] memory bets = userBets[_wallet];
        for (uint256 i = 0; i < bets.length; i++) {
            if (
                keccak256(abi.encodePacked(bets[i].marketId)) ==
                keccak256(abi.encodePacked(market.id))
            ) {
                total += bets[i].amount;
            }
        }
        return total;
    }

    function getCooldownRemaining(address _wallet)
        external
        view
        returns (uint256)
    {
        uint256 timeSinceLastBet = block.timestamp - lastBetTimestamp[_wallet];
        if (timeSinceLastBet >= COOLDOWN_SECONDS) {
            return 0;
        }
        return COOLDOWN_SECONDS - timeSinceLastBet;
    }

    function getBetCount() external view returns (uint256) {
        return allBets.length;
    }

    function getBet(uint256 _index)
        external
        view
        returns (
            address wallet,
            string memory marketId,
            BetChoice choice,
            uint256 amount,
            uint256 timestamp,
            uint256 betNumber
        )
    {
        require(_index < allBets.length, "PredictionMarket: Invalid bet index");
        Bet memory bet = allBets[_index];
        return (
            bet.wallet,
            bet.marketId,
            bet.choice,
            bet.amount,
            bet.timestamp,
            bet.betNumber
        );
    }

    function isWalletFlagged(address _wallet) external view returns (bool) {
        return flaggedWallets[_wallet];
    }

    // ============================================================================
    // ADMIN UTILITIES
    // ============================================================================

    function flagWallet(address _wallet, string memory _reason)
        external
        onlyOwner
    {
        require(_wallet != address(0), "PredictionMarket: Invalid wallet address");
        flaggedWallets[_wallet] = true;
        emit WalletFlagged(_wallet, _reason, block.timestamp);
    }

    function unflagWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "PredictionMarket: Invalid wallet address");
        flaggedWallets[_wallet] = false;
    }

    function updateGnosisSafe(address _newGnosisSafe) external onlyOwner {
        require(_newGnosisSafe != address(0), "PredictionMarket: Invalid address");
        require(isContract(_newGnosisSafe), "PredictionMarket: Address is not a contract");
        gnosisSafe = _newGnosisSafe;
    }

    function hasMarket() external view returns (bool) {
        return marketExists;
    }

    function resetMarket() external onlyOwner {
        require(
            market.status == MarketStatus.RESOLVED,
            "PredictionMarket: Market must be resolved first"
        );

        marketExists = false;
        delete allBets;
    }

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    function isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }
}
