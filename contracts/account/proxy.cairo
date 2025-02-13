
%lang starknet

from starkware.starknet.common.syscalls import delegate_call, get_contract_address
from starkware.cairo.common.cairo_builtins import HashBuiltin
from contracts.account.upgrades import Proxy_get_implementation, Proxy_set_implementation

@constructor
func constructor{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    } (
        implementation: felt,
        selector: felt,
        calldata_len: felt,
        calldata: felt*
    ):
    Proxy_set_implementation(implementation)

    delegate_call(
        contract_address=implementation,
        function_selector=selector,
        calldata_size=calldata_len,
        calldata=calldata
    )

    return ()
end

@external
@raw_input
@raw_output
func __default__{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(
        selector: felt,
        calldata_size: felt,
        calldata: felt*
    ) -> (
        retdata_size: felt,
        retdata: felt*
    ):
    let (address) = Proxy_get_implementation()

    let (retdata_size: felt, retdata: felt*) = delegate_call(
        contract_address=address,
        function_selector=selector,
        calldata_size=calldata_size,
        calldata=calldata
    )

    return (retdata_size=retdata_size, retdata=retdata)
end

@l1_handler
@raw_input
func __l1_default__{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(
        selector: felt,
        calldata_size: felt,
        calldata: felt*
    ):
    let (address) = Proxy_get_implementation()

    delegate_l1_handler(
        contract_address=address,
        function_selector=selector,
        calldata_size=calldata_size,
        calldata=calldata
    )

    return ()
end
