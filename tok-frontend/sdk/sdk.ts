import { VestingCreatedEvent } from '@/types/events';
import { EventId, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';

const VESTING_PACKAGE = "0x2e802e5d290de9ff149e301a4d74be1532472f9fad7c366c96b3d20a2c040de1";
const VESTING_FEE_ID = "0xa7ab16ecd86f8cc58cc71e1a8701dba7b8693fb26065b4db285e2015a396ea6b";
const STAKING_PACKAGE = "0x9c574ca2f0fd43d5c893e911e9f6d37f104a01ff3efd1e14876af195517d3a5f";
const STAKING_FEE_ID = "0x3fd5f91e8c698bb083555238af8aacf5daa06c3a361150306de0cf5b4c4d516f";
const CLOCK = "0x6";

export class VestingModule {
    async createVesting(
        client: SuiJsonRpcClient,
        params: {
            sender: string;
            coinType: string;
            amount: number | bigint;
            cliffTime: number;
            releaseAmount: number | bigint;
            releasePeriod: number;
            recipient: string;
        }
    ): Promise<Transaction> {
        const tx = new Transaction();
        console.log(params)
        tx.setSender(params.sender);
    
        // Split protocol fee from gas (0.01 SUI = 10,000,000 MIST)
        const FEE = 10_000_000;
        const [feeCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(FEE)]);
    
        let vestingSourceCoin;
    
        if (params.coinType === "0x2::sui::SUI") {
            // Native SUI: use tx.gas directly (remaining gas after fee)
            [vestingSourceCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(params.amount)]);
        } else {
            // Custom tokens: fetch user's coin objects
            const coins = await client.getCoins({
                owner: params.sender,
                coinType: params.coinType
            });
        
            if (!coins.data.length) {
                throw new Error(`No ${params.coinType} coins found for sender`);
            }
        
            [vestingSourceCoin] = tx.splitCoins(
                tx.object(coins.data[0].coinObjectId),
                [tx.pure.u64(params.amount)]
            );
        }
    
        // Execute vesting contract call
        tx.moveCall({
            target: `${VESTING_PACKAGE}::vesting::create_vesting`,
            typeArguments: [params.coinType, "0x2::sui::SUI"],
            arguments: [
                tx.object(VESTING_FEE_ID),
                feeCoin,
                vestingSourceCoin,
                tx.pure.u64(params.cliffTime),
                tx.pure.u64(params.releaseAmount),
                tx.pure.u64(params.releasePeriod),
                tx.pure.address(params.recipient),
                tx.object(CLOCK),
            ]
        });
    
        return tx;
    }

    async getVestingsBySender(
        client: SuiJsonRpcClient,
        senderAddress: string,
        packageId: string = VESTING_PACKAGE
    ): Promise<VestingCreatedEvent[]> {
        const events: VestingCreatedEvent[] = [];
        let cursor: EventId | null = null; 
        let hasNextPage = true;
    
        while (hasNextPage) {
            const response = await client.queryEvents({
                query: {
                    MoveEventType: `${packageId}::vesting::VestingCreated`,
                },
                limit: 50,
                cursor: cursor || undefined,
            });
        
            const filtered = response.data
                .map((event: any) => {
                    const parsed = event.parsedJson as VestingCreatedEvent;
                    return {
                        ...parsed,
                        timestamp: event.timestampMs ? Number(event.timestampMs) : 0,
                    };
                })
                .filter((parsed) => parsed && parsed.from === senderAddress);
            
            events.push(...filtered);
            
            if (response.hasNextPage && response.nextCursor) {
                cursor = response.nextCursor;
            } else {
                hasNextPage = false;
            }
        }
    
        // Sort by timestamp descending (newest first)
        events.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
        return events;
    }

    async getVestingsByOwner(
      client: SuiJsonRpcClient,
      ownerAddress: string
    ): Promise<any[]> {
      const vestings: any[] = [];
      let cursor: string | null = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await client.getOwnedObjects({
          owner: ownerAddress,
          options: {
            showType: true,
            showContent: true,
          },
          cursor: cursor || undefined,
          limit: 50,
        });

        const filtered = response.data
          .map((obj: any) => obj.data)
          .filter((obj: any) => obj?.type?.includes(`${VESTING_PACKAGE}::vesting::Vesting`));

        vestings.push(...filtered);

        if (response.hasNextPage && response.nextCursor) {
          cursor = response.nextCursor;
        } else {
          hasNextPage = false;
        }
      }

      return vestings;
    }

    async claim(params: {
        sender: string;
        coinType: string;
        vestingId: string;
    }): Promise<Transaction> {
        const tx = new Transaction();
        tx.setSender(params.sender);

        tx.moveCall({
            target: `${VESTING_PACKAGE}::vesting::claim`,
            typeArguments: [params.coinType],
            arguments: [
                tx.object(params.vestingId),
                tx.object(CLOCK),
            ]
        });

        return tx;
    }
}

export class StakingModule {
    async createPool(params: {
        sender: string;
        coinType: string;
        rewardCoinId: string;
    }): Promise<Transaction> {
        const tx = new Transaction();
        tx.setSender(params.sender);

        const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000_000)]);

        tx.moveCall({
            target: `${STAKING_PACKAGE}::staking::create_pool`,
            typeArguments: [params.coinType, "0x2::sui::SUI"],
            arguments: [
                tx.object(STAKING_FEE_ID),
                paymentCoin,
                tx.object(params.rewardCoinId),
            ]
        });

        return tx;
    }

    async stake(params: {
        sender: string;
        coinType: string;
        poolId: string;
        optionId: number;
        coinId: string;
    }): Promise<Transaction> {
        const tx = new Transaction();
        tx.setSender(params.sender);

        tx.moveCall({
            target: `${STAKING_PACKAGE}::staking::stake`,
            typeArguments: [params.coinType],
            arguments: [
                tx.object(params.poolId),
                tx.pure.u8(params.optionId),
                tx.object(params.coinId),
                tx.object(CLOCK),
            ]
        });

        return tx;
    }

    async unstake(params: {
        sender: string;
        coinType: string;
        poolId: string;
        entryId: string;
    }): Promise<Transaction> {
        const tx = new Transaction();
        tx.setSender(params.sender);

        tx.moveCall({
            target: `${STAKING_PACKAGE}::staking::unstake`,
            typeArguments: [params.coinType],
            arguments: [
                tx.object(params.poolId),
                tx.object(params.entryId),
                tx.object(CLOCK),
            ]
        });

        return tx;
    }

    async addStakeOption(params: {
        sender: string;
        coinType: string;
        poolId: string;
        optionId: number;
        lockDays: number;
        apr: number;
    }): Promise<Transaction>  {
        const tx = new Transaction();
        tx.setSender(params.sender);

        tx.moveCall({
            target: `${STAKING_PACKAGE}::staking::add_stake_option`,
            typeArguments: [params.coinType],
            arguments: [
                tx.object(params.poolId),
                tx.pure.u8(params.optionId),
                tx.pure.u16(params.lockDays),
                tx.pure.u16(params.apr),
            ]
        });

        return tx;
    }

    async setOptionActive(params: {
        sender: string;
        coinType: string;
        poolId: string;
        optionId: number;
        isActive: boolean;
    }): Promise<Transaction> {
        const tx = new Transaction();
        tx.setSender(params.sender);

        tx.moveCall({
            target: `${STAKING_PACKAGE}::staking::set_option_active`,
            typeArguments: [params.coinType],
            arguments: [
                tx.object(params.poolId),
                tx.pure.u8(params.optionId),
                tx.pure.bool(params.isActive),
            ]
        });

        return tx;
    }

    async depositRewards(params: {
        sender: string;
        coinType: string;
        poolId: string;
        rewardCoinId: string;
    }): Promise<Transaction> {
        const tx = new Transaction();
        tx.setSender(params.sender);

        tx.moveCall({
            target: `${STAKING_PACKAGE}::staking::deposit_rewards`,
            typeArguments: [params.coinType],
            arguments: [
                tx.object(params.poolId),
                tx.object(params.rewardCoinId),
            ]
        });

        return tx;
    }
}

export class TokSDK {
    readonly vesting: VestingModule;
    readonly staking: StakingModule;

    constructor() {
        this.vesting = new VestingModule();
        this.staking = new StakingModule();
    }
}