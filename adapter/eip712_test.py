# pylint: skip-file
from eip712_structs import make_domain

from adapter.eip712 import Payload, to_message_hash

payload_args = dict(
    nonce=0,
    address=1527313146790301463986275421344872471267849035609999779125866589010379625340,
    selector=1530486729947006463063166157847785599120665941190480211966374137237989315360,
    calldata=[1234, 11],
)

signature = 0x537021CF10650D5798C78FE6CE1008C7FB04123B18194BADA3C307EE55263A450C0158566D52B92DF1B231DDCF61B31E65397DB6AA97CDF9DFC5676F727400471C

test_domain = make_domain(name="Starknet adapter", version="1")


def test_schema():
    payload = Payload(**payload_args)

    domain = test_domain
    payload.signable_bytes(domain=domain)

    assert (
        domain.hash_struct().hex()
        == "d986ed154f5666297a4a36c4e72f7a12d338e4e6e1e35a9cfc4b4f3cf1778252"
    )
    assert (
        payload.hash_struct().hex()
        == "13e0e0536ade41214cb32cb4303c1872af09f7e5c8b751e3009cc55d388c7d25"
    )
    assert (
        payload.signable_bytes(domain=domain).hex()
        == "1901a9a75dadb300183067a4891919ea159951513371b5554d7434dea255a265101413e0e0536ade41214cb32cb4303c1872af09f7e5c8b751e3009cc55d388c7d25"
    )


def test_to_message_hash():
    assert (
        to_message_hash(**payload_args, domain=test_domain).hex()
        == "376f97f637e0ecd7f3c199525893cdc5cf06e4c0df7056a56d0a74d75cb52189"
    )
