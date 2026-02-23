// Test file for edge cases
// Valid private key
const key1 = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

// Should NOT match - too short
const key2 = "0x1234567890abcdef";

// Should NOT match - not starting with 0x
const key3 = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1";

// Should NOT match - has invalid characters
const key4 = "0x1234567890abcdefG234567890abcdef1234567890abcdef1234567890abcdef";

// Should NOT match - followed by alphanumeric (part of identifier)
const variable0xaaaaaaaabbbbbbbbccccccccddddddddeeeeeeeeffffffffaaaaaaaaaaaaaaaa = "test";

// Should match - uppercase hex
const key5 = "0xABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890";

// Should match - mixed case
const key6 = "0xAbCdEf1234567890aBcDeF1234567890AbCdEf1234567890aBcDeF1234567890";
