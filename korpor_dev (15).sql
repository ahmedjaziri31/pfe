-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2025 at 11:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `korpor_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_role_permissions`
--

CREATE TABLE `ai_role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `allowed_columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of allowed columns',
  `denied_columns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of explicitly denied columns',
  `where_conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of required WHERE conditions',
  `max_rows` int(11) DEFAULT NULL COMMENT 'Maximum rows this role can query',
  `allowed_operations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array: ["SELECT", "COUNT", "SUM", etc.]',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_role_permissions`
--

INSERT INTO `ai_role_permissions` (`id`, `role_id`, `table_name`, `allowed_columns`, `denied_columns`, `where_conditions`, `max_rows`, `allowed_operations`, `created_at`, `updated_at`) VALUES
(1, 1, '*', '[\"*\"]', NULL, NULL, NULL, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"MIN\", \"MAX\", \"GROUP BY\", \"ORDER BY\", \"HAVING\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(2, 2, 'users', '[\"id\", \"name\", \"surname\", \"email\", \"role_id\", \"approval_status\", \"created_at\", \"updated_at\", \"investment_total\", \"currency\", \"investment_preference\", \"investment_region\", \"voice_enabled\", \"preferred_voice\", \"voice_speed\", \"voice_language\"]', '[\"password\", \"reset_code\", \"refresh_token\", \"phone\", \"phone_verification_code\", \"pending_phone\", \"twoFactorSecret\", \"backupCodes\", \"signup_verification_code\", \"google_id\"]', NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 16:06:29'),
(3, 2, 'projects', '[\"*\"]', NULL, NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(4, 2, 'investments', '[\"*\"]', NULL, NULL, 5000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(5, 2, 'transactions', '[\"id\", \"user_id\", \"wallet_id\", \"type\", \"amount\", \"currency\", \"status\", \"description\", \"created_at\", \"processed_at\"]', '[\"tx_hash\", \"blockchain_hash\", \"contract_address\"]', NULL, 5000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(6, 2, 'wallets', '[\"id\", \"user_id\", \"cash_balance\", \"rewards_balance\", \"currency\", \"created_at\", \"updated_at\"]', NULL, NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(7, 2, 'payments', '[\"id\", \"user_id\", \"amount\", \"currency\", \"status\", \"payment_method\", \"created_at\"]', '[\"stripe_payment_intent_id\", \"payme_token\", \"crypto_tx_hash\"]', NULL, 2000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(8, 2, 'roles', '[\"*\"]', NULL, NULL, 10, '[\"SELECT\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(9, 2, 'rental_payouts', '[\"*\"]', NULL, NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(10, 3, 'users', '[\"id\", \"name\", \"surname\", \"email\", \"approval_status\", \"created_at\", \"role_id\", \"voice_enabled\"]', '[\"password\", \"reset_code\", \"refresh_token\", \"phone\", \"investment_total\", \"phone_verification_code\", \"twoFactorSecret\", \"backupCodes\", \"signup_verification_code\", \"google_id\", \"preferred_voice\", \"voice_speed\", \"voice_language\"]', '[{\"field\": \"approval_status\", \"operator\": \"IN\", \"value\": [\"pending\", \"unverified\"]}]', 500, '[\"SELECT\", \"COUNT\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 16:06:29'),
(11, 3, 'projects', '[\"id\", \"name\", \"status\", \"goal_amount\", \"current_amount\", \"location\", \"created_at\"]', '[\"description\", \"coordinates\", \"address_details\", \"amenities\"]', NULL, 100, '[\"SELECT\", \"COUNT\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(12, 3, 'verifications', '[\"id\", \"user_id\", \"identity_status\", \"address_status\", \"overall_status\", \"created_at\"]', '[\"passport_image_url\", \"selfie_image_url\", \"address_image_url\"]', NULL, 200, '[\"SELECT\", \"COUNT\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(13, 3, 'roles', '[\"id\", \"name\", \"description\"]', '[\"privileges\"]', NULL, 10, '[\"SELECT\"]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(14, 4, '*', NULL, '[\"*\"]', NULL, 0, '[]', '2025-06-22 11:58:11', '2025-06-22 11:58:11'),
(15, 1, 'voice_usage_logs', '[\"*\"]', NULL, NULL, NULL, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(16, 2, 'voice_usage_logs', '[\"id\", \"user_id\", \"feature_type\", \"success\", \"processing_time_ms\", \"language_detected\", \"created_at\"]', '[\"error_message\", \"api_cost\"]', NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(17, 3, 'voice_usage_logs', '[\"id\", \"user_id\", \"feature_type\", \"success\", \"created_at\"]', '[\"error_message\", \"api_cost\", \"processing_time_ms\"]', '[{\"field\": \"user_id\", \"operator\": \"=\", \"value\": \"USER_ID\"}]', 100, '[\"SELECT\", \"COUNT\", \"ORDER BY\"]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(18, 4, 'voice_usage_logs', NULL, '[\"*\"]', NULL, 0, '[]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(19, 1, 'voice_files', '[\"*\"]', NULL, NULL, NULL, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(20, 2, 'voice_files', '[\"id\", \"user_id\", \"file_type\", \"file_size\", \"duration_seconds\", \"created_at\"]', '[\"file_path\", \"cloudinary_public_id\"]', NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(21, 3, 'voice_files', '[\"id\", \"user_id\", \"file_type\", \"duration_seconds\", \"created_at\"]', '[\"file_path\", \"cloudinary_public_id\", \"file_size\"]', '[{\"field\": \"user_id\", \"operator\": \"=\", \"value\": \"USER_ID\"}]', 50, '[\"SELECT\", \"COUNT\", \"ORDER BY\"]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(22, 4, 'voice_files', NULL, '[\"*\"]', NULL, 0, '[]', '2025-06-22 16:06:28', '2025-06-22 16:06:28'),
(23, 1, 'voice_settings', '[\"*\"]', NULL, NULL, NULL, '[\"SELECT\", \"COUNT\", \"GROUP BY\", \"ORDER BY\"]', '2025-06-22 16:06:29', '2025-06-22 16:06:29'),
(24, 2, 'voice_settings', '[\"setting_key\", \"setting_value\", \"setting_type\", \"description\", \"is_active\"]', NULL, '[{\"field\": \"is_active\", \"operator\": \"=\", \"value\": true}]', 50, '[\"SELECT\", \"COUNT\", \"ORDER BY\"]', '2025-06-22 16:06:29', '2025-06-22 16:06:29'),
(25, 3, 'voice_settings', '[\"setting_key\", \"setting_value\", \"description\"]', NULL, '[{\"field\": \"is_active\", \"operator\": \"=\", \"value\": true}, {\"field\": \"setting_key\", \"operator\": \"IN\", \"value\": [\"voice_features_enabled\", \"supported_audio_formats\", \"max_audio_file_size\"]}]', 10, '[\"SELECT\"]', '2025-06-22 16:06:29', '2025-06-22 16:06:29'),
(26, 4, 'voice_settings', NULL, '[\"*\"]', NULL, 0, '[]', '2025-06-22 16:06:29', '2025-06-22 16:06:29');

-- --------------------------------------------------------

--
-- Table structure for table `ai_usage_logs`
--

CREATE TABLE `ai_usage_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `user_role_id` int(11) NOT NULL,
  `query_hash` varchar(64) NOT NULL COMMENT 'SHA-256 hash of the query for privacy',
  `query_type` enum('general','data_access','denied') NOT NULL,
  `access_granted` tinyint(1) NOT NULL DEFAULT 0,
  `denial_reason` varchar(255) DEFAULT NULL,
  `response_time_ms` int(11) DEFAULT NULL,
  `tokens_used` int(11) DEFAULT NULL,
  `cost_estimate` decimal(10,4) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `feature_type` enum('chat','backoffice','speech_to_text','text_to_speech','voice_chat') DEFAULT 'chat' COMMENT 'Type of AI feature used',
  `voice_enabled` tinyint(1) DEFAULT 0 COMMENT 'Whether voice was used in this interaction',
  `audio_duration` int(11) DEFAULT NULL COMMENT 'Duration of audio processing in seconds',
  `processing_time_ms` int(11) DEFAULT NULL COMMENT 'Total processing time in milliseconds'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_usage_logs`
--

INSERT INTO `ai_usage_logs` (`id`, `user_id`, `conversation_id`, `user_role_id`, `query_hash`, `query_type`, `access_granted`, `denial_reason`, `response_time_ms`, `tokens_used`, `cost_estimate`, `ip_address`, `user_agent`, `created_at`, `feature_type`, `voice_enabled`, `audio_duration`, `processing_time_ms`) VALUES
(1, 30, 1, 1, 'fa7de072c9b90fb3324c10bab47a56b73428ad5985c20f2533534a908d5a0382', 'data_access', 1, NULL, 1250, 150, 0.0045, NULL, NULL, '2025-06-22 10:01:00', 'chat', 0, NULL, NULL),
(2, 32, 2, 3, '83b4f1bc659dab8c132b53a400da2a05c5321d07f81474be3c50b065852a6cef', 'data_access', 1, NULL, 890, 120, 0.0036, NULL, NULL, '2025-06-22 10:31:00', 'chat', 0, NULL, NULL),
(3, 29, 3, 2, '21ad81026090e053584a7abcefcb1590439a1486a7ac98aadc641a2c2e71a5b8', 'data_access', 1, NULL, 2100, 280, 0.0084, NULL, NULL, '2025-06-22 11:01:00', 'chat', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `auto_invest_plans`
--

CREATE TABLE `auto_invest_plans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `monthly_amount` decimal(15,2) NOT NULL,
  `currency` enum('TND','EUR') NOT NULL DEFAULT 'TND',
  `theme` enum('growth','income','index','balanced') NOT NULL,
  `status` enum('active','paused','cancelled') NOT NULL DEFAULT 'active',
  `deposit_day` int(11) NOT NULL,
  `payment_method_id` varchar(50) DEFAULT NULL,
  `last_deposit_date` datetime DEFAULT NULL,
  `next_deposit_date` datetime DEFAULT NULL,
  `total_deposited` decimal(15,2) DEFAULT 0.00,
  `total_invested` decimal(15,2) DEFAULT 0.00,
  `auto_invest_enabled` tinyint(1) DEFAULT 1,
  `min_investment_amount` decimal(15,2) DEFAULT 500.00,
  `max_investment_percentage` decimal(5,2) DEFAULT 25.00,
  `risk_level` enum('low','medium','high') DEFAULT 'medium',
  `preferred_regions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `excluded_property_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auto_invest_plans`
--

INSERT INTO `auto_invest_plans` (`id`, `user_id`, `monthly_amount`, `currency`, `theme`, `status`, `deposit_day`, `payment_method_id`, `last_deposit_date`, `next_deposit_date`, `total_deposited`, `total_invested`, `auto_invest_enabled`, `min_investment_amount`, `max_investment_percentage`, `risk_level`, `preferred_regions`, `excluded_property_types`, `notes`, `created_at`, `updated_at`) VALUES
(1, 18, 5000.00, 'TND', 'income', 'active', 12, 'Visa ••••4242 04/2032', NULL, '2025-06-11 23:00:00', 0.00, 0.00, 1, 500.00, 25.00, 'medium', NULL, NULL, 'AutoInvest plan created on 2025-06-05T20:20:21.152Z', '2025-06-05 20:20:25', '2025-06-05 20:20:25'),
(2, 23, 5000.00, 'TND', 'balanced', 'active', 27, 'PayMe.tn', NULL, '2025-06-26 23:00:00', 0.00, 0.00, 1, 500.00, 25.00, 'medium', NULL, NULL, 'AutoInvest plan created on 2025-06-05T21:22:42.059Z', '2025-06-05 21:22:46', '2025-06-05 21:22:46'),
(3, 27, 2000.00, 'TND', 'income', 'cancelled', 27, 'Visa ••••4242 04/2029', NULL, NULL, 0.00, 0.00, 1, 500.00, 25.00, 'medium', NULL, NULL, 'AutoInvest plan created on 2025-06-09T08:12:51.981Z', '2025-06-09 08:12:53', '2025-06-09 08:13:52'),
(4, 28, 5000.00, 'TND', 'balanced', 'cancelled', 27, 'Visa ••••4242 02/2043', NULL, NULL, 0.00, 0.00, 1, 500.00, 25.00, 'medium', NULL, NULL, 'AutoInvest plan created on 2025-06-09T19:24:03.524Z', '2025-06-09 19:24:03', '2025-06-09 19:24:38'),
(5, 28, 2000.00, 'TND', 'balanced', 'cancelled', 27, 'Visa ••••4242 02/2043', NULL, NULL, 0.00, 0.00, 1, 500.00, 25.00, 'medium', NULL, NULL, 'AutoInvest plan created on 2025-06-09T22:18:19.962Z', '2025-06-09 22:18:19', '2025-06-09 22:19:48');

-- --------------------------------------------------------

--
-- Table structure for table `auto_reinvest_plans`
--

CREATE TABLE `auto_reinvest_plans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('active','paused','cancelled') NOT NULL DEFAULT 'active',
  `minimum_reinvest_amount` decimal(15,2) DEFAULT 100.00,
  `reinvest_percentage` decimal(5,2) DEFAULT 100.00,
  `theme` enum('growth','income','index','balanced','diversified') NOT NULL DEFAULT 'balanced',
  `risk_level` enum('low','medium','high') DEFAULT 'medium',
  `preferred_regions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `excluded_property_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `total_rental_income` decimal(15,2) DEFAULT 0.00,
  `total_reinvested` decimal(15,2) DEFAULT 0.00,
  `pending_reinvest_amount` decimal(15,2) DEFAULT 0.00,
  `last_reinvest_date` datetime DEFAULT NULL,
  `reinvestment_frequency` enum('immediate','weekly','monthly') DEFAULT 'monthly',
  `auto_approval_enabled` tinyint(1) DEFAULT 1,
  `max_reinvest_percentage_per_project` decimal(5,2) DEFAULT 25.00,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auto_reinvest_plans`
--

INSERT INTO `auto_reinvest_plans` (`id`, `user_id`, `status`, `minimum_reinvest_amount`, `reinvest_percentage`, `theme`, `risk_level`, `preferred_regions`, `excluded_property_types`, `total_rental_income`, `total_reinvested`, `pending_reinvest_amount`, `last_reinvest_date`, `reinvestment_frequency`, `auto_approval_enabled`, `max_reinvest_percentage_per_project`, `notes`, `created_at`, `updated_at`) VALUES
(1, 27, 'active', 100.00, 100.00, 'growth', 'medium', '[]', '[]', 0.00, 0.00, 0.00, NULL, 'immediate', 1, 25.00, 'AutoReinvest plan created on 2025-06-09T08:17:39.756Z', '2025-06-09 08:17:41', '2025-06-09 08:17:41'),
(2, 28, 'active', 100.00, 100.00, 'growth', 'medium', '[]', '[]', 0.00, 0.00, 0.00, NULL, 'immediate', 1, 25.00, 'AutoReinvest plan created on 2025-06-09T19:25:41.488Z', '2025-06-09 19:25:41', '2025-06-09 19:25:41'),
(3, 29, 'active', 100.00, 80.00, 'balanced', 'medium', NULL, NULL, 450.00, 320.00, 130.00, NULL, 'monthly', 1, 25.00, NULL, '2025-06-09 22:38:54', '2025-06-09 22:38:54');

-- --------------------------------------------------------

--
-- Table structure for table `backers`
--

CREATE TABLE `backers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `backers`
--

INSERT INTO `backers` (`id`, `name`, `image_url`, `order`, `created_at`, `updated_at`) VALUES
(1, 'Backer 1', 'https://imgur.com/a/5LIzDge', 1, '2025-05-28 16:23:20', '2025-05-28 16:23:20'),
(2, 'Backer 2', 'https://imgur.com/6fF86Wi', 2, '2025-05-28 16:23:20', '2025-05-28 16:23:20'),
(3, 'Backer 3', 'https://imgur.com/qWFY0PB', 3, '2025-05-28 16:23:20', '2025-05-28 16:23:20'),
(4, 'Backer 4', 'https://imgur.com/40D8Lim', 4, '2025-05-28 16:23:20', '2025-05-28 16:23:20');

-- --------------------------------------------------------

--
-- Table structure for table `blacklisted_tokens`
--

CREATE TABLE `blacklisted_tokens` (
  `id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blacklisted_tokens`
--

INSERT INTO `blacklisted_tokens` (`id`, `token`, `expires_at`, `created_at`) VALUES
(25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyLCJlbWFpbCI6ImFobWVkamF6aXJpNTFAZ21haWwuY29tIiwicm9sZSI6ImFnZW50IiwiaWF0IjoxNzUwNTg4NDE2LCJleHAiOjE3NTA1OTIwMTZ9.Vz7rYfPTKCmI7IPJGQk13iSCwqfSkkkKhmQEbID9W6Y', '2025-06-22 11:33:36', '2025-06-22 10:46:20'),
(26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJlbWFpbCI6ImFobWVkamF6aXJpNDFAZ21haWwuY29tIiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTA1ODkxODYsImV4cCI6MTc1MDU5Mjc4Nn0.ZSVYoFMjul8-SEzAfV3JSfLPkuRkn1Ii40FHVQhCRdA', '2025-06-22 11:46:26', '2025-06-22 11:20:45'),
(27, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJlbWFpbCI6ImFobWVkamF6aXJpNDFAZ21haWwuY29tIiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTA1OTEzOTAsImV4cCI6MTc1MDU5NDk5MH0.2lR42F0717JS_ZOPwvtzljO4D2uiKw1JO6dnl5AVBhk', '2025-06-22 12:23:10', '2025-06-22 11:23:21'),
(28, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyLCJlbWFpbCI6ImFobWVkamF6aXJpNTFAZ21haWwuY29tIiwicm9sZSI6ImFnZW50IiwiaWF0IjoxNzUwNTkxNDA2LCJleHAiOjE3NTA1OTUwMDZ9.cBdumpRu6vtWdmAgv1dFCVCzMb7JK-eHpj1gcl2b2hQ', '2025-06-22 12:23:26', '2025-06-22 11:24:11'),
(29, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyLCJlbWFpbCI6ImFobWVkamF6aXJpNTFAZ21haWwuY29tIiwicm9sZSI6ImFnZW50IiwiaWF0IjoxNzUwNTkxNDU3LCJleHAiOjE3NTA1OTUwNTd9.LyfW7STODRhLhaF1adNBNkRZyF4qCDqlTzgHIOGs4xA', '2025-06-22 12:24:17', '2025-06-22 11:26:21');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `user_id`, `title`, `created_at`, `updated_at`) VALUES
(1, 30, 'Real Estate Investment Questions', '2025-06-22 10:00:00', '2025-06-22 11:58:14'),
(2, 32, 'Portfolio Analysis Request', '2025-06-22 10:30:00', '2025-06-22 11:58:14'),
(3, 29, 'System Administration Queries', '2025-06-22 11:00:00', '2025-06-22 11:58:14');

-- --------------------------------------------------------

--
-- Table structure for table `conversation_messages`
--

CREATE TABLE `conversation_messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `role` enum('user','assistant','system') NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `audio_url` varchar(500) DEFAULT NULL COMMENT 'URL to audio file if message has voice',
  `audio_duration` int(11) DEFAULT NULL COMMENT 'Duration of audio in seconds',
  `voice_enabled` tinyint(1) DEFAULT 0 COMMENT 'Whether voice was enabled for this message',
  `transcription_confidence` decimal(3,2) DEFAULT NULL COMMENT 'Confidence score for speech-to-text (0.00-1.00)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversation_messages`
--

INSERT INTO `conversation_messages` (`id`, `conversation_id`, `role`, `content`, `created_at`, `audio_url`, `audio_duration`, `voice_enabled`, `transcription_confidence`) VALUES
(1, 1, 'user', 'What are the best performing projects?', '2025-06-22 10:01:00', NULL, NULL, 0, NULL),
(2, 1, 'assistant', 'Based on the available data, here are the top performing projects by ROI...', '2025-06-22 10:01:15', NULL, NULL, 0, NULL),
(3, 2, 'user', 'Show me my investment portfolio summary', '2025-06-22 10:31:00', NULL, NULL, 0, NULL),
(4, 2, 'assistant', 'Here is your investment portfolio analysis...', '2025-06-22 10:31:20', NULL, NULL, 0, NULL),
(5, 3, 'user', 'Generate a report of user registrations this month', '2025-06-22 11:01:00', NULL, NULL, 0, NULL),
(6, 3, 'assistant', 'Here is the user registration analysis for this month...', '2025-06-22 11:01:30', NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `founders`
--

CREATE TABLE `founders` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `linkedin_url` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `investments`
--

CREATE TABLE `investments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `status` enum('pending','confirmed','failed','cancelled') NOT NULL DEFAULT 'pending',
  `user_address` varchar(42) DEFAULT NULL,
  `paymee_ref` varchar(255) DEFAULT NULL,
  `payment_url` varchar(255) DEFAULT NULL,
  `tx_hash` varchar(66) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `currency` varchar(3) NOT NULL DEFAULT 'TND',
  `payment_method` enum('wallet','card','bank_transfer') NOT NULL DEFAULT 'wallet',
  `transaction_id` int(11) DEFAULT NULL,
  `investment_date` datetime DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `investments`
--

INSERT INTO `investments` (`id`, `user_id`, `project_id`, `amount`, `status`, `user_address`, `paymee_ref`, `payment_url`, `tx_hash`, `created_at`, `updated_at`, `currency`, `payment_method`, `transaction_id`, `investment_date`, `metadata`) VALUES
(5, 23, 5, 5000.00, 'confirmed', '', NULL, NULL, NULL, '2025-06-07 12:33:47', '2025-06-07 12:33:47', 'TND', 'wallet', 12, '2025-06-07 12:33:47', NULL),
(6, 26, 5, 3000.00, 'confirmed', '', NULL, NULL, NULL, '2025-06-09 07:07:49', '2025-06-09 07:07:49', 'TND', 'wallet', 20, '2025-06-09 07:07:49', NULL),
(7, 27, 5, 3000.00, 'confirmed', '', NULL, NULL, NULL, '2025-06-09 08:08:43', '2025-06-09 08:08:43', 'TND', 'wallet', 22, '2025-06-09 08:08:43', NULL),
(8, 3, 5, 3000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-09 18:06:55', '2025-06-09 18:06:55', 'TND', 'wallet', 28, '2025-06-09 18:06:55', NULL),
(9, 28, 5, 3000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-09 19:12:56', '2025-06-09 19:12:56', 'TND', 'wallet', 30, '2025-06-09 19:12:56', NULL),
(10, 28, 6, 17000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-09 21:49:24', '2025-06-09 21:49:24', 'TND', 'wallet', 32, '2025-06-09 21:49:24', NULL),
(11, 28, 7, 8000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-09 22:08:05', '2025-06-09 22:08:05', 'TND', 'wallet', 34, '2025-06-09 22:08:05', NULL),
(12, 28, 4, 10000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-09 22:34:10', '2025-06-09 22:34:10', 'TND', 'wallet', 36, '2025-06-09 22:34:10', NULL),
(13, 32, 8, 2500.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 00:59:45', '2025-06-10 00:59:45', 'TND', 'wallet', 38, '2025-06-10 00:59:45', NULL),
(14, 32, 3, 5000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 01:33:24', '2025-06-10 01:33:24', 'TND', 'wallet', 40, '2025-06-10 01:33:24', NULL),
(15, 32, 8, 5000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 01:52:13', '2025-06-10 01:52:13', 'TND', 'wallet', 42, '2025-06-10 01:52:13', NULL),
(16, 32, 5, 5000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 01:53:02', '2025-06-10 01:53:02', 'TND', 'wallet', 43, '2025-06-10 01:53:02', NULL),
(17, 32, 5, 5000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 02:06:11', '2025-06-10 02:06:11', 'TND', 'wallet', 45, '2025-06-10 02:06:11', NULL),
(18, 32, 4, 10000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 02:13:41', '2025-06-10 02:13:41', 'TND', 'wallet', 47, '2025-06-10 02:13:41', NULL),
(19, 32, 3, 5000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 02:18:23', '2025-06-10 02:18:23', 'TND', 'wallet', 48, '2025-06-10 02:18:23', NULL),
(20, 32, 7, 8000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 02:29:04', '2025-06-10 02:29:04', 'TND', 'wallet', 50, '2025-06-10 02:29:04', NULL),
(21, 32, 6, 15000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 08:00:08', '2025-06-10 08:00:08', 'TND', 'wallet', 52, '2025-06-10 08:00:08', NULL),
(22, 32, 5, 10000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-10 08:54:41', '2025-06-10 08:54:41', 'TND', 'wallet', 55, '2025-06-10 08:54:41', NULL),
(23, 35, 5, 3000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-11 22:21:22', '2025-06-11 22:21:22', 'TND', 'wallet', 57, '2025-06-11 22:21:22', NULL),
(24, 32, 7, 8000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-19 01:59:04', '2025-06-19 01:59:04', 'TND', 'wallet', 60, '2025-06-19 01:59:04', NULL),
(25, 30, 7, 8000.00, 'confirmed', NULL, NULL, NULL, NULL, '2025-06-23 05:59:02', '2025-06-23 05:59:02', 'TND', 'wallet', 62, '2025-06-23 05:59:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `payment_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` enum('stripe','payme','crypto') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','confirmed','failed','expired','cancelled','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `user_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `stripe_customer_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_payment_intent_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `saved_payment_method_id` int(11) DEFAULT NULL,
  `paymee_ref` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crypto_address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crypto_currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payme_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'PayMe payment token from API response',
  `payme_order_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'PayMe order ID',
  `payme_transaction_id` int(11) DEFAULT NULL COMMENT 'PayMe transaction ID from webhook',
  `received_amount` decimal(10,2) DEFAULT NULL COMMENT 'Amount received after fees',
  `transaction_fee` decimal(10,2) DEFAULT NULL COMMENT 'PayMe transaction fee',
  `customer_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Customer email address',
  `customer_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Customer phone number',
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Customer full name',
  `webhook_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Raw webhook data from PayMe',
  `crypto_tx_hash` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `payment_id`, `payment_method`, `amount`, `currency`, `status`, `user_address`, `user_id`, `project_id`, `stripe_customer_id`, `stripe_payment_intent_id`, `saved_payment_method_id`, `paymee_ref`, `crypto_address`, `crypto_currency`, `payme_token`, `payme_order_id`, `payme_transaction_id`, `received_amount`, `transaction_fee`, `customer_email`, `customer_phone`, `customer_name`, `webhook_data`, `crypto_tx_hash`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, '6d44d555d66bef025eb4c4f3b0355fc6', 'payme', 100.00, 'TND', 'pending', '0x742d35cc6634c0532925a3b844bc454e4438f44e', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '6d44d555d66bef025eb4c4f3b0355fc6', 'korpor_1748746297391_1qlpqb', NULL, NULL, NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'Mohamed Amine', NULL, NULL, NULL, '2025-06-01 02:51:37', '2025-06-01 02:51:37'),
(2, 'ded6c4c88e965dada336173a9fcc23f8', 'payme', 100.00, 'TND', 'pending', '0x742d35cc6634c0532925a3b844bc454e4438f44e', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'ded6c4c88e965dada336173a9fcc23f8', 'korpor_1748746392747_a4x6wl', NULL, NULL, NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'Mohamed Amine', NULL, NULL, NULL, '2025-06-01 02:53:13', '2025-06-01 02:53:13'),
(3, '19fa4b139577ab5554b841cf350d14ab', 'payme', 100.00, 'TND', 'pending', '0x742d35cc6634c0532925a3b844bc454e4438f44e', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '19fa4b139577ab5554b841cf350d14ab', 'korpor_1748746404465_yxyyxq', NULL, NULL, NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'Mohamed Amine', NULL, NULL, NULL, '2025-06-01 02:53:25', '2025-06-01 02:53:25'),
(4, '364d7a6c965a85f945a6d08b76ff9310', 'payme', 100.00, 'TND', 'pending', '0x742d35cc6634c0532925a3b844bc454e4438f44e', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '364d7a6c965a85f945a6d08b76ff9310', 'korpor_1748746828948_dtp0if', NULL, NULL, NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'Mohamed Amine', NULL, NULL, NULL, '2025-06-01 03:00:29', '2025-06-01 03:00:29');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `goal_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `current_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `status` enum('Pending','Active','Funded','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  `property_status` enum('available','under_review','sold_out','rented') NOT NULL DEFAULT 'under_review',
  `location` varchar(255) DEFAULT NULL,
  `coordinates` point DEFAULT NULL,
  `address_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `property_size` decimal(10,2) DEFAULT NULL,
  `property_type` enum('residential','commercial','industrial','land') DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `construction_year` int(11) DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `expected_roi` decimal(5,2) DEFAULT NULL,
  `rental_yield` decimal(5,2) DEFAULT NULL,
  `investment_period` int(11) DEFAULT NULL COMMENT 'In months',
  `minimum_investment` decimal(18,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `goal_amount`, `current_amount`, `status`, `property_status`, `location`, `coordinates`, `address_details`, `property_size`, `property_type`, `bedrooms`, `bathrooms`, `construction_year`, `amenities`, `expected_roi`, `rental_yield`, `investment_period`, `minimum_investment`, `image_url`, `cloudinary_public_id`, `created_by`, `featured`, `created_at`, `updated_at`) VALUES
(3, 'Luxury Marina Apartments', 'Premium waterfront apartments in the heart of Tunis Marina. This exclusive development features modern architecture, panoramic sea views, and world-class amenities. Each unit is designed with high-end finishes, smart home technology, and private balconies overlooking the Mediterranean.', 2500000.00, 760000.00, 'Active', 'available', 'Tunis Marina, Tunisia', NULL, NULL, 145.50, 'residential', 3, 2, 2024, '{\"gym\":true,\"pool\":true,\"parking\":true,\"security\":true,\"concierge\":true,\"spa\":true,\"beachAccess\":true}', 12.50, 8.20, 36, 5000.00, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format', NULL, 21, 1, '2025-06-03 01:22:57', '2025-06-10 02:18:23'),
(4, 'Commercial Plaza Downtown', 'Strategic commercial development in Tunis city center. This mixed-use project combines retail spaces, office units, and dining establishments. Located in a high-traffic area with excellent public transportation access and growing business district.', 3200000.00, 1930000.00, 'Active', 'available', 'Downtown Tunis, Tunisia', NULL, NULL, 850.00, 'commercial', NULL, NULL, 2023, '{\"parking\":true,\"security\":true,\"elevator\":true,\"airConditioning\":true,\"highSpeedInternet\":true}', 15.80, 11.40, 48, 10000.00, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&auto=format', NULL, 21, 1, '2025-06-03 01:22:57', '2025-06-10 02:13:41'),
(5, 'Eco-Friendly Housing Complex', 'Sustainable residential complex featuring solar panels, rainwater harvesting, and green building materials. This innovative project promotes environmental responsibility while providing comfortable modern living spaces for families.', 1800000.00, 1684000.00, 'Active', 'available', 'Sousse, Tunisia', NULL, NULL, 120.00, 'residential', 2, 2, 2024, '{\"solarPanels\":true,\"garden\":true,\"parking\":true,\"playground\":true,\"communityCenter\":true,\"recyclingCenter\":true}', 10.20, 7.50, 42, 3000.00, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format', NULL, 21, 0, '2025-06-03 01:22:58', '2025-06-11 22:21:22'),
(6, 'Seaside Resort Villas', 'Exclusive beachfront villa development in Hammamet. These luxury villas offer private pools, direct beach access, and stunning Mediterranean views. Perfect for high-end vacation rentals and premium real estate investment.', 4500000.00, 1382000.00, 'Active', 'available', 'Hammamet, Tunisia', NULL, NULL, 280.00, 'residential', 4, 3, 2024, '{\"privatePool\":true,\"beachAccess\":true,\"security\":true,\"parking\":true,\"garden\":true,\"barbecueArea\":true,\"oceanView\":true}', 14.70, 9.80, 60, 15000.00, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format', NULL, 21, 1, '2025-06-03 01:22:58', '2025-06-10 08:00:08'),
(7, 'Modern Business Center', 'State-of-the-art office complex designed for modern businesses. Features flexible office spaces, conference facilities, high-speed internet infrastructure, and premium location in the emerging business district.', 2800000.00, 1020000.00, 'Active', 'available', 'Sfax, Tunisia', NULL, NULL, 950.00, 'commercial', NULL, NULL, 2023, '{\"conferenceRooms\":true,\"highSpeedInternet\":true,\"parking\":true,\"security\":true,\"elevator\":true,\"airConditioning\":true,\"cafeteria\":true}', 13.20, 10.10, 45, 8000.00, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop&auto=format', NULL, 21, 0, '2025-06-03 01:22:58', '2025-06-23 05:59:02'),
(8, 'Student Housing Complex', 'Modern student accommodation near University of Tunis. Designed specifically for student needs with study areas, high-speed internet, laundry facilities, and 24/7 security. Excellent investment opportunity in the education sector.', 1600000.00, 1447500.00, 'Active', 'available', 'University District, Tunis', NULL, NULL, 85.00, 'residential', 2, 1, 2024, '{\"studyRooms\":true,\"highSpeedInternet\":true,\"laundry\":true,\"security\":true,\"commonArea\":true,\"bike_storage\":true}', 11.80, 8.90, 36, 2500.00, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&auto=format', NULL, 21, 0, '2025-06-03 01:22:58', '2025-06-10 01:52:13'),
(9, 'Heritage Renovation Project', 'Restoration of a historic building in Tunis Medina, converting it into boutique apartments while preserving traditional architecture. This unique project combines cultural heritage with modern amenities.', 2200000.00, 2200000.00, 'Funded', 'sold_out', 'Medina, Tunis', NULL, NULL, 95.00, 'residential', 2, 1, 1890, '{\"historicalSignificance\":true,\"traditionalArchitecture\":true,\"courtyardGarden\":true,\"security\":true}', 9.50, 6.80, 48, 4000.00, 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop&auto=format', NULL, 21, 1, '2025-06-03 01:22:59', '2025-06-22 16:09:37'),
(11, 'Test Property Investment', 'A test property for auto-reinvest testing', 100000.00, 85000.00, 'Active', 'rented', 'Tunis, Tunisia', NULL, NULL, NULL, 'residential', NULL, NULL, NULL, NULL, 8.50, 6.20, NULL, 500.00, NULL, NULL, 29, 1, '2025-06-09 22:38:54', '2025-06-09 22:38:54');

-- --------------------------------------------------------

--
-- Table structure for table `project_documents`
--

CREATE TABLE `project_documents` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `document_type` enum('legal','financial','technical','marketing','other') DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_images`
--

CREATE TABLE `property_images` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `property_images`
--

INSERT INTO `property_images` (`id`, `project_id`, `image_url`, `cloudinary_public_id`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 3, 'https://i.postimg.cc/2jHxrcNK/c31dac112b2e887bab40be14864ace2.jpg', NULL, 1, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(2, 3, 'https://i.postimg.cc/cCjYYzs1/f058c75591fbcce60e12b381687fe5c1.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(3, 3, 'https://i.postimg.cc/4ynVYGRF/c31dac112b2e887bab40be14864ace29.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(4, 4, 'https://i.postimg.cc/G2gswfTP/35c4e254c91adc72b53ef733e78eba59.jpg', NULL, 1, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(5, 4, 'https://i.postimg.cc/VLC0pDfM/758394be770ea22329916169ec105a37.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(6, 4, 'https://i.postimg.cc/Jz3D40Bz/f3c4200383dfb1c67b7c5e7f8dcbf2a6.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(7, 5, 'https://i.postimg.cc/yxSWq8HB/660a9b0ba5f0d3439bd4786d5fd6f841.jpg', NULL, 1, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(8, 5, 'https://i.postimg.cc/c4wMws8V/72445a8bb7f108199624fe91b94365f2.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(9, 5, 'https://i.postimg.cc/26ghLJjk/3285308c37b9b68cb60f8d0a4cdaca7f.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(10, 6, 'https://i.postimg.cc/3x3pG2hv/2bd49b56cd210afbfb531027f357ea86.jpg', NULL, 1, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(11, 6, 'https://i.postimg.cc/5t0C7169/6d3bd54918e7390e3d5f52105991dae0.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(12, 6, 'https://i.postimg.cc/WbvJR0hH/039c62688689f974ef477529f86039d2.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(13, 7, 'https://i.postimg.cc/TPpKj94p/3f8d10fe791c0085d485270ae3a934a6.jpg', NULL, 1, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(14, 7, 'https://i.postimg.cc/02njLFgz/414ddb29b48335945019768b46427dbb.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(15, 7, 'https://i.postimg.cc/t4mTg64y/da7275b37668e773ebd3c6a9def6eba1.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(16, 8, 'https://i.postimg.cc/m2L2NjcB/2e0e6d8eefbcc56c00f9810c213128d3.jpg', NULL, 1, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(17, 8, 'https://i.postimg.cc/FKL9sn6g/4b915b62447f6268fd46939376ba127f.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(18, 8, 'https://i.postimg.cc/xT1nbd7d/5eb39d84d09d77aa9cda9d1af495ceda.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(19, 9, 'https://i.postimg.cc/0jWgCp3y/2db85cee23c31392c2f743d400ea5e1b.jpg', NULL, 1, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(20, 9, 'https://i.postimg.cc/Nfnq9kmN/6c81c2e4abf0fc592ae7e3dfc66df1dc.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51'),
(21, 9, 'https://i.postimg.cc/tghLc0ff/101debac81011ae0e19b1af4cefb4e4e.jpg', NULL, 0, '2025-06-03 02:41:51', '2025-06-03 02:41:51');

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` int(11) NOT NULL,
  `referrer_id` int(11) NOT NULL,
  `referee_id` int(11) NOT NULL,
  `status` enum('pending','qualified','rewarded') NOT NULL DEFAULT 'pending',
  `referee_investment_amount` decimal(15,2) DEFAULT 0.00,
  `referrer_reward` decimal(15,2) DEFAULT 0.00,
  `referee_reward` decimal(15,2) DEFAULT 0.00,
  `currency` enum('TND','EUR') NOT NULL,
  `qualified_at` datetime DEFAULT NULL,
  `rewarded_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rental_payouts`
--

CREATE TABLE `rental_payouts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` enum('TND','EUR') NOT NULL DEFAULT 'TND',
  `payout_date` datetime NOT NULL,
  `is_reinvested` tinyint(1) DEFAULT 0,
  `reinvested_amount` decimal(15,2) DEFAULT 0.00,
  `reinvest_transaction_id` int(11) DEFAULT NULL,
  `auto_reinvest_plan_id` int(11) DEFAULT NULL,
  `status` enum('pending','paid','reinvested','partially_reinvested') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental_payouts`
--

INSERT INTO `rental_payouts` (`id`, `user_id`, `project_id`, `amount`, `currency`, `payout_date`, `is_reinvested`, `reinvested_amount`, `reinvest_transaction_id`, `auto_reinvest_plan_id`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(8, 29, 11, 150.00, 'TND', '2024-05-01 00:00:00', 0, 120.00, NULL, 3, 'reinvested', NULL, '2025-06-09 22:38:54', '2025-06-09 22:38:54'),
(9, 29, 11, 150.00, 'TND', '2024-04-01 00:00:00', 0, 120.00, NULL, 3, 'reinvested', NULL, '2025-06-09 22:38:54', '2025-06-09 22:38:54'),
(10, 29, 11, 150.00, 'TND', '2024-03-01 00:00:00', 0, 80.00, NULL, 3, 'partially_reinvested', NULL, '2025-06-09 22:38:54', '2025-06-09 22:38:54');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `privileges` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `privileges`, `description`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', '[\"all\"]', 'Super Administrator with full system access', '2025-05-28 13:10:21', '2025-06-23 09:27:18'),
(2, 'admin', '[\"manage_users\",\"view_users\",\"edit_users\",\"view_reports\",\"manage_content\",\"view_dashboard\",\"manage_settings\"]', 'Administrator with management access', '2025-05-28 13:10:21', '2025-06-23 09:27:18'),
(3, 'agent', '[\"view_dashboard\",\"view_assigned_tasks\",\"manage_own_profile\",\"view_reports\"]', 'Support agent with limited access', '2025-05-28 13:10:21', '2025-06-23 09:27:18'),
(4, 'user', '[\"read:properties\",\"create:investments\"]', 'Regular user with investment capabilities', '2025-06-03 01:23:52', '2025-06-03 01:23:52');

-- --------------------------------------------------------

--
-- Table structure for table `saved_payment_methods`
--

CREATE TABLE `saved_payment_methods` (
  `id` int(11) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `type` enum('stripe','payme','apple_pay','google_pay') NOT NULL DEFAULT 'stripe',
  `stripe_payment_method_id` varchar(100) DEFAULT NULL,
  `stripe_customer_id` varchar(100) DEFAULT NULL,
  `card_brand` varchar(20) DEFAULT NULL,
  `card_last4` varchar(4) DEFAULT NULL,
  `card_exp_month` int(11) DEFAULT NULL,
  `card_exp_year` int(11) DEFAULT NULL,
  `payme_phone_number` varchar(20) DEFAULT NULL,
  `payme_account_name` varchar(100) DEFAULT NULL,
  `google_pay_token` text DEFAULT NULL,
  `apple_pay_token` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `saved_payment_methods`
--

INSERT INTO `saved_payment_methods` (`id`, `user_id`, `type`, `stripe_payment_method_id`, `stripe_customer_id`, `card_brand`, `card_last4`, `card_exp_month`, `card_exp_year`, `payme_phone_number`, `payme_account_name`, `google_pay_token`, `apple_pay_token`, `is_default`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(7, '18', 'stripe', 'pm_1RWk7xR7t1xjLkoPBFLN1AHa', 'cus_SRdMjKL4V6jlEC', 'visa', '4242', 4, 2032, NULL, NULL, NULL, NULL, 1, 1, '2025-06-05 20:11:11', '2025-06-05 20:11:11', NULL),
(8, '26', 'stripe', 'pm_1RXzmaR7t1xjLkoPbbJZGCoN', 'cus_SSvd2jiGRHUh4w', 'visa', '4242', 11, 2032, NULL, NULL, NULL, NULL, 1, 1, '2025-06-09 07:06:14', '2025-06-09 07:06:14', NULL),
(9, '27', 'stripe', 'pm_1RY0epR7t1xjLkoPSVF8ydCN', 'cus_SSwWeqiIGlj5SM', 'visa', '4242', 4, 2029, NULL, NULL, NULL, NULL, 1, 1, '2025-06-09 08:02:17', '2025-06-09 08:02:17', NULL),
(10, '28', 'stripe', 'pm_1RYB9iR7t1xjLkoPMQR0F0sN', 'cus_ST7JJyUzfMJPEc', 'visa', '4242', 2, 2043, NULL, NULL, NULL, NULL, 0, 1, '2025-06-09 19:14:51', '2025-06-09 22:26:57', '2025-06-09 22:26:02'),
(11, '28', 'stripe', 'pm_1RYE9cR7t1xjLkoPenvBycqP', 'cus_ST7JJyUzfMJPEc', 'visa', '4242', 5, 2055, NULL, NULL, NULL, NULL, 1, 1, '2025-06-09 22:26:57', '2025-06-09 22:26:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20240321000000-create-founders.js'),
('20240328_update_users_phone_verification.js'),
('20240329_add_email_verification_fields.js'),
('20240528_add_phone_verification_columns.js'),
('20240528_create_projects_table.js'),
('20240529_add_email_verification_fields.js'),
('20240529_create_backers_table.js'),
('20240529_create_investments_table.js'),
('20240530_add_phone_verification_columns.js'),
('20240530_create_projects_table.js'),
('20240531_create_investments_table.js'),
('20240531_init_schema.js'),
('20240601_add_verification_fields.js'),
('20240630_add_referral_system.js'),
('20241129_create_auto_invest_table.js'),
('20241201_add_investment_columns.js'),
('20241201_add_signup_verification_fields.js'),
('20250528-add-field-verification-columns.js'),
('20250528-add-phone-change-columns.js'),
('20250529164930-add-investment-preferences.js'),
('20250529170000-add-2fa-fields.js'),
('20250529192403-create-wallet-tables.js'),
('add-blockchain-fields-to-transactions.js');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wallet_id` int(11) NOT NULL,
  `auto_invest_plan_id` int(11) DEFAULT NULL,
  `type` enum('deposit','withdrawal','reward','investment','rent_payout','referral_bonus') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` enum('USD','EUR','TND') NOT NULL,
  `status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
  `description` varchar(255) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `balance_type` enum('cash','rewards') NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `auto_reinvest_plan_id` int(11) DEFAULT NULL,
  `tx_hash` varchar(255) DEFAULT NULL COMMENT 'Blockchain transaction hash',
  `blockchain_hash` varchar(66) DEFAULT NULL COMMENT 'Blockchain transaction hash',
  `block_number` int(11) DEFAULT NULL COMMENT 'Block number where transaction was mined',
  `gas_used` varchar(20) DEFAULT NULL COMMENT 'Gas used for blockchain transaction',
  `blockchain_status` enum('pending','confirmed','failed') DEFAULT NULL COMMENT 'Blockchain transaction status',
  `contract_address` varchar(42) DEFAULT NULL COMMENT 'Smart contract address if applicable'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `wallet_id`, `auto_invest_plan_id`, `type`, `amount`, `currency`, `status`, `description`, `reference`, `balance_type`, `metadata`, `processed_at`, `created_at`, `updated_at`, `auto_reinvest_plan_id`, `tx_hash`, `blockchain_hash`, `block_number`, `gas_used`, `blockchain_status`, `contract_address`) VALUES
(1, 18, 3, NULL, 'deposit', 5000.00, 'TND', 'completed', 'Deposit via Visa ••••4242 04/2032', 'DEP_1749154382274_STRIPE', 'cash', NULL, '2025-06-05 20:13:10', '2025-06-05 20:13:10', '2025-06-05 20:13:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 18, 3, NULL, 'investment', -3000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-05 20:15:05', '2025-06-05 20:15:05', '2025-06-05 20:15:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 23, 4, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749158516742', 'cash', NULL, '2025-06-05 21:22:01', '2025-06-05 21:22:01', '2025-06-05 21:22:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 23, 4, NULL, 'investment', -10000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-05 21:24:22', '2025-06-05 21:24:22', '2025-06-05 21:24:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 23, 4, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749159953307', 'cash', NULL, '2025-06-05 21:45:58', '2025-06-05 21:45:58', '2025-06-05 21:45:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 23, 4, NULL, 'investment', -8000.00, 'TND', 'completed', 'Investment in Modern Business Center', NULL, 'cash', '{\"projectId\":7,\"investmentType\":\"property\"}', '2025-06-05 21:49:37', '2025-06-05 21:49:37', '2025-06-05 21:49:37', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 23, 4, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749298991238', 'cash', NULL, '2025-06-07 12:23:13', '2025-06-07 12:23:13', '2025-06-07 12:23:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 23, 4, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749299049573', 'cash', NULL, '2025-06-07 12:24:11', '2025-06-07 12:24:11', '2025-06-07 12:24:11', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 23, 4, NULL, 'investment', -10000.00, 'TND', 'completed', 'Investment in Commercial Plaza Downtown', NULL, 'cash', '{\"projectId\":4,\"investmentType\":\"property\"}', '2025-06-07 12:25:33', '2025-06-07 12:25:33', '2025-06-07 12:25:33', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 23, 4, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749299527223', 'cash', NULL, '2025-06-07 12:32:09', '2025-06-07 12:32:09', '2025-06-07 12:32:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 23, 4, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749299599502', 'cash', NULL, '2025-06-07 12:33:21', '2025-06-07 12:33:21', '2025-06-07 12:33:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 23, 4, NULL, 'investment', -5000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-07 12:33:47', '2025-06-07 12:33:47', '2025-06-07 12:33:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 23, 4, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749425367827', 'cash', NULL, '2025-06-08 23:29:31', '2025-06-08 23:29:31', '2025-06-08 23:29:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 23, 4, NULL, 'deposit', 1000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749425954375', 'cash', NULL, '2025-06-08 23:39:17', '2025-06-08 23:39:17', '2025-06-08 23:39:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 23, 4, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749426522271', 'cash', NULL, '2025-06-08 23:48:45', '2025-06-08 23:48:45', '2025-06-08 23:48:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 23, 4, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749427445582', 'cash', NULL, '2025-06-09 00:04:08', '2025-06-09 00:04:08', '2025-06-09 00:04:08', NULL, 'insufficient_balance_19752006b63_23_5obo3z', NULL, NULL, NULL, NULL, NULL),
(17, 26, 7, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749452706972', 'cash', NULL, '2025-06-09 07:05:08', '2025-06-09 07:05:08', '2025-06-09 07:05:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 26, 7, NULL, 'withdrawal', 0.00, 'TND', 'completed', 'Cash withdrawal', NULL, 'cash', NULL, '2025-06-09 07:06:32', '2025-06-09 07:06:32', '2025-06-09 07:06:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 26, 7, NULL, 'deposit', 5000.00, 'TND', 'completed', 'Deposit via Visa ••••4242 11/2032', 'DEP_1749452812679_STRIPE', 'cash', NULL, '2025-06-09 07:06:55', '2025-06-09 07:06:55', '2025-06-09 07:06:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 26, 7, NULL, 'investment', -3000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-09 07:07:49', '2025-06-09 07:07:49', '2025-06-09 07:07:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 27, 8, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749456234312', 'cash', NULL, '2025-06-09 08:03:56', '2025-06-09 08:03:56', '2025-06-09 08:03:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 27, 8, NULL, 'investment', -3000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-09 08:08:43', '2025-06-09 08:08:43', '2025-06-09 08:08:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 3, 9, NULL, 'deposit', 5000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749492145675', 'cash', NULL, '2025-06-09 18:02:25', '2025-06-09 18:02:25', '2025-06-09 18:02:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 3, 9, NULL, 'investment', -3000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-09 18:06:55', '2025-06-09 18:06:55', '2025-06-09 18:06:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, 28, 10, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749496240224', 'cash', NULL, '2025-06-09 19:10:40', '2025-06-09 19:10:40', '2025-06-09 19:10:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 28, 10, NULL, 'investment', -3000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-09 19:12:56', '2025-06-09 19:12:56', '2025-06-09 19:12:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 28, 10, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749498472758', 'cash', NULL, '2025-06-09 19:47:52', '2025-06-09 19:47:52', '2025-06-09 19:47:52', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 28, 10, NULL, 'investment', -17000.00, 'TND', 'completed', 'Investment in Seaside Resort Villas', NULL, 'cash', '{\"projectId\":6,\"investmentType\":\"property\"}', '2025-06-09 21:49:24', '2025-06-09 21:49:24', '2025-06-09 21:49:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 28, 10, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749505864057', 'cash', NULL, '2025-06-09 21:51:03', '2025-06-09 21:51:03', '2025-06-09 21:51:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 28, 10, NULL, 'investment', -8000.00, 'TND', 'completed', 'Investment in Modern Business Center', NULL, 'cash', '{\"projectId\":7,\"investmentType\":\"property\"}', '2025-06-09 22:08:05', '2025-06-09 22:08:05', '2025-06-09 22:08:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 28, 10, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749507783742', 'cash', NULL, '2025-06-09 22:23:03', '2025-06-09 22:23:03', '2025-06-09 22:23:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 28, 10, NULL, 'investment', -10000.00, 'TND', 'completed', 'Investment in Commercial Plaza Downtown', NULL, 'cash', '{\"projectId\":4,\"investmentType\":\"property\"}', '2025-06-09 22:34:10', '2025-06-09 22:34:10', '2025-06-09 22:34:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749517146511', 'cash', NULL, '2025-06-10 00:59:04', '2025-06-10 00:59:04', '2025-06-10 00:59:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 32, 11, NULL, 'investment', -2500.00, 'TND', 'completed', 'Investment in Student Housing Complex', NULL, 'cash', '{\"projectId\":8,\"investmentType\":\"property\"}', '2025-06-10 00:59:45', '2025-06-10 00:59:45', '2025-06-10 00:59:45', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 32, 11, NULL, 'deposit', 1222.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749517404970', 'cash', NULL, '2025-06-10 01:03:23', '2025-06-10 01:03:23', '2025-06-10 01:03:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 32, 11, NULL, 'investment', -5000.00, 'TND', 'completed', 'Investment in Luxury Marina Apartments', NULL, 'cash', '{\"projectId\":3,\"investmentType\":\"property\"}', '2025-06-10 01:33:24', '2025-06-10 01:33:24', '2025-06-10 01:33:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749519657693', 'cash', NULL, '2025-06-10 01:40:56', '2025-06-10 01:40:56', '2025-06-10 01:40:56', NULL, NULL, '0xcc904f6ec110e19057a99f0193600f1a43687eb7174581a3d9abae449bf39ee8', 17120655, '23679', 'confirmed', NULL),
(42, 32, 11, NULL, 'investment', -5000.00, 'TND', 'completed', 'Investment in Student Housing Complex', NULL, 'cash', '{\"projectId\":8,\"investmentType\":\"property\"}', '2025-06-10 01:52:13', '2025-06-10 01:52:13', '2025-06-10 01:52:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 32, 11, NULL, 'investment', -5000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-10 01:53:02', '2025-06-10 01:53:02', '2025-06-10 01:53:02', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749520549405', 'cash', NULL, '2025-06-10 01:55:47', '2025-06-10 01:55:47', '2025-06-10 01:55:47', NULL, NULL, '0x1ccd5d14e6eec08ef5ecc15738be87d18ffaf4d9d2c15964ee1008f186c55f2e', 17409385, '27842', 'confirmed', NULL),
(45, 32, 11, NULL, 'investment', -5000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-10 02:06:11', '2025-06-10 02:06:11', '2025-06-10 02:06:11', NULL, NULL, '0x0f91549c4622e6f74ad837757fe43acf8d96eb7f90adcc3ddf7e5c41d5b9f437', 17876411, '26396', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(46, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749521594223', 'cash', NULL, '2025-06-10 02:13:12', '2025-06-10 02:13:12', '2025-06-10 02:13:12', NULL, NULL, '0x55c49f483feb95a178fb4df4c4e403484e23d134d9a40406ed7f1a816d6a1a0a', 17872358, '70888', 'confirmed', NULL),
(47, 32, 11, NULL, 'investment', -10000.00, 'TND', 'completed', 'Investment in Commercial Plaza Downtown', NULL, 'cash', '{\"projectId\":4,\"investmentType\":\"property\"}', '2025-06-10 02:13:41', '2025-06-10 02:13:41', '2025-06-10 02:13:41', NULL, NULL, '0x086969afb68d029a1743a5097e477df4486284a242c3d1d1b0589003f86871e5', 17376829, '70079', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(48, 32, 11, NULL, 'investment', -5000.00, 'TND', 'completed', 'Investment in Luxury Marina Apartments', NULL, 'cash', '{\"projectId\":3,\"investmentType\":\"property\"}', '2025-06-10 02:18:23', '2025-06-10 02:18:23', '2025-06-10 02:18:23', NULL, NULL, '0xe32a2ea20403c3130dd3d57112738412b2261d2687432318737f7cd6bd030b33', 17898877, '68859', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(49, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749522204440', 'cash', NULL, '2025-06-10 02:23:22', '2025-06-10 02:23:22', '2025-06-10 02:23:22', NULL, NULL, '0x6b19e7e84de195137b4d13afb2eb2612dc999e0410cf16ebd683a8cdf3b64675', 17473023, '59116', 'confirmed', NULL),
(50, 32, 11, NULL, 'investment', -8000.00, 'TND', 'completed', 'Investment in Modern Business Center', NULL, 'cash', '{\"projectId\":7,\"investmentType\":\"property\"}', '2025-06-10 02:29:04', '2025-06-10 02:29:04', '2025-06-10 02:29:04', NULL, NULL, '0x9484cd9cfe000b160235f65798d395a5e96b9388195db3e71d5489d7809cab25', 17158476, '33472', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(51, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749542235210', 'cash', NULL, '2025-06-10 07:57:13', '2025-06-10 07:57:13', '2025-06-10 07:57:13', NULL, NULL, '0xe9fe5f83f23c0f11add8998435246578b048e352bbc4a59a41aef2967285c35f', 17919241, '45672', 'confirmed', NULL),
(52, 32, 11, NULL, 'investment', -15000.00, 'TND', 'completed', 'Investment in Seaside Resort Villas', NULL, 'cash', '{\"projectId\":6,\"investmentType\":\"property\"}', '2025-06-10 08:00:08', '2025-06-10 08:00:08', '2025-06-10 08:00:08', NULL, NULL, '0xeb071f3cc9167effe5352efb710c9c37c2745b436810a60d65f868d1613e5d4b', 17488254, '32598', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(53, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749542796586', 'cash', NULL, '2025-06-10 08:06:34', '2025-06-10 08:06:34', '2025-06-10 08:06:34', NULL, NULL, '0x3daeb10a2353b601db3a781002d47a9193c5ebcfdd363bfbfae536acfbddb65a', 17457032, '22786', 'confirmed', NULL),
(54, 33, 12, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749543392652', 'cash', NULL, '2025-06-10 08:16:30', '2025-06-10 08:16:30', '2025-06-10 08:16:30', NULL, NULL, '0x08b2d006c544b570c2e98825b0c0728730b731c0858f46bd0c96b39f75463f97', 17344459, '56647', 'confirmed', NULL),
(55, 32, 11, NULL, 'investment', -10000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-10 08:54:41', '2025-06-10 08:54:41', '2025-06-10 08:54:41', NULL, NULL, '0xa2da947ec167be743228436af057da94e39f5019cba03df92332c5bec38bcbff', 17982935, '22313', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(56, 35, 13, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1749680452483', 'cash', NULL, '2025-06-11 22:20:53', '2025-06-11 22:20:53', '2025-06-11 22:20:53', NULL, NULL, '0x0fdd0f84e750371e48d721329a57bcc92122f8048eb6b33cc75059bebef402c7', 17222082, '61607', 'confirmed', NULL),
(57, 35, 13, NULL, 'investment', -3000.00, 'TND', 'completed', 'Investment in Eco-Friendly Housing Complex', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-11 22:21:22', '2025-06-11 22:21:22', '2025-06-11 22:21:22', NULL, NULL, '0xc3cb5fc5f81c5c6a89c1a677b222cafde069061386cc93842ab71826eb9533d9', 17105477, '59864', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(58, 30, 14, NULL, 'deposit', 111.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1750233354691', 'cash', NULL, '2025-06-18 07:55:55', '2025-06-18 07:55:55', '2025-06-18 07:55:55', NULL, NULL, '0x735e805e98fe2cfc069e8c19f3ed29744b986ede6224389db83527e3cc403687', 17643850, '69734', 'confirmed', NULL),
(59, 32, 11, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1750298283842', 'cash', NULL, '2025-06-19 01:58:04', '2025-06-19 01:58:04', '2025-06-19 01:58:04', NULL, NULL, '0x19226fe55d15ff7bace9b74106d394b10dcf2a0ed58082c1ebbe90d054b22375', 17418818, '23456', 'confirmed', NULL),
(60, 32, 11, NULL, 'investment', -8000.00, 'TND', 'completed', 'Investment in Modern Business Center', NULL, 'cash', '{\"projectId\":7,\"investmentType\":\"property\"}', '2025-06-19 01:59:04', '2025-06-19 01:59:04', '2025-06-19 01:59:04', NULL, NULL, '0xb8f9e395a8c658d4a875d1ce4348110945eb3c04b9b397e2995d1ee2e7b775f4', 17581848, '54087', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(61, 30, 14, NULL, 'deposit', 10000.00, 'TND', 'completed', 'PayMe deposit', 'PAYME_1750658273942', 'cash', NULL, '2025-06-23 05:57:57', '2025-06-23 05:57:57', '2025-06-23 05:57:57', NULL, NULL, '0x799f606b11b92f9646ad05681e5ced60e020c8930256a7634873a98d43ceb4e3', 17769555, '42366', 'confirmed', NULL),
(62, 30, 14, NULL, 'investment', -8000.00, 'TND', 'completed', 'Investment in Modern Business Center', NULL, 'cash', '{\"projectId\":7,\"investmentType\":\"property\"}', '2025-06-23 05:59:02', '2025-06-23 05:59:02', '2025-06-23 05:59:02', NULL, NULL, '0xaaf97d97d1bf853a9f040ff4c2ada4497baff3c2b0f818cd091f3191397756df', 17219573, '31923', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(63, 32, 11, NULL, 'investment', -10000.00, 'TND', 'completed', 'Investment in Blockchain Property Tokenization', NULL, 'cash', '{\"projectId\":5,\"investmentType\":\"property\"}', '2025-06-23 10:32:46', '2025-06-23 10:32:46', '2025-06-23 10:32:46', NULL, NULL, '0x26e555ae50269d5dedac6124267056fb60e44c7da4285d91e82c5db793d6d016', 17556789, '45673', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(64, 32, 11, NULL, 'investment', -15000.00, 'TND', 'completed', 'Investment in Smart Contract Real Estate', NULL, 'cash', '{\"projectId\":6,\"investmentType\":\"property\"}', '2025-06-23 10:32:46', '2025-06-23 10:32:46', '2025-06-23 10:32:46', NULL, NULL, '0xda237019da7be318952a47ba0c69d979888af98c5b99b9bdf35976ca52c9ee98', 17598234, '52847', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(65, 32, 11, NULL, 'investment', -8000.00, 'TND', 'completed', 'Investment in Decentralized Property Fund', NULL, 'cash', '{\"projectId\":7,\"investmentType\":\"property\"}', '2025-06-23 10:32:46', '2025-06-23 10:32:46', '2025-06-23 10:32:46', NULL, NULL, '0x858a5fe6ed161930c7dbd422bbb7f6d100e8f38af45096b83fe0294c25f5d5dc', 17642891, '38965', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6'),
(66, 32, 11, NULL, 'investment', -12000.00, 'TND', 'completed', 'Investment in Tokenized Real Estate Portfolio', NULL, 'cash', '{\"projectId\":4,\"investmentType\":\"property\"}', '2025-06-23 10:32:46', '2025-06-23 10:32:46', '2025-06-23 10:32:46', NULL, NULL, '0x6c217474e836734e3921be0c6dcb58f8f566f1ee2390951b65ff14093cfb270f', 17687452, '41028', 'confirmed', '0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `account_no` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `reset_code` varchar(10) DEFAULT NULL,
  `reset_code_expires` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `role_id` int(11) DEFAULT NULL,
  `approval_status` enum('unverified','pending','approved','rejected') DEFAULT 'unverified',
  `profile_picture` varchar(255) DEFAULT '',
  `cloudinary_public_id` varchar(255) DEFAULT '',
  `expired` tinyint(1) DEFAULT 0,
  `failed_login_attempts` int(11) DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `refresh_token` varchar(500) DEFAULT NULL,
  `refresh_token_expires` datetime DEFAULT NULL,
  `clerk_user_id` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `account_type` varchar(50) DEFAULT 'Individual Account',
  `korpor_since` datetime DEFAULT current_timestamp(),
  `intro` text DEFAULT NULL,
  `investment_used_pct` float DEFAULT 0,
  `investment_total` decimal(15,2) DEFAULT 0.00,
  `global_users` int(11) DEFAULT 0,
  `global_countries` int(11) DEFAULT 0,
  `pending_email` varchar(255) DEFAULT NULL,
  `email_verification_code` varchar(10) DEFAULT NULL,
  `email_verification_expires` datetime DEFAULT NULL,
  `last_email_change` datetime DEFAULT NULL,
  `phone_verification_code` varchar(10) DEFAULT NULL,
  `pending_phone` varchar(32) DEFAULT NULL,
  `verification_code_expires` datetime DEFAULT NULL,
  `last_phone_change` datetime DEFAULT NULL,
  `phone_last_changed` datetime DEFAULT NULL,
  `email_last_changed` datetime DEFAULT NULL,
  `currency` enum('TND','EUR') NOT NULL DEFAULT 'TND',
  `referral_code` varchar(20) DEFAULT NULL,
  `referred_by` int(11) DEFAULT NULL,
  `referral_stats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `investment_preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `investment_preference` enum('all','local') NOT NULL DEFAULT 'all',
  `investment_region` enum('Tunisia','France') NOT NULL DEFAULT 'Tunisia',
  `twoFactorSecret` varchar(128) DEFAULT NULL COMMENT 'Base32 encoded TOTP secret for 2FA',
  `twoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether 2FA is enabled for this user',
  `backupCodes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON array of backup codes for 2FA recovery',
  `twoFactorSetupAt` datetime DEFAULT NULL COMMENT 'Timestamp when 2FA was first set up',
  `investmentTotal` decimal(10,2) DEFAULT 0.00,
  `signup_verification_code` varchar(6) DEFAULT NULL,
  `signup_verification_expires` datetime DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL COMMENT 'Google user ID for OAuth authentication',
  `is_google_user` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Flag indicating if user signed up with Google',
  `photo` varchar(500) DEFAULT NULL COMMENT 'User profile photo URL from Google or uploaded',
  `voice_enabled` tinyint(1) DEFAULT 0 COMMENT 'User preference for voice features',
  `preferred_voice` enum('alloy','echo','fable','onyx','nova','shimmer') DEFAULT 'nova' COMMENT 'Preferred TTS voice',
  `voice_speed` decimal(3,2) DEFAULT 1.00 COMMENT 'Preferred speech speed (0.25-4.00)',
  `voice_language` varchar(10) DEFAULT 'auto' COMMENT 'Preferred language for voice recognition'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `account_no`, `name`, `surname`, `email`, `password`, `birthdate`, `reset_code`, `reset_code_expires`, `is_verified`, `role_id`, `approval_status`, `profile_picture`, `cloudinary_public_id`, `expired`, `failed_login_attempts`, `locked_until`, `last_login`, `refresh_token`, `refresh_token_expires`, `clerk_user_id`, `created_at`, `updated_at`, `phone`, `account_type`, `korpor_since`, `intro`, `investment_used_pct`, `investment_total`, `global_users`, `global_countries`, `pending_email`, `email_verification_code`, `email_verification_expires`, `last_email_change`, `phone_verification_code`, `pending_phone`, `verification_code_expires`, `last_phone_change`, `phone_last_changed`, `email_last_changed`, `currency`, `referral_code`, `referred_by`, `referral_stats`, `investment_preferences`, `investment_preference`, `investment_region`, `twoFactorSecret`, `twoFactorEnabled`, `backupCodes`, `twoFactorSetupAt`, `investmentTotal`, `signup_verification_code`, `signup_verification_expires`, `google_id`, `is_google_user`, `photo`, `voice_enabled`, `preferred_voice`, `voice_speed`, `voice_language`) VALUES
(1, NULL, 'wbhqha', 'wbahhs', 'mouhamedaminkraiem088@gmail.com', '$2a$10$7ntwO15dhJyVrmrz412CYeidqrgRmBSfFjqoBtBwTAAzgGdeSFWzS', NULL, NULL, NULL, 1, NULL, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, 'sua_2y2nHMYXeuvz0oThiZKn5C9qqp1', '2025-06-04 12:50:48', '2025-06-04 12:50:48', '+216 29453228', 'Individual Account', '2025-06-04 12:50:48', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', 'A8560E4B', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(2, NULL, 'chcu', 'cjfhf', 'khaldi.@gmail.com', '$2a$10$o2J6MDpur/BHMAdFL/vYzepdZhee6nviOYBoS7umfHH7N1ckGKMFe', NULL, NULL, NULL, 1, NULL, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, 'sua_2y2oBF6FqVUdvQT2G4JRf3vncRA', '2025-06-04 12:58:13', '2025-06-04 12:58:13', '+216 229453228', 'Individual Account', '2025-06-04 12:58:13', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '91EC4939', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(3, NULL, 'shsjsj', 'sbjsha', 'hmidamohamedghassen1@gmail.com', '$2a$10$7EWhMKiyVMqwTzKhPCQQMO8f8F2hr7KicgYmo2CbuuviFFFXOY60m', NULL, NULL, NULL, 0, NULL, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, 'sua_2y2pCFNm1W0xQ39OMFNtPecYxxv', '2025-06-04 13:06:34', '2025-06-09 18:06:55', '+216 29453228', 'Individual Account', '2025-06-04 13:06:34', NULL, 0, 3000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '49C6C285', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, '8790', '2025-06-04 13:16:34', NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(4, NULL, 'sjsjs', 'bshs', 'abdouisgay69@gmail.com', '$2a$10$2xR/4T1idM.AwAhJXu09t.8kaKIWImv/zIWf9FrbtVEGTK/4o93Fy', NULL, NULL, NULL, 0, NULL, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, 'sua_2y2pkmjQMoq1i6GTi3vcaqD80g8', '2025-06-04 13:11:09', '2025-06-04 13:11:09', '+216 29453228', 'Individual Account', '2025-06-04 13:11:09', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '9EE066B0', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, '2451', '2025-06-04 13:21:09', NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(5, NULL, 'gajab', 'sbsj', 'mouhamedaminkraiem059@gmail.com', '$2a$10$K6/q7XrRVCXp63/jlIiQmenI3Xn2pPFbG2XdrSkJLAaO4ieFVtqAa', NULL, NULL, NULL, 1, NULL, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 13:17:49', '2025-06-04 13:18:05', '+216 29453228', 'Individual Account', '2025-06-04 13:17:49', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '362562', NULL, '2025-06-04 13:28:05', NULL, NULL, NULL, 'TND', '8A5D1214', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(6, NULL, '3hw', 'sbeue', 'mouhamedaminkraiem085@gmail.com', '$2a$10$splBy3iV.s3I6eqonP7OMO8KHvf9sCu9kI/izMd1LmgidEK5.HYEe', NULL, NULL, NULL, 1, NULL, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 13:20:32', '2025-06-04 13:20:45', '+216 29453228', 'Individual Account', '2025-06-04 13:20:32', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '583951', NULL, '2025-06-04 13:30:45', NULL, NULL, NULL, 'TND', 'D1EA6B53', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(7, NULL, 'hyg', 'fyf', 'mouhamedamink84raiem08@gmail.com5', '$2a$10$WnHHzrt7Wt5I8vba8hada.2pWld/os4UmxNsRr7FoM9GZlPU.6IFa', NULL, NULL, NULL, 1, NULL, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 13:26:53', '2025-06-04 13:27:09', '+216 29453228', 'Individual Account', '2025-06-04 13:26:53', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '439744', NULL, '2025-06-04 13:37:09', NULL, NULL, NULL, 'TND', '894FE0FA', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(8, NULL, 'shsh', 'sbsj', 'mouhamedaminkraiem508@gmail.com', '$2a$10$DaXHVW3vdvQQlWCDMCfZL.hoWAAwWtCb3pBO.8p3kDvlKRHCPLcuK', NULL, NULL, NULL, 1, NULL, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 13:31:04', '2025-06-04 13:31:16', '+216 29453228', 'Individual Account', '2025-06-04 13:31:04', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '576829', NULL, '2025-06-04 13:41:16', NULL, NULL, NULL, 'TND', '6351B38E', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(9, NULL, 'hqhw', 'bdsj', 'mouhamedamin555kraiem08@gmail.com', '$2a$10$j01LI61W4ZObAigpxfIQ0O/q/1wz67nTUTY2NIDgYS.OpPOz4fmS6', NULL, NULL, NULL, 1, NULL, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 13:34:07', '2025-06-04 13:34:27', '+216 29453228', 'Individual Account', '2025-06-04 13:34:07', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '579834', NULL, '2025-06-04 13:44:27', NULL, NULL, NULL, 'TND', '55146506', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(10, NULL, 'Mouhamedamin', '', 'mouhamedaminkraiem509@gmail.com', '$2a$10$tCzsmWl5s2p6jA8HFZ6xCORwp2HE3MMmCW8xAE1tA5qXVIfiqhgRm', NULL, NULL, NULL, 1, 4, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 14:10:06', '2025-06-04 14:10:20', '+216 29453228', 'Individual Account', '2025-06-04 14:10:06', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '292789', NULL, '2025-06-04 14:20:20', NULL, NULL, NULL, 'TND', '89F68D18', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(11, NULL, 'Kejrb', '', 'mouhamedaminkraiem087@gmail.com', '$2a$10$JuCr6zI1FNI7Fekfw6mfM.3eoJc13bkzjfhqz8kQrnrx9H2vU5qZm', NULL, NULL, NULL, 1, 4, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 14:12:12', '2025-06-04 14:12:25', '+216 29453228', 'Individual Account', '2025-06-04 14:12:12', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '600100', NULL, '2025-06-04 14:22:25', NULL, NULL, NULL, 'TND', '90B40D62', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(12, NULL, 'Kejrb', '', 'mouhamedaminkraiem109@gmail.com', '$2a$10$jCgtkEOfxOEBhEeEhz21XOv9pLmEt4VPPD6uyCJsBljGLFCIMPSNq', NULL, NULL, NULL, 1, 4, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 14:26:08', '2025-06-04 14:26:20', '+216 29453228', 'Individual Account', '2025-06-04 14:26:08', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '200219', NULL, '2025-06-04 14:36:20', NULL, NULL, NULL, 'TND', '9825818D', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(13, NULL, 'Jhfhj', '', 'mouhamedaminkraiem095@gmail.com', '$2a$10$N1FRWS6Ky1Qyr.tWATCKN.o5DTTf94tePE1ctoYGzzbCOVfZH9jGy', NULL, NULL, NULL, 1, 4, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 14:29:10', '2025-06-04 14:29:25', '+216 29453228', 'Individual Account', '2025-06-04 14:29:10', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '298642', NULL, '2025-06-04 14:39:25', NULL, NULL, NULL, 'TND', '0B7CA77C', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(14, NULL, 'Jhfhj', '', 'mouhamedaminkraiem1509@gmail.com', '$2a$10$OhrJzyQyH6blFLiBViZ0YuTINGPZVObCpsRxmi1CtF1JknEqSrLDC', NULL, NULL, NULL, 1, 4, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 14:35:39', '2025-06-04 14:35:52', '+216 29453228', 'Individual Account', '2025-06-04 14:35:39', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '404476', NULL, '2025-06-04 14:45:52', NULL, NULL, NULL, 'TND', 'E34FC4AA', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(15, NULL, 'Jhfhj', '', 'mouhamedaminkraie5465m09@gmail.com', '$2a$10$L76O40bOZ2lglRsea2H9t.BbIazI2ALmsM7JiKWs4tg4G8.guieXC', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-04 14:41:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5MDQ4MDkyLCJleHAiOjE3NDk2NTI4OTJ9.bibr7K0ul4yyhNyTBxIsoavhr-EbFhAoZEGaqX3jYUk', '2025-06-11 14:41:32', NULL, '2025-06-04 14:38:16', '2025-06-04 14:41:32', '+216 29453228', 'Individual Account', '2025-06-04 14:38:16', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '578383', NULL, '2025-06-04 14:48:28', NULL, NULL, NULL, 'TND', '63165839', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(16, NULL, 'Uvc', '', 'mouhamedaminkraiem0598@gmail.com', '$2a$10$Zx/yt.iK5nVEOvDI5MHbm.9XQu3v1yPQ4QiaPYEis7dKDhJqTdZ/q', NULL, NULL, NULL, 1, 4, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-04 14:48:34', '2025-06-04 14:48:49', '+216 29453228', 'Individual Account', '2025-06-04 14:48:34', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '328762', NULL, '2025-06-04 14:58:49', NULL, NULL, NULL, 'TND', '43F6D1E5', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(17, NULL, 'Uvc', '', 'mouhamedaminkraiem009@gmail.com', '$2a$10$epkevlwQVheQ6oQqQHuRj.6lg1Wo/SGGzq.9/DWAjIdtUbNFJZezu', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-04 21:14:13', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5MDcxNjUzLCJleHAiOjE3NDk2NzY0NTN9.meHiaPjLH_mPC4hR1rO-DJ3eDQlwFtgwMSg8FoKdTIw', '2025-06-11 21:14:13', NULL, '2025-06-04 14:59:29', '2025-06-04 21:14:13', '+216 29453228', 'Individual Account', '2025-06-04 14:59:29', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '3D663490', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(18, NULL, 'Youssef', '', 'foussi090@gmail.com', '$2a$10$wwLqvEVi/lBrVOqPu/e2Zu7LLaoNOlJ4QxPWxt4NlRE7.naFi6IOu', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-05 20:07:39', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5MTU0MDU5LCJleHAiOjE3NDk3NTg4NTl9._wZpPckfc_1zL9DKllu6hMY3nE_G8I6KIqMFveojCrM', '2025-06-12 20:07:39', NULL, '2025-06-05 20:05:18', '2025-06-05 20:15:05', '+21629453228', 'Individual Account', '2025-06-05 20:05:18', NULL, 0, 3000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '3814C499', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(19, NULL, 'Mouhamedamin', '', 'mouhamedaminkraiemt09@gmail.com', '$2a$10$KfrRxnwDIuvQGi4D7DTQze0Wkf3WrHPGbrG5LWPZOSmSjZ3WfsPKi', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-05 20:24:56', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5MTU1MDk2LCJleHAiOjE3NDk3NTk4OTZ9.UZKcid1gnxwMvS1-a3Ga_ngt5FnT0HgrrUiuzgGfa5s', '2025-06-12 20:24:56', NULL, '2025-06-05 20:24:12', '2025-06-05 20:24:56', '+21629453228', 'Individual Account', '2025-06-05 20:24:12', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '02CF42AF', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(20, NULL, 'Mouhamedamin', '', 'mouhamedaminkraiem4409@gmail.com', '$2a$10$mz5HxbF2iIfuhwRKRtQ2KewcxkXswby/G786.JqQnzS4Ynhy2whEG', NULL, NULL, NULL, 0, 4, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-05 21:02:39', '2025-06-05 21:02:39', '+21629453228', 'Individual Account', '2025-06-05 21:02:39', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '91DC50B4', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, '3761', '2025-06-05 21:12:39', NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(21, NULL, 'Mouhamedamin', '', 'mouhamedami855nkraiem09@gmail.com', '$2a$10$XUdYvklsp53KgN4gMOltmudwBJjYB2OZ98D1A7lDiPsNAZEbf7Ypq', NULL, NULL, NULL, 0, 4, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-05 21:07:29', '2025-06-05 21:07:29', '+21629453228', 'Individual Account', '2025-06-05 21:07:29', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', 'A8BE9104', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, '2385', '2025-06-05 21:17:29', NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(22, NULL, 'Mouhamedamin', '', 'mouhamedaminkrai49em09@gmail.com', '$2a$10$k.bKYjo4PIROjkwkKhQOLuzNLlsqPsZy9.wel.aq8a12G/8Rne1P6', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-05 21:09:25', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5MTU3NzY1LCJleHAiOjE3NDk3NjI1NjV9.nvsyMQlqxQJm7fmIVhayh82vyQT5A9NladYI8J265hI', '2025-06-12 21:09:25', NULL, '2025-06-05 21:08:58', '2025-06-05 21:09:25', '+21629453228', 'Individual Account', '2025-06-05 21:08:58', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', 'E60ED307', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(23, NULL, 'Mouhamedamin', '', 'mouhamedaminkr55aiem09@gmail.com', '$2a$10$zNZyWVni1j4xKnvCc.o8mu31EVA0EutSG9N4m5BSv7jq7JAJvIjVC', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-08 23:28:20', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5NDMxOTgzLCJleHAiOjE3NTAwMzY3ODN9.GftXJCCBFvT2miN6oX2-vKt1RX7Yf-DLne9UL473kRk', '2025-06-15 23:28:20', NULL, '2025-06-05 21:13:45', '2025-06-09 01:19:43', '+21629453228', 'Individual Account', '2025-06-05 21:13:45', NULL, 0, 33000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EUR', '2B6E63BA', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(24, NULL, 'Mouhamedamin', '', 'mouhameda54minkraiem08@gmail.com', '$2a$10$8RFFLJyDFNo5dZ6E2tQR6.McO0/d3utpreQn6AMiP766vpMSvPIRe', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-06 19:41:56', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5Mjk4NjExLCJleHAiOjE3NDk5MDM0MTF9.Wq6Loqn3YEyrZBhfSHgj1SFRe5tcPkmMK3ZEAGvqgzc', '2025-06-13 19:41:56', NULL, '2025-06-06 19:41:18', '2025-06-07 12:16:51', '+21629453228', 'Individual Account', '2025-06-06 19:41:18', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '6A519A3C', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(25, NULL, 'Mouhamed', '', 'medaminkra954iem101@gmail.com', '$2a$10$suMx75eEHp9HjYP9tdwwze6oCj8cVSciPlzXtwFnrqs95aEY/QfIa', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-09 01:23:43', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5NDMyMjIzLCJleHAiOjE3NTAwMzcwMjN9.GNnHEklgc1J5RPEeEWt2GqVOiADQKyZyfBNaFFibdBU', '2025-06-16 01:23:43', NULL, '2025-06-09 01:22:13', '2025-06-09 01:23:43', '+21629453228', 'Individual Account', '2025-06-09 01:22:13', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '6F9DF295', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(26, NULL, 'Mskdjd', '', 'medaminkraiem101@gmail.com', '$2a$10$P1FeYyTD/KorW7fF5vfuN.W4nRhH37VXzzn56gO56f6zUqKV40zua', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-09 07:21:25', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5NDUzNjg1LCJleHAiOjE3NTAwNTg0ODV9.djOPNEvCENND5Vtg7XIPN-aJNefKuvy7FkSkoESMAbI', '2025-06-16 07:21:25', NULL, '2025-06-09 07:04:12', '2025-06-09 07:21:25', '+21629453228', 'Individual Account', '2025-06-09 07:04:12', NULL, 0, 3000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EUR', 'AEA9928B', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'local', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(27, NULL, 'Marwa', '', 'thabetmarwa2@gmail.com', '$2a$10$i9WWMQNQAYjEXQ4HltdUWOxdCdI.0/zEAsulSDQH/1s3grl9Gc1Tu', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-09 07:55:08', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI3LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5NDU1NzA4LCJleHAiOjE3NTAwNjA1MDh9.14lXKaBfHoTncKbGXaE63Smm8vYsogX9n74nGUP0VGE', '2025-06-16 07:55:08', NULL, '2025-06-09 07:52:40', '2025-06-09 08:20:38', '+21629453228', 'Individual Account', '2025-06-09 07:52:40', NULL, 0, 3000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EUR', 'D495E662', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(28, NULL, 'Khaldi', 'Assil', 'khaldi.rfe12@gmail.com', '$2a$10$bF9D4KOKv1IMrh.n4UsSnOsVkbcpgUPnd2eOP5UbTff.DndEN54VO', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-09 22:32:46', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI4LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5NTA4MzY2LCJleHAiOjE3NTAxMTMxNjZ9.yjQsCQVKKKpX9koQN2b9YbcRsN5_HJ1__YXuNpcGzys', '2025-06-16 22:32:46', NULL, '2025-06-09 19:07:51', '2025-06-09 22:34:10', '+21658868269', 'Individual Account', '2025-06-09 19:07:51', NULL, 0, 38000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EUR', 'DFCC0A33', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', 'MVQTEQL2O5XU4PRXPJFV25KGMQXFQSS5KJEFQI2WEE5FQOTLHZAA', 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(29, NULL, 'Mouhamed Amine Kraiem', NULL, 'mouhamedaminkraiem09@gmail.com', '$2a$10$zbdwqpa8C9lu4h6s9xtjN.jWN641JGB2GPDus7qsGDLK2AtxEWdDq', NULL, NULL, NULL, 1, 2, 'approved', '', '', 0, 2, NULL, NULL, NULL, NULL, NULL, '2025-06-09 22:38:54', '2025-06-10 00:13:24', '+21629453228', 'Individual Account', '2025-06-09 22:38:54', NULL, 0, 5000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', NULL, NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(30, NULL, 'ahmed', 'jaziri', 'ahmedjaziri41@gmail.com', '$2a$10$8NP4WhctYlNhPDO4xsWp0./yyvPajZfpMH5TiNuM3HicOH.NX51aa', NULL, NULL, NULL, 1, 1, 'approved', '', '', 0, 1, NULL, '2025-06-23 09:11:04', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzUwNjY5ODY0LCJleHAiOjE3NTEyNzQ2NjR9.Ao4cTDLE3Q7Ae-Y9Z9vLwfkyEFmJuDwiuf1kAxY2NHg', '2025-06-30 09:11:04', NULL, '2025-06-09 23:03:26', '2025-06-23 09:11:04', NULL, 'Individual Account', '2025-06-09 23:03:26', NULL, 0, 8000.00, 0, 0, NULL, '924109', NULL, NULL, NULL, NULL, '2025-06-18 22:56:51', NULL, NULL, NULL, 'TND', 'D06FF7A6', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(31, NULL, 'assil', 'khaldi', 'khaldi.assi@gmail.com', '$2a$10$qIu30eB3bs1a1FcEBHSI9.M0WvjDt92LFz9r0BGaecAb8PKg.HBs2', NULL, NULL, NULL, 1, 2, 'approved', '', '', 0, 2, '2025-06-10 01:01:19', '2025-06-09 23:17:54', NULL, NULL, NULL, '2025-06-09 23:10:27', '2025-06-10 02:04:57', NULL, 'Individual Account', '2025-06-09 23:10:27', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '5582F356', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(32, NULL, 'Khaldi', 'Assil', 'ahmedjaziri51@gmail.com', '$2a$10$WhP9C.kL50elL7EEDRM/h.x8GEtD96msYfYT8XrxoC2mJ/P4KpuQu', NULL, NULL, NULL, 1, 3, 'approved', '', '', 0, 1, NULL, '2025-06-22 11:24:17', NULL, NULL, NULL, '2025-06-10 00:56:30', '2025-06-22 11:26:21', '+21658613572', 'Individual Account', '2025-06-10 00:56:30', NULL, 0, 78500.00, 0, 0, NULL, '304263', NULL, NULL, NULL, NULL, '2025-06-18 23:34:05', NULL, NULL, NULL, 'TND', '9B1A448F', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(33, NULL, 'Khaldi', 'Assil', 'kha0@gmail.com', '$2a$10$.1GRx0bor57D02SmQdxRa.hYTNPgP6/mdR4sF4jlxE23AA5IVrurW', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 0, NULL, '2025-06-10 08:14:17', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5NTQzMjU3LCJleHAiOjE3NTAxNDgwNTd9.DulJ_7z9gHAdhxSAixfWo95HE-RVKjW5SZFWDBSd-Cg', '2025-06-17 08:14:17', NULL, '2025-06-10 08:13:52', '2025-06-10 08:14:17', '+21658868269', 'Individual Account', '2025-06-10 08:13:52', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '048EDAC2', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(34, NULL, 'Khaldi', 'Assil', 'kha@gmail.com', '$2a$10$/EkWUeUKOGDkQ2ANftwohuHgOFYDrL4QnWTs1puU1H4kZzNtYguRi', NULL, NULL, NULL, 0, 4, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-10 08:59:16', '2025-06-10 08:59:16', '+21658868269', 'Individual Account', '2025-06-10 08:59:16', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '13A52EFA', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, '5130', '2025-06-10 09:09:16', NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(35, NULL, 'Samir', 'Belaid', 'khaldi.assil40@gmail.com', '$2a$10$8LREGzDBeteXwj4uAx6Duu50EX2nrez4qkPH8j3nThrRW6x/SO.Ea', NULL, NULL, NULL, 1, 4, 'approved', '', '', 0, 1, NULL, '2025-06-11 22:20:12', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM1LCJ0b2tlblR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNzQ5NjgwNDEyLCJleHAiOjE3NTAyODUyMTJ9.Q-JMA72LULV2uIIWaIIZEq6-CLljU1JkTEoZ1F-K4hQ', '2025-06-18 22:20:12', NULL, '2025-06-10 10:07:25', '2025-06-12 00:37:12', '+21658868269', 'Individual Account', '2025-06-10 10:07:25', NULL, 0, 3000.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '79C6E8BA', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(36, NULL, 'ahmedjazir', 'jazoro', 'ahmedjaziri411@gmail.com', '$2a$10$ckq5mBJ7EhrJLMyslstvDedsNyzIIv1OeTZ9CaQKRWM/1BEQGz.vi', NULL, NULL, NULL, 1, 4, 'pending', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-18 22:10:51', '2025-06-18 22:17:13', '+1234567890', 'Individual Account', '2025-06-18 22:10:51', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, '971735', NULL, '2025-06-18 22:27:13', NULL, NULL, NULL, 'TND', '4715A762', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(37, NULL, 'Test', 'User', 'test@example.com', '$2a$10$jeIRRE3Ysu5NLwNKVYf4ruOz7bBtUW0RbayB/pGNBg9de9h.l.sPK', NULL, NULL, NULL, 0, 4, 'unverified', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-18 22:28:03', '2025-06-18 22:28:49', '+1234567890', 'Individual Account', '2025-06-18 22:28:03', NULL, 0, 0.00, 0, 0, NULL, '1446', NULL, NULL, NULL, NULL, '2025-06-18 22:38:49', NULL, NULL, NULL, 'TND', '39855C1F', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, '6501', '2025-06-18 22:38:03', NULL, 0, NULL, 0, 'nova', 1.00, 'auto'),
(38, NULL, 'ahmed', 'jaziri admin', 'ahmed.archimatch@gmail.com', '$2a$10$fPyxnywLSnsHzrLv1FYIzu9CTq2rvtQiaV7cwVvKixeNSJE65KvoK', NULL, NULL, NULL, 1, 2, 'approved', '', '', 0, 0, NULL, NULL, NULL, NULL, NULL, '2025-06-22 11:22:46', '2025-06-22 11:23:18', NULL, 'Individual Account', '2025-06-22 11:22:46', NULL, 0, 0.00, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'TND', '3FB6C75D', NULL, '{\"totalReferred\":0,\"totalInvested\":0,\"totalEarned\":0}', NULL, 'all', 'Tunisia', NULL, 0, NULL, NULL, 0.00, NULL, NULL, NULL, 0, NULL, 0, 'nova', 1.00, 'auto');

-- --------------------------------------------------------

--
-- Table structure for table `verifications`
--

CREATE TABLE `verifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `identity_status` enum('pending','under_review','approved','rejected') DEFAULT 'pending',
  `passport_image_url` varchar(255) DEFAULT NULL,
  `selfie_image_url` varchar(255) DEFAULT NULL,
  `identity_submitted_at` datetime DEFAULT NULL,
  `identity_reviewed_at` datetime DEFAULT NULL,
  `identity_rejection_reason` text DEFAULT NULL,
  `address_status` enum('pending','under_review','approved','rejected') DEFAULT 'pending',
  `address_image_url` varchar(255) DEFAULT NULL,
  `address_submitted_at` datetime DEFAULT NULL,
  `address_reviewed_at` datetime DEFAULT NULL,
  `address_rejection_reason` text DEFAULT NULL,
  `overall_status` enum('incomplete','under_review','verified','rejected') DEFAULT 'incomplete',
  `backoffice_request_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verifications`
--

INSERT INTO `verifications` (`id`, `user_id`, `identity_status`, `passport_image_url`, `selfie_image_url`, `identity_submitted_at`, `identity_reviewed_at`, `identity_rejection_reason`, `address_status`, `address_image_url`, `address_submitted_at`, `address_reviewed_at`, `address_rejection_reason`, `overall_status`, `backoffice_request_id`, `created_at`, `updated_at`) VALUES
(3, NULL, 'under_review', 'https://res.cloudinary.com/df3nh7akd/image/upload/v1749037872/verifications/identity/passport_3_1749037872705.jpg', 'https://res.cloudinary.com/df3nh7akd/image/upload/v1749037874/verifications/identity/selfie_3_1749037874100.jpg', '2025-06-04 11:51:15', NULL, NULL, 'under_review', 'https://res.cloudinary.com/df3nh7akd/image/upload/v1749037911/verifications/address/address_3_1749037908181.jpg', '2025-06-04 11:51:53', NULL, NULL, 'incomplete', NULL, '2025-06-04 11:51:15', '2025-06-04 11:51:53'),
(4, 27, 'under_review', 'https://res.cloudinary.com/df3nh7akd/image/upload/v1749455830/verifications/identity/passport_27_1749455829258.jpg', 'https://res.cloudinary.com/df3nh7akd/image/upload/v1749455832/verifications/identity/selfie_27_1749455831009.jpg', '2025-06-09 07:57:12', NULL, NULL, 'under_review', 'https://res.cloudinary.com/df3nh7akd/image/upload/v1749455961/verifications/address/address_27_1749455959820.jpg', '2025-06-09 07:59:21', NULL, NULL, 'incomplete', NULL, '2025-06-09 07:57:12', '2025-06-09 07:59:21');

-- --------------------------------------------------------

--
-- Table structure for table `voice_files`
--

CREATE TABLE `voice_files` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message_id` int(11) DEFAULT NULL,
  `file_type` enum('audio_input','audio_output') NOT NULL,
  `file_path` varchar(500) NOT NULL COMMENT 'Path to audio file',
  `file_size` int(11) NOT NULL COMMENT 'File size in bytes',
  `duration_seconds` int(11) DEFAULT NULL COMMENT 'Audio duration in seconds',
  `mime_type` varchar(100) NOT NULL,
  `original_filename` varchar(255) DEFAULT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL COMMENT 'Cloudinary ID if using cloud storage',
  `is_temporary` tinyint(1) DEFAULT 1 COMMENT 'Whether file should be auto-deleted',
  `expires_at` timestamp NULL DEFAULT NULL COMMENT 'When temporary file expires',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `voice_files`
--
DELIMITER $$
CREATE TRIGGER `cleanup_expired_voice_files` BEFORE INSERT ON `voice_files` FOR EACH ROW BEGIN
    -- Set expiration time for temporary files (24 hours from now)
    IF NEW.is_temporary = TRUE AND NEW.expires_at IS NULL THEN
        SET NEW.expires_at = DATE_ADD(NOW(), INTERVAL 24 HOUR);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `voice_settings`
--

CREATE TABLE `voice_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `setting_type` enum('string','number','boolean','json') DEFAULT 'string',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voice_settings`
--

INSERT INTO `voice_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'max_audio_file_size', '26214400', 'number', 'Maximum audio file size in bytes (25MB)', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(2, 'max_text_length_tts', '4096', 'number', 'Maximum text length for text-to-speech', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(3, 'default_voice', 'nova', 'string', 'Default TTS voice for new users', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(4, 'default_speech_speed', '1.0', 'number', 'Default speech speed for TTS', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(5, 'voice_features_enabled', 'true', 'boolean', 'Global toggle for voice features', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(6, 'supported_audio_formats', '[\"audio/webm\", \"audio/mp3\", \"audio/wav\", \"audio/ogg\"]', 'json', 'Supported audio file formats', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(7, 'openai_model_whisper', 'whisper-1', 'string', 'OpenAI Whisper model for speech-to-text', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(8, 'openai_model_tts', 'tts-1', 'string', 'OpenAI TTS model for text-to-speech', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(9, 'voice_cache_duration_hours', '24', 'number', 'How long to cache generated voice files', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25'),
(10, 'auto_cleanup_temp_files', 'true', 'boolean', 'Automatically cleanup temporary voice files', 1, '2025-06-22 15:03:25', '2025-06-22 15:03:25');

-- --------------------------------------------------------

--
-- Table structure for table `voice_usage_logs`
--

CREATE TABLE `voice_usage_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  `feature_type` enum('speech_to_text','text_to_speech') NOT NULL,
  `input_size` int(11) DEFAULT NULL COMMENT 'Size of input (audio bytes or text length)',
  `output_size` int(11) DEFAULT NULL COMMENT 'Size of output (text length or audio bytes)',
  `processing_time_ms` int(11) DEFAULT NULL COMMENT 'Processing time in milliseconds',
  `success` tinyint(1) NOT NULL DEFAULT 1,
  `error_message` text DEFAULT NULL,
  `api_cost` decimal(10,6) DEFAULT NULL COMMENT 'Cost of API call',
  `language_detected` varchar(10) DEFAULT NULL COMMENT 'Language detected by speech recognition',
  `confidence_score` decimal(3,2) DEFAULT NULL COMMENT 'Confidence score for recognition',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cash_balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `rewards_balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `currency` enum('USD','EUR','TND') NOT NULL DEFAULT 'TND',
  `last_transaction_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`id`, `user_id`, `cash_balance`, `rewards_balance`, `currency`, `last_transaction_at`, `created_at`, `updated_at`) VALUES
(1, 15, 0.00, 0.00, 'TND', NULL, '2025-06-04 14:41:50', '2025-06-04 14:41:50'),
(2, 17, 0.00, 0.00, 'TND', NULL, '2025-06-04 15:03:51', '2025-06-04 15:03:51'),
(3, 18, 2000.00, 0.00, 'TND', '2025-06-05 20:15:05', '2025-06-05 20:07:50', '2025-06-05 20:15:05'),
(4, 23, 17000.03, 0.00, 'TND', '2025-06-09 00:04:08', '2025-06-05 21:14:18', '2025-06-09 00:04:08'),
(5, 24, 0.00, 0.00, 'TND', NULL, '2025-06-06 19:53:01', '2025-06-06 19:53:01'),
(6, 25, 0.00, 0.00, 'TND', NULL, '2025-06-09 01:41:00', '2025-06-09 01:41:00'),
(7, 26, 2000.00, 0.00, 'TND', '2025-06-09 07:07:49', '2025-06-09 07:04:45', '2025-06-09 07:07:49'),
(8, 27, 2000.00, 0.00, 'TND', '2025-06-09 08:08:43', '2025-06-09 08:00:21', '2025-06-09 08:08:43'),
(9, 3, 2000.00, 0.00, 'TND', '2025-06-09 18:06:55', '2025-06-09 18:01:54', '2025-06-09 18:06:55'),
(10, 28, 1796.50, 0.00, 'TND', '2025-06-09 22:34:10', '2025-06-09 19:09:32', '2025-06-09 22:34:10'),
(11, 32, 2214.00, 0.00, 'TND', '2025-06-19 01:59:04', '2025-06-10 00:58:33', '2025-06-19 01:59:04'),
(12, 33, 10000.00, 0.00, 'TND', '2025-06-10 08:16:30', '2025-06-10 08:15:14', '2025-06-10 08:16:30'),
(13, 35, 7000.00, 0.00, 'TND', '2025-06-11 22:21:22', '2025-06-11 22:19:18', '2025-06-11 22:21:22'),
(14, 30, 2111.00, 0.00, 'TND', '2025-06-23 05:59:02', '2025-06-18 07:54:23', '2025-06-23 05:59:02');

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `transaction_type` enum('deposit','withdrawal','refund') NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'TND',
  `status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
  `user_address` varchar(100) NOT NULL,
  `payme_token` varchar(100) DEFAULT NULL,
  `payme_order_id` varchar(100) DEFAULT NULL,
  `payme_transaction_id` int(11) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `withdrawal_id` varchar(100) DEFAULT NULL,
  `fees` decimal(15,2) DEFAULT 0.00,
  `net_amount` decimal(15,2) DEFAULT NULL,
  `bank_account_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `received_amount` decimal(15,2) DEFAULT NULL,
  `transaction_fee` decimal(15,2) DEFAULT NULL,
  `webhook_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `blockchain_hash` varchar(66) DEFAULT NULL COMMENT 'Blockchain transaction hash',
  `block_number` int(11) DEFAULT NULL COMMENT 'Block number where transaction was mined',
  `blockchain_status` enum('pending','confirmed','failed') DEFAULT NULL COMMENT 'Blockchain transaction status'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet_transactions`
--

INSERT INTO `wallet_transactions` (`id`, `transaction_id`, `transaction_type`, `payment_method`, `amount`, `currency`, `status`, `user_address`, `payme_token`, `payme_order_id`, `payme_transaction_id`, `customer_email`, `customer_phone`, `customer_name`, `withdrawal_id`, `fees`, `net_amount`, `bank_account_info`, `received_amount`, `transaction_fee`, `webhook_data`, `completed_at`, `created_at`, `updated_at`, `blockchain_hash`, `block_number`, `blockchain_status`) VALUES
(1, 'd528735fa774de8ec7eca358c7cdaaee', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', 'd528735fa774de8ec7eca358c7cdaaee', 'deposit_1749158486806_q7e5ar', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-05 22:21:27', '2025-06-05 22:21:27', NULL, NULL, NULL),
(2, '3eaf5524a60caa169b97299e6b07886d', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '3eaf5524a60caa169b97299e6b07886d', 'deposit_1749158550956_xe96pe', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'Mouhamedamin Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-05 22:22:32', '2025-06-05 22:22:32', NULL, NULL, NULL),
(3, '984e0a7996aeae956793b8967cd3e122', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '984e0a7996aeae956793b8967cd3e122', 'deposit_1749159945414_qpqlzg', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-05 22:45:45', '2025-06-05 22:45:45', NULL, NULL, NULL),
(4, '59658d0145a4b82298b162970ab2bf62', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '59658d0145a4b82298b162970ab2bf62', 'deposit_1749298683070_pw86zx', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-07 13:18:04', '2025-06-07 13:18:04', NULL, NULL, NULL),
(5, 'ac4a9d1b78f8d6a99d6b46977726ed52', 'deposit', 'payme', 5555.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', 'ac4a9d1b78f8d6a99d6b46977726ed52', 'deposit_1749298713686_s10jgr', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-07 13:18:34', '2025-06-07 13:18:34', NULL, NULL, NULL),
(6, 'e2253ac98deeb5bcbffe321c9e168c1a', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', 'e2253ac98deeb5bcbffe321c9e168c1a', 'deposit_1749298979790_rhmrjq', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-07 13:23:00', '2025-06-07 13:23:00', NULL, NULL, NULL),
(7, '24e5feeaf07adb688cee309b94964bfe', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '24e5feeaf07adb688cee309b94964bfe', 'deposit_1749299040909_71cvmm', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-07 13:24:01', '2025-06-07 13:24:01', NULL, NULL, NULL),
(8, '81d498d89235bd986c3deef9caf0b1fb', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '81d498d89235bd986c3deef9caf0b1fb', 'deposit_1749299517089_gc93ki', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-07 13:31:57', '2025-06-07 13:31:57', NULL, NULL, NULL),
(9, '1a39c626e5c416e26dca8d7be245851f', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '1a39c626e5c416e26dca8d7be245851f', 'deposit_1749299585225_tqcbv7', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-07 13:33:06', '2025-06-07 13:33:06', NULL, NULL, NULL),
(10, '52c247aabe34d957b2e49ba4ab567176', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '52c247aabe34d957b2e49ba4ab567176', 'deposit_1749425332390_qn391c', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 00:28:52', '2025-06-09 00:28:52', NULL, NULL, NULL),
(11, '74f21771afe412d7bdbc0f0b3be103e3', 'deposit', 'payme', 1000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '74f21771afe412d7bdbc0f0b3be103e3', 'deposit_1749425944990_hjx2tz', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 00:39:05', '2025-06-09 00:39:05', NULL, NULL, NULL),
(12, '362d6c0542ef5d3987b2ae0924e764a0', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', '362d6c0542ef5d3987b2ae0924e764a0', 'deposit_1749426511856_ka237h', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 00:48:32', '2025-06-09 00:48:32', NULL, NULL, NULL),
(13, 'f63cc0aee411dbfc01cd0b7cf0fcec24', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x6c327b0e00000000000000000000000000000000', 'f63cc0aee411dbfc01cd0b7cf0fcec24', 'deposit_1749427439448_ess30g', NULL, 'mouhamedaminkraiem09@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 01:03:59', '2025-06-09 01:03:59', NULL, NULL, NULL),
(14, 'eb682dc173d8acf75267b67c10754d9e', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x131a5e0800000000000000000000000000000000', 'eb682dc173d8acf75267b67c10754d9e', 'deposit_1749452699714_p8x0wy', NULL, 'medaminkraiem101@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 08:05:00', '2025-06-09 08:05:00', NULL, NULL, NULL),
(15, '39ea85d69f1e7f9d77f8d2caa403d04c', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x0f98c87900000000000000000000000000000000', '39ea85d69f1e7f9d77f8d2caa403d04c', 'deposit_1749456207166_bnauth', NULL, 'thabetmarwa2@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-09 09:03:27', '2025-06-09 09:03:27', NULL, NULL, NULL),
(16, 'db4bfffd49ceeb0adf712aa2ab081f52', 'deposit', 'payme', 5000.00, 'TND', 'pending', '0x12380ea300000000000000000000000000000000', 'db4bfffd49ceeb0adf712aa2ab081f52', 'deposit_1749492131234_gzrnfv', NULL, 'hmidamohamedghassen1@gmail.com', '+216 29453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 07:02:11', '2025-06-10 07:02:11', NULL, NULL, NULL),
(17, '04ed45da9287664f29972f18ad3ab0b8', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x7a0e759700000000000000000000000000000000', '04ed45da9287664f29972f18ad3ab0b8', 'deposit_1749496227794_tk6034', NULL, 'khaldi.assil40@gmail.com', '+21658868269', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 08:10:28', '2025-06-10 08:10:28', NULL, NULL, NULL),
(18, '953773a68ef5dd33bebb5327cffd161b', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x7a0e759700000000000000000000000000000000', '953773a68ef5dd33bebb5327cffd161b', 'deposit_1749498452174_rdgwfa', NULL, 'khaldi.assil40@gmail.com', '+21658868269', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 08:47:32', '2025-06-10 08:47:32', NULL, NULL, NULL),
(19, '2883be9b4ab67cb502aca788a2b710be', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x7a0e759700000000000000000000000000000000', '2883be9b4ab67cb502aca788a2b710be', 'deposit_1749505841770_tpy470', NULL, 'khaldi.assil40@gmail.com', '+21658868269', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 10:50:42', '2025-06-10 10:50:42', NULL, NULL, NULL),
(20, 'withdraw_1749505988987_qteysu', 'withdrawal', 'payme', 200.00, 'TND', 'pending', '0x7a0e759700000000000000000000000000000000', NULL, NULL, NULL, 'khaldi.assil40@gmail.com', '+21658868269', 'User Account', 'withdraw_1749505988987_qteysu', 3.50, 200.00, '{\"account_number\":\"11111111\",\"bank_name\":\"Jj\",\"account_holder\":\"Jj\"}', NULL, NULL, NULL, NULL, '2025-06-10 10:53:08', '2025-06-10 10:53:08', NULL, NULL, NULL),
(21, 'c46728971a37850efd97d0a4a67a83b3', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x7a0e759700000000000000000000000000000000', 'c46728971a37850efd97d0a4a67a83b3', 'deposit_1749507760889_tm4wjf', NULL, 'khaldi.assil40@gmail.com', '+21658868269', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 11:22:41', '2025-06-10 11:22:41', NULL, NULL, NULL),
(22, 'f0ad9c0ca9c4abf6b0c0a8b1479a3a80', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', 'f0ad9c0ca9c4abf6b0c0a8b1479a3a80', 'deposit_1749517129653_kmtgmr', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 13:58:49', '2025-06-10 13:58:49', NULL, NULL, NULL),
(23, 'withdraw_1749517252225_rzbfns', 'withdrawal', 'payme', 500.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', NULL, NULL, NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', 'withdraw_1749517252225_rzbfns', 8.00, 500.00, '{\"account_number\":\"111111\",\"bank_name\":\"Hb\",\"account_holder\":\"Bb\"}', NULL, NULL, NULL, NULL, '2025-06-10 14:00:52', '2025-06-10 14:00:52', NULL, NULL, NULL),
(24, 'f2eee54b9c0e3679492300ee8bb3510b', 'deposit', 'payme', 3500.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', 'f2eee54b9c0e3679492300ee8bb3510b', 'deposit_1749517341215_25a317', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'Khaldi Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 14:02:22', '2025-06-10 14:02:22', NULL, NULL, NULL),
(25, 'c356666ad4f6daca1ee438b258a5081e', 'deposit', 'payme', 1222.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', 'c356666ad4f6daca1ee438b258a5081e', 'deposit_1749517395104_7bq2w3', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 14:03:15', '2025-06-10 14:03:15', NULL, NULL, NULL),
(26, 'a48a806775f2dbe2692d872733f21178', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', 'a48a806775f2dbe2692d872733f21178', 'deposit_1749519620674_tvogx2', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 14:40:20', '2025-06-10 14:40:20', NULL, NULL, NULL),
(27, '9fa12826259e9181f9e4f023d7c20096', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', '9fa12826259e9181f9e4f023d7c20096', 'deposit_1749519649222_68g0uw', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 14:40:49', '2025-06-10 14:40:49', NULL, NULL, NULL),
(28, '937a2e0678890b1701deb3b98f969178', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', '937a2e0678890b1701deb3b98f969178', 'deposit_1749520540699_ym1l5f', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 14:55:40', '2025-06-10 14:55:40', NULL, NULL, NULL),
(29, '291409c55e2d4893c4d679e0884a994e', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', '291409c55e2d4893c4d679e0884a994e', 'deposit_1749521584461_qffx4k', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 15:13:04', '2025-06-10 15:13:04', NULL, NULL, NULL),
(30, '988fff1d881114ab5a56f0c0c69e0cfe', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', '988fff1d881114ab5a56f0c0c69e0cfe', 'deposit_1749522193212_i36p2b', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 15:23:13', '2025-06-10 15:23:13', NULL, NULL, NULL),
(31, 'b6a5b153d530bec79e0d31e07d60a9b8', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', 'b6a5b153d530bec79e0d31e07d60a9b8', 'deposit_1749542224483_5y5mbr', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 20:57:04', '2025-06-10 20:57:04', NULL, NULL, NULL),
(32, 'fef30dc904979d70213ed4c220efbd77', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', 'fef30dc904979d70213ed4c220efbd77', 'deposit_1749542787972_fyo08y', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 21:06:28', '2025-06-10 21:06:28', NULL, NULL, NULL),
(33, '6bdd0ee0df75a67faa567e0a8752d3d8', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x55df194300000000000000000000000000000000', '6bdd0ee0df75a67faa567e0a8752d3d8', 'deposit_1749543364224_k6g85w', NULL, 'khaldi.assil40@gmail.com', '+21658868269', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 21:16:04', '2025-06-10 21:16:04', NULL, NULL, NULL),
(34, '86981f9bd9d2741335bc1a8a04e2a6c0', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x522c730500000000000000000000000000000000', '86981f9bd9d2741335bc1a8a04e2a6c0', 'deposit_1749680438460_ecu7uq', NULL, 'khaldi.assil40@gmail.com', '+21658868269', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 11:20:38', '2025-06-12 11:20:38', NULL, NULL, NULL),
(35, 'ec2fd5cc6ec44e485f9eaad4dd0257be', 'deposit', 'payme', 111.00, 'TND', 'pending', '0x31ddb66000000000000000000000000000000000', 'ec2fd5cc6ec44e485f9eaad4dd0257be', 'deposit_1750233331867_tp59e0', NULL, 'ahmedjaziri41@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-18 08:55:32', '2025-06-18 08:55:32', NULL, NULL, NULL),
(36, 'b22992fcf247bf076e035a1e64922ab4', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x21cb76ff00000000000000000000000000000000', 'b22992fcf247bf076e035a1e64922ab4', 'deposit_1750298261822_nr2l08', NULL, 'ahmedjaziri51@gmail.com', '+21658613572', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-19 02:57:42', '2025-06-19 02:57:42', NULL, NULL, NULL),
(37, 'a14a56d5ed67b4e291585827c2bca9aa', 'deposit', 'payme', 10000.00, 'TND', 'pending', '0x31ddb66000000000000000000000000000000000', 'a14a56d5ed67b4e291585827c2bca9aa', 'deposit_1750658253308_0xy2pd', NULL, 'ahmedjaziri41@gmail.com', '+21629453228', 'User Account', NULL, 0.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 06:57:33', '2025-06-23 06:57:33', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_role_permissions`
--
ALTER TABLE `ai_role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_table` (`role_id`,`table_name`),
  ADD KEY `idx_permissions_role_id` (`role_id`),
  ADD KEY `idx_permissions_role_table_ops` (`role_id`,`table_name`,`allowed_operations`(100));

--
-- Indexes for table `ai_usage_logs`
--
ALTER TABLE `ai_usage_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usage_user_id` (`user_id`),
  ADD KEY `idx_usage_role_id` (`user_role_id`),
  ADD KEY `idx_usage_conversation_id` (`conversation_id`),
  ADD KEY `idx_usage_created_at` (`created_at`),
  ADD KEY `idx_usage_query_hash` (`query_hash`),
  ADD KEY `idx_usage_user_role_date` (`user_id`,`user_role_id`,`created_at`),
  ADD KEY `idx_usage_access_granted` (`access_granted`,`created_at`),
  ADD KEY `idx_usage_response_time` (`response_time_ms`);

--
-- Indexes for table `auto_invest_plans`
--
ALTER TABLE `auto_invest_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `auto_reinvest_plans`
--
ALTER TABLE `auto_reinvest_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `backers`
--
ALTER TABLE `backers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_backers_order` (`order`);

--
-- Indexes for table `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversations_user_id` (`user_id`),
  ADD KEY `idx_conversations_created_at` (`created_at`),
  ADD KEY `idx_conversations_user_created` (`user_id`,`created_at`);

--
-- Indexes for table `conversation_messages`
--
ALTER TABLE `conversation_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_messages_conversation_id` (`conversation_id`),
  ADD KEY `idx_messages_created_at` (`created_at`),
  ADD KEY `idx_messages_conversation_role` (`conversation_id`,`role`),
  ADD KEY `idx_conversation_messages_audio` (`audio_url`,`voice_enabled`);

--
-- Indexes for table `founders`
--
ALTER TABLE `founders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investments`
--
ALTER TABLE `investments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_investments_user_id` (`user_id`),
  ADD KEY `idx_investments_project_id` (`project_id`),
  ADD KEY `idx_investments_user_address` (`user_address`),
  ADD KEY `idx_investments_status` (`status`),
  ADD KEY `idx_investments_transaction_id` (`transaction_id`),
  ADD KEY `idx_investments_project_amount` (`project_id`,`amount`,`status`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_id` (`payment_id`),
  ADD KEY `idx_payment_id` (`payment_id`),
  ADD KEY `idx_user_address` (`user_address`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_stripe_payment_intent` (`stripe_payment_intent_id`),
  ADD KEY `idx_saved_payment_method` (`saved_payment_method_id`),
  ADD KEY `idx_crypto_tx` (`crypto_tx_hash`),
  ADD KEY `idx_payme_token` (`payme_token`),
  ADD KEY `idx_payme_order_id` (`payme_order_id`),
  ADD KEY `idx_customer_email` (`customer_email`),
  ADD KEY `idx_payments_user_status_method` (`user_id`,`status`,`payment_method`,`created_at`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_project_status` (`status`),
  ADD KEY `idx_featured` (`featured`),
  ADD KEY `idx_projects_funding_status` (`current_amount`,`status`,`featured`),
  ADD KEY `idx_projects_roi_yield` (`expected_roi`,`rental_yield`);

--
-- Indexes for table `project_documents`
--
ALTER TABLE `project_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `project_documents_project_id` (`project_id`),
  ADD KEY `project_documents_document_type` (`document_type`);

--
-- Indexes for table `property_images`
--
ALTER TABLE `property_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_images_project_id` (`project_id`),
  ADD KEY `property_images_is_primary` (`is_primary`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_referrals_referrer_id` (`referrer_id`),
  ADD KEY `idx_referrals_referee_id` (`referee_id`);

--
-- Indexes for table `rental_payouts`
--
ALTER TABLE `rental_payouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `reinvest_transaction_id` (`reinvest_transaction_id`),
  ADD KEY `auto_reinvest_plan_id` (`auto_reinvest_plan_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `saved_payment_methods`
--
ALTER TABLE `saved_payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_stripe_payment_method` (`stripe_payment_method_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_stripe_payment_method` (`stripe_payment_method_id`),
  ADD KEY `idx_stripe_customer` (`stripe_customer_id`),
  ADD KEY `idx_user_default` (`user_id`,`is_default`),
  ADD KEY `idx_active` (`is_active`),
  ADD KEY `idx_deleted` (`deleted_at`),
  ADD KEY `idx_user_active_methods` (`user_id`,`is_active`,`deleted_at`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_blockchain_hash_idx` (`blockchain_hash`),
  ADD KEY `transactions_user_id` (`user_id`),
  ADD KEY `transactions_wallet_id` (`wallet_id`),
  ADD KEY `transactions_type` (`type`),
  ADD KEY `transactions_status` (`status`),
  ADD KEY `transactions_created_at` (`created_at`),
  ADD KEY `idx_transactions_auto_invest_plan_id` (`auto_invest_plan_id`),
  ADD KEY `idx_transaction_auto_reinvest` (`auto_reinvest_plan_id`),
  ADD KEY `transactions_blockchain_status_idx` (`blockchain_status`),
  ADD KEY `idx_transactions_user_type_status` (`user_id`,`type`,`status`,`created_at`),
  ADD KEY `idx_transactions_amount_currency` (`amount`,`currency`,`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `account_no` (`account_no`),
  ADD UNIQUE KEY `referral_code` (`referral_code`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `idx_users_referral_code` (`referral_code`),
  ADD KEY `idx_users_referred_by` (`referred_by`),
  ADD KEY `idx_users_role_approval` (`role_id`,`approval_status`,`created_at`),
  ADD KEY `idx_users_investment_stats` (`investment_total`,`currency`,`investment_preference`),
  ADD KEY `idx_users_voice_prefs` (`voice_enabled`,`preferred_voice`);

--
-- Indexes for table `verifications`
--
ALTER TABLE `verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `voice_files`
--
ALTER TABLE `voice_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_message_id` (`message_id`),
  ADD KEY `idx_file_type` (`file_type`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `idx_is_temporary` (`is_temporary`);

--
-- Indexes for table `voice_settings`
--
ALTER TABLE `voice_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_setting_key` (`setting_key`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `voice_usage_logs`
--
ALTER TABLE `voice_usage_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_conversation_id` (`conversation_id`),
  ADD KEY `idx_feature_type` (`feature_type`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `message_id` (`message_id`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_wallets_balance_currency` (`cash_balance`,`rewards_balance`,`currency`),
  ADD KEY `idx_wallets_user_balance` (`user_id`,`cash_balance`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_id` (`transaction_id`),
  ADD KEY `wallet_transactions_transaction_id_idx` (`transaction_id`),
  ADD KEY `wallet_transactions_user_address_idx` (`user_address`),
  ADD KEY `wallet_transactions_payme_token_idx` (`payme_token`),
  ADD KEY `wallet_transactions_type_idx` (`transaction_type`),
  ADD KEY `wallet_transactions_status_idx` (`status`),
  ADD KEY `wallet_transactions_created_at_idx` (`created_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_role_permissions`
--
ALTER TABLE `ai_role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `ai_usage_logs`
--
ALTER TABLE `ai_usage_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `auto_invest_plans`
--
ALTER TABLE `auto_invest_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `auto_reinvest_plans`
--
ALTER TABLE `auto_reinvest_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `backers`
--
ALTER TABLE `backers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `conversation_messages`
--
ALTER TABLE `conversation_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `founders`
--
ALTER TABLE `founders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investments`
--
ALTER TABLE `investments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `project_documents`
--
ALTER TABLE `project_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_images`
--
ALTER TABLE `property_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rental_payouts`
--
ALTER TABLE `rental_payouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `saved_payment_methods`
--
ALTER TABLE `saved_payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `verifications`
--
ALTER TABLE `verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `voice_files`
--
ALTER TABLE `voice_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `voice_settings`
--
ALTER TABLE `voice_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `voice_usage_logs`
--
ALTER TABLE `voice_usage_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_role_permissions`
--
ALTER TABLE `ai_role_permissions`
  ADD CONSTRAINT `fk_permissions_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_usage_logs`
--
ALTER TABLE `ai_usage_logs`
  ADD CONSTRAINT `fk_usage_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_usage_role_id` FOREIGN KEY (`user_role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_usage_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `auto_invest_plans`
--
ALTER TABLE `auto_invest_plans`
  ADD CONSTRAINT `auto_invest_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `auto_reinvest_plans`
--
ALTER TABLE `auto_reinvest_plans`
  ADD CONSTRAINT `auto_reinvest_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `fk_conversations_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversation_messages`
--
ALTER TABLE `conversation_messages`
  ADD CONSTRAINT `fk_messages_conversation_id` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `investments`
--
ALTER TABLE `investments`
  ADD CONSTRAINT `investments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `investments_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `investments_transaction_id_foreign_idx` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`);

--
-- Constraints for table `project_documents`
--
ALTER TABLE `project_documents`
  ADD CONSTRAINT `project_documents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_documents_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `property_images`
--
ALTER TABLE `property_images`
  ADD CONSTRAINT `property_images_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `referrals`
--
ALTER TABLE `referrals`
  ADD CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referee_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `rental_payouts`
--
ALTER TABLE `rental_payouts`
  ADD CONSTRAINT `rental_payouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rental_payouts_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rental_payouts_ibfk_3` FOREIGN KEY (`reinvest_transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rental_payouts_ibfk_4` FOREIGN KEY (`auto_reinvest_plan_id`) REFERENCES `auto_reinvest_plans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transaction_auto_reinvest` FOREIGN KEY (`auto_reinvest_plan_id`) REFERENCES `auto_reinvest_plans` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_transactions_auto_invest_plan` FOREIGN KEY (`auto_invest_plan_id`) REFERENCES `auto_invest_plans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`wallet_id`) REFERENCES `wallets` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_referred_by_foreign_idx` FOREIGN KEY (`referred_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `verifications`
--
ALTER TABLE `verifications`
  ADD CONSTRAINT `verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `voice_files`
--
ALTER TABLE `voice_files`
  ADD CONSTRAINT `voice_files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `voice_files_ibfk_2` FOREIGN KEY (`message_id`) REFERENCES `conversation_messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `voice_usage_logs`
--
ALTER TABLE `voice_usage_logs`
  ADD CONSTRAINT `voice_usage_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `voice_usage_logs_ibfk_2` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `voice_usage_logs_ibfk_3` FOREIGN KEY (`message_id`) REFERENCES `conversation_messages` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
