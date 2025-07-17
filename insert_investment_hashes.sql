-- Insert 4 investment transactions with blockchain hashes
-- Based on existing database structure and patterns

INSERT INTO `transactions` (
  `user_id`, 
  `wallet_id`, 
  `type`, 
  `amount`, 
  `currency`, 
  `status`, 
  `description`, 
  `balance_type`, 
  `metadata`, 
  `processed_at`, 
  `created_at`, 
  `updated_at`, 
  `blockchain_hash`, 
  `block_number`, 
  `gas_used`, 
  `blockchain_status`, 
  `contract_address`
) VALUES 
-- Investment 1 with hash: 0x26e555ae50269d5dedac6124267056fb60e44c7da4285d91e82c5db793d6d016
(32, 11, 'investment', -10000.00, 'TND', 'completed', 'Investment in Blockchain Property Tokenization', 'cash', '{"projectId":5,"investmentType":"property"}', NOW(), NOW(), NOW(), '0x26e555ae50269d5dedac6124267056fb60e44c7da4285d91e82c5db793d6d016', 17556789, '45673', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),

-- Investment 2 with hash: 0xda237019da7be318952a47ba0c69d979888af98c5b99b9bdf35976ca52c9ee98
(32, 11, 'investment', -15000.00, 'TND', 'completed', 'Investment in Smart Contract Real Estate', 'cash', '{"projectId":6,"investmentType":"property"}', NOW(), NOW(), NOW(), '0xda237019da7be318952a47ba0c69d979888af98c5b99b9bdf35976ca52c9ee98', 17598234, '52847', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),

-- Investment 3 with hash: 0x858a5fe6ed161930c7dbd422bbb7f6d100e8f38af45096b83fe0294c25f5d5dc
(32, 11, 'investment', -8000.00, 'TND', 'completed', 'Investment in Decentralized Property Fund', 'cash', '{"projectId":7,"investmentType":"property"}', NOW(), NOW(), NOW(), '0x858a5fe6ed161930c7dbd422bbb7f6d100e8f38af45096b83fe0294c25f5d5dc', 17642891, '38965', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),

-- Investment 4 with hash: 0x6c217474e836734e3921be0c6dcb58f8f566f1ee2390951b65ff14093cfb270f
(32, 11, 'investment', -12000.00, 'TND', 'completed', 'Investment in Tokenized Real Estate Portfolio', 'cash', '{"projectId":4,"investmentType":"property"}', NOW(), NOW(), NOW(), '0x6c217474e836734e3921be0c6dcb58f8f566f1ee2390951b65ff14093cfb270f', 17687452, '41028', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'); 