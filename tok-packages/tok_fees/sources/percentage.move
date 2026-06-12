#[allow(lint(self_transfer))]
module tok_fees::percentage {
    use sui::coin::{Coin};
    use sui::sui::SUI;
    use sui::clock::{Clock};
    use tok_fees::config::{Self, GlobalTreasury};

    /// Fee object that charges a percentage fee on processed tokens.
    /// Owned by the service creator after paying the protocol creation fee.
    /// Stores the basis points percentage representation (e.g., 250 = 2.50%).
    public struct PercentageFee has key, store {
        id: UID,
        basis_points: u16,         // fee percentage in basis points (e.g., 100 = 1.00%)
        recipient: address,        // address that receives incoming fee payments
        last_update: u64,          // timestamp in ms of the last admin update
        lock_period: u64           // minimum ms that must pass between admin updates
    }

    // === Constants ===
    const MAX_BPS: u16 = 10000;    // Represents 100.00%

    // === Errors ===
    const EInvalidCreationFee: u64 = 0;  // payment does not match the required protocol fee
    const EUpdateLocked: u64 = 1;        // lock period has not expired, admin update rejected
    const EInvalidPercentage: u64 = 2;   // percentage exceeds the maximum allowed 100.00%

    /// Creates a PercentageFee object with its initial percentage and transfers it to the caller.
    /// Charges the protocol creation fee in SUI before creating the object.
    public fun create_fee(
        global_treasury: &GlobalTreasury,
        payment: Coin<SUI>,
        basis_points: u16,         // Pass the initial percentage rate directly on creation
        recipient: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let (treasury_address, fee_required) = config::get_treasury_info(global_treasury);
        assert!(payment.value() == fee_required, EInvalidCreationFee);
        assert!(basis_points <= MAX_BPS, EInvalidPercentage);
        transfer::public_transfer(payment, treasury_address);

        let fee_obj = PercentageFee {
            id: object::new(ctx),
            basis_points,
            recipient,
            last_update: clock.timestamp_ms(),
            lock_period: 0
        };

        transfer::public_transfer(fee_obj, ctx.sender());
    }

    // === Public On-Chain Getters ===

    /// Returns the complete fee configuration data needed by external integration contracts.
    /// Packed into a single call to minimize cross-module overhead and save CU.
    public fun get_fee_config(self: &PercentageFee): (u16, address) {
        (self.basis_points, self.recipient)
    }

    // === Internal Helpers ===

    /// Asserts that the lock period has expired since the last admin update.
    /// Called before any admin mutation to enforce the time lock.
    fun assert_lock_expired(self: &PercentageFee, clock: &Clock) {
        assert!(clock.timestamp_ms() >= self.last_update + self.lock_period, EUpdateLocked);
    }

    // === Admin Functions ===

    /// Updates the fee percentage using basis points. Requires lock period to have expired.
    /// Aborts if the new basis points value exceeds 10,000 (100%).
    public fun update_percentage(self: &mut PercentageFee, new_bps: u16, clock: &Clock) {
        self.assert_lock_expired(clock);
        assert!(new_bps <= MAX_BPS, EInvalidPercentage);
        
        self.basis_points = new_bps;
        self.last_update = clock.timestamp_ms();
    }

    /// Updates the recipient address for incoming payments.
    /// Intentionally excluded from the lock period to allow immediate emergency updates.
    public fun update_recipient(self: &mut PercentageFee, new_recipient: address) {
        self.recipient = new_recipient;
    }

    /// Updates the lock period duration. Requires current lock period to have expired.
    public fun update_lock_period(self: &mut PercentageFee, new_period: u64, clock: &Clock) {
        self.assert_lock_expired(clock);
        self.lock_period = new_period;
        self.last_update = clock.timestamp_ms();
    }

    /// Permanently deletes the fee object. Requires lock period to have expired.
    public fun delete_fee(self: PercentageFee, clock: &Clock) {
        self.assert_lock_expired(clock);
        let PercentageFee { id, .. } = self;
        id.delete();
    }
}
