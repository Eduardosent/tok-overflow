export interface VestingCreatedEvent {
    vesting_id: string;
    from: string;
    to: string;
    total_amount: string;
    coin_type: { name: string };
    timestamp?: number;
    decimals: number;
}