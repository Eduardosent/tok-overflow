#[test_only]
module tok_fees::single_token_tests {
    use sui::test_scenario;
    use sui::clock;
    use sui::coin;
    use sui::sui::SUI;
    use tok_fees::config::{Self, GlobalTreasury};
    use tok_fees::single_token::{Self, SingleTokenFee};

    // === Constants ===
    const ADMIN: address = @0xAD;
    const USER: address = @0xB;
    const RECIPIENT: address = @0xC;
    const NEW_RECIPIENT: address = @0xD;
    const PRICE: u64 = 500_000_000;       // 0.5 tokens
    const NEW_PRICE: u64 = 1_000_000_000; // 1 token
    const LOCK_PERIOD: u64 = 86_400_000;  // 1 day in ms
    const CREATION_FEE: u64 = 10000;      // matches GlobalTreasury default fee

    // === Helpers ===

    /// Initializes GlobalTreasury and creates a SingleTokenFee<SUI> owned by ADMIN.
    fun setup(scenario: &mut test_scenario::Scenario): clock::Clock {
        config::init_for_testing(test_scenario::ctx(scenario));

        test_scenario::next_tx(scenario, ADMIN);
        let clock = clock::create_for_testing(test_scenario::ctx(scenario));

        let treasury = test_scenario::take_shared<GlobalTreasury>(scenario);
        let payment = coin::mint_for_testing<SUI>(CREATION_FEE, test_scenario::ctx(scenario));

        single_token::create_fee<SUI>(
            &treasury,
            payment,
            PRICE,
            RECIPIENT,
            LOCK_PERIOD,
            &clock,
            test_scenario::ctx(scenario)
        );

        test_scenario::return_shared(treasury);
        clock
    }

    // === Tests ===

    /// Verifies that create_fee produces a SingleTokenFee with the correct
    /// price, recipient, active status, and lock period.
    #[test]
    fun test_create_fee_success() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            let (price, recipient, active, _, lock_period) = single_token::get_fee_info(&fee);

            assert!(price == PRICE, 0);
            assert!(recipient == RECIPIENT, 1);
            assert!(active == true, 2);
            assert!(lock_period == LOCK_PERIOD, 3);

            test_scenario::return_to_sender(&scenario, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that create_fee aborts if the payment does not match the protocol fee.
    #[test]
    #[expected_failure(abort_code = single_token::EInvalidCreationFee)]
    fun test_create_fee_wrong_payment() {
        let mut scenario = test_scenario::begin(ADMIN);
        config::init_for_testing(test_scenario::ctx(&mut scenario));

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            let treasury = test_scenario::take_shared<GlobalTreasury>(&scenario);
            // wrong amount — should be 10000
            let payment = coin::mint_for_testing<SUI>(1, test_scenario::ctx(&mut scenario));

            single_token::create_fee<SUI>(
                &treasury,
                payment,
                PRICE,
                RECIPIENT,
                LOCK_PERIOD,
                &clock,
                test_scenario::ctx(&mut scenario)
            );

            test_scenario::return_shared(treasury);
            clock::destroy_for_testing(clock);
        };
        test_scenario::end(scenario);
    }

    /// Verifies that pay_fee forwards the correct payment to the recipient.
    #[test]
    fun test_pay_fee_success() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, USER);
        {
            let fee = test_scenario::take_from_address<SingleTokenFee<SUI>>(&scenario, ADMIN);
            let payment = coin::mint_for_testing<SUI>(PRICE, test_scenario::ctx(&mut scenario));

            single_token::pay_fee(&fee, payment);

            test_scenario::return_to_address(ADMIN, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that pay_fee aborts if the payment amount is incorrect.
    #[test]
    #[expected_failure(abort_code = single_token::EIncorrectPayment)]
    fun test_pay_fee_wrong_amount() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, USER);
        {
            let fee = test_scenario::take_from_address<SingleTokenFee<SUI>>(&scenario, ADMIN);
            let payment = coin::mint_for_testing<SUI>(1, test_scenario::ctx(&mut scenario));

            single_token::pay_fee(&fee, payment);

            test_scenario::return_to_address(ADMIN, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that pay_fee aborts if the fee object is inactive.
    #[test]
    #[expected_failure(abort_code = single_token::EServiceNotActive)]
    fun test_pay_fee_inactive() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            single_token::set_active(&mut fee, false);
            test_scenario::return_to_sender(&scenario, fee);
        };

        test_scenario::next_tx(&mut scenario, USER);
        {
            let fee = test_scenario::take_from_address<SingleTokenFee<SUI>>(&scenario, ADMIN);
            let payment = coin::mint_for_testing<SUI>(PRICE, test_scenario::ctx(&mut scenario));

            single_token::pay_fee(&fee, payment);

            test_scenario::return_to_address(ADMIN, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that update_price correctly updates the price after lock period expires.
    #[test]
    fun test_update_price_success() {
        let mut scenario = test_scenario::begin(ADMIN);
        let mut clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            // advance clock past lock period
            clock::increment_for_testing(&mut clock, LOCK_PERIOD);
            single_token::update_price(&mut fee, NEW_PRICE, &clock);

            let (price, _, _, _, _) = single_token::get_fee_info(&fee);
            assert!(price == NEW_PRICE, 0);

            test_scenario::return_to_sender(&scenario, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that update_price aborts if the lock period has not expired.
    #[test]
    #[expected_failure(abort_code = single_token::EUpdateLocked)]
    fun test_update_price_locked() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            // clock not advanced — lock period still active
            single_token::update_price(&mut fee, NEW_PRICE, &clock);
            test_scenario::return_to_sender(&scenario, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that update_recipient correctly updates after lock period expires.
    #[test]
    fun test_update_recipient_success() {
        let mut scenario = test_scenario::begin(ADMIN);
        let mut clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            clock::increment_for_testing(&mut clock, LOCK_PERIOD);
            single_token::update_recipient(&mut fee, NEW_RECIPIENT, &clock);

            let (_, recipient, _, _, _) = single_token::get_fee_info(&fee);
            assert!(recipient == NEW_RECIPIENT, 0);

            test_scenario::return_to_sender(&scenario, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that update_recipient aborts if the lock period has not expired.
    #[test]
    #[expected_failure(abort_code = single_token::EUpdateLocked)]
    fun test_update_recipient_locked() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            single_token::update_recipient(&mut fee, NEW_RECIPIENT, &clock);
            test_scenario::return_to_sender(&scenario, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that update_lock_period correctly updates after lock period expires.
    #[test]
    fun test_update_lock_period_success() {
        let mut scenario = test_scenario::begin(ADMIN);
        let mut clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            clock::increment_for_testing(&mut clock, LOCK_PERIOD);
            single_token::update_lock_period(&mut fee, 0, &clock);

            let (_, _, _, _, lock_period) = single_token::get_fee_info(&fee);
            assert!(lock_period == 0, 0);

            test_scenario::return_to_sender(&scenario, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that update_lock_period aborts if the lock period has not expired.
    #[test]
    #[expected_failure(abort_code = single_token::EUpdateLocked)]
    fun test_update_lock_period_locked() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let mut fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            single_token::update_lock_period(&mut fee, 0, &clock);
            test_scenario::return_to_sender(&scenario, fee);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that delete_fee successfully destroys the object after lock period expires.
    #[test]
    fun test_delete_fee_success() {
        let mut scenario = test_scenario::begin(ADMIN);
        let mut clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            clock::increment_for_testing(&mut clock, LOCK_PERIOD);
            single_token::delete_fee(fee, &clock);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }

    /// Verifies that delete_fee aborts if the lock period has not expired.
    #[test]
    #[expected_failure(abort_code = single_token::EUpdateLocked)]
    fun test_delete_fee_locked() {
        let mut scenario = test_scenario::begin(ADMIN);
        let clock = setup(&mut scenario);

        test_scenario::next_tx(&mut scenario, ADMIN);
        {
            let fee = test_scenario::take_from_sender<SingleTokenFee<SUI>>(&scenario);
            single_token::delete_fee(fee, &clock);
        };

        clock::destroy_for_testing(clock);
        test_scenario::end(scenario);
    }
}