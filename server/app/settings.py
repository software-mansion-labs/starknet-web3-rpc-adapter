import os


def require_env(name):
    value = os.getenv(name)
    assert value, f"Env {name} not provided."
    return value


ACCOUNT_CONTRACT_HASH = int(require_env("ACCOUNT_CONTRACT_HASH"))
ACCOUNT_ADDRESS_SALT = int(require_env("ACCOUNT_ADDRESS_SALT"))
NODE_URL = require_env("NODE_URL")
