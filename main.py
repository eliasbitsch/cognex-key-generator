BASE = 0x721440c4

# Single-bit XOR table (for bits 0-31)
SINGLE_XOR = [
    0x0000000c, 0x0000000c, 0x00000000, 0x00000020,  # bits 0-3
    0x00000020, 0x000001c0, 0x00000080, 0x00000000,  # bits 4-7
    0x00000400, 0x00000400, 0x00002000, 0x00002000,  # bits 8-11
    0x00002000, 0x00008000, 0x00008000, 0x00010000,  # bits 12-15
    0x00020000, 0x00080000, 0x00080000, 0x00300000,  # bits 16-19
    0x00000000, 0x00800000, 0x00800000, 0x01000000,  # bits 20-23
    0x00000000, 0x00000000, 0x08000000, 0x20000000,  # bits 24-27
    0x20000000, 0x00000000, 0x80000000, 0x00000000,  # bits 28-31
]

def gen(x: int) -> int:
    """
    Generator: y = C - x (mod 2^32)
    where C = BASE ^ xor_val
    xor_val is computed from linear and interaction terms
    """
    xor_val = 0
    
    # Linear terms
    for bit in range(32):
        if (x >> bit) & 1:
            xor_val ^= SINGLE_XOR[bit]
    
    # Interaction terms:
    # (0,1,2) without 3
    if (x & 0x07) == 0x07 and not (x & 0x08):
        xor_val ^= 0x20
    
    # (6,7) both set
    if (x & 0xc0) == 0xc0:
        xor_val ^= 0x100
    
    # (8,9) without 10
    if (x & 0x300) == 0x300 and not (x & 0x400):
        xor_val ^= 0x18000
    
    # (16,17,18) without 19
    if (x & 0x70000) == 0x70000 and not (x & 0x80000):
        xor_val ^= 0x300000
    
    # (27,28,29) all set
    if (x & 0x38000000) == 0x38000000:
        xor_val ^= 0x80000000
    
    # (4-11) all set
    if (x & 0xff0) == 0xff0:
        xor_val ^= 0x0821a100
    
    C = BASE ^ xor_val
    return (C - x) & 0xFFFFFFFF


def hex_gen(hex_str: str) -> str:
    """
    Nimmt 8-stelligen Hex-Input und gibt 8-stelligen Hex-Output zurück
    """
    x = int(hex_str, 16)
    y = gen(x)
    return f"{y:08x}"


if __name__ == "__main__":
    tests = [
        "bd0710c1",
        "bd0710c2",
        "832d5ff2",
        "1dc750c1",
        "7dd39b87",
    ]

    for t in tests:
        print(f"{t} -> {hex_gen(t)}")