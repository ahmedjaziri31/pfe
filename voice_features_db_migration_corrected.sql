-- =============================================
-- VOICE FEATURES DATABASE MIGRATION (CORRECTED)
-- =============================================

-- 1. Add voice-related columns to existing conversation_messages table
ALTER TABLE `conversation_messages` 
ADD COLUMN `audio_url` VARCHAR(500) NULL COMMENT 'URL to audio file if message has voice',
ADD COLUMN `audio_duration` INT NULL COMMENT 'Duration of audio in seconds',
ADD COLUMN `voice_enabled` BOOLEAN DEFAULT FALSE COMMENT 'Whether voice was enabled for this message',
ADD COLUMN `transcription_confidence` DECIMAL(3,2) NULL COMMENT 'Confidence score for speech-to-text (0.00-1.00)';

-- 2. Add voice preferences to users table
ALTER TABLE `users` 
ADD COLUMN `voice_enabled` BOOLEAN DEFAULT FALSE COMMENT 'User preference for voice features',
ADD COLUMN `preferred_voice` ENUM('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer') DEFAULT 'nova' COMMENT 'Preferred TTS voice',
ADD COLUMN `voice_speed` DECIMAL(3,2) DEFAULT 1.00 COMMENT 'Preferred speech speed (0.25-4.00)',
ADD COLUMN `voice_language` VARCHAR(10) DEFAULT 'auto' COMMENT 'Preferred language for voice recognition';

-- 3. Create voice_usage_logs table for analytics
CREATE TABLE `voice_usage_logs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `conversation_id` INT NULL,
  `message_id` INT NULL,
  `feature_type` ENUM('speech_to_text', 'text_to_speech') NOT NULL,
  `input_size` INT NULL COMMENT 'Size of input (audio bytes or text length)',
  `output_size` INT NULL COMMENT 'Size of output (text length or audio bytes)',
  `processing_time_ms` INT NULL COMMENT 'Processing time in milliseconds',
  `success` BOOLEAN NOT NULL DEFAULT TRUE,
  `error_message` TEXT NULL,
  `api_cost` DECIMAL(10,6) NULL COMMENT 'Cost of API call',
  `language_detected` VARCHAR(10) NULL COMMENT 'Language detected by speech recognition',
  `confidence_score` DECIMAL(3,2) NULL COMMENT 'Confidence score for recognition',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_conversation_id` (`conversation_id`),
  INDEX `idx_feature_type` (`feature_type`),
  INDEX `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`message_id`) REFERENCES `conversation_messages`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create voice_files table for managing audio files
CREATE TABLE `voice_files` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `message_id` INT NULL,
  `file_type` ENUM('audio_input', 'audio_output') NOT NULL,
  `file_path` VARCHAR(500) NOT NULL COMMENT 'Path to audio file',
  `file_size` INT NOT NULL COMMENT 'File size in bytes',
  `duration_seconds` INT NULL COMMENT 'Audio duration in seconds',
  `mime_type` VARCHAR(100) NOT NULL,
  `original_filename` VARCHAR(255) NULL,
  `cloudinary_public_id` VARCHAR(255) NULL COMMENT 'Cloudinary ID if using cloud storage',
  `is_temporary` BOOLEAN DEFAULT TRUE COMMENT 'Whether file should be auto-deleted',
  `expires_at` TIMESTAMP NULL COMMENT 'When temporary file expires',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_message_id` (`message_id`),
  INDEX `idx_file_type` (`file_type`),
  INDEX `idx_expires_at` (`expires_at`),
  INDEX `idx_is_temporary` (`is_temporary`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`message_id`) REFERENCES `conversation_messages`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Update ai_usage_logs table to include voice features
ALTER TABLE `ai_usage_logs` 
ADD COLUMN `feature_type` ENUM('chat', 'backoffice', 'speech_to_text', 'text_to_speech', 'voice_chat') DEFAULT 'chat' COMMENT 'Type of AI feature used',
ADD COLUMN `voice_enabled` BOOLEAN DEFAULT FALSE COMMENT 'Whether voice was used in this interaction',
ADD COLUMN `audio_duration` INT NULL COMMENT 'Duration of audio processing in seconds',
ADD COLUMN `processing_time_ms` INT NULL COMMENT 'Total processing time in milliseconds';

-- 6. Create voice_settings table for system-wide voice configuration
CREATE TABLE `voice_settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `setting_type` ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  `description` TEXT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_setting_key` (`setting_key`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Insert default voice settings
INSERT INTO `voice_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('max_audio_file_size', '26214400', 'number', 'Maximum audio file size in bytes (25MB)'),
('max_text_length_tts', '4096', 'number', 'Maximum text length for text-to-speech'),
('default_voice', 'nova', 'string', 'Default TTS voice for new users'),
('default_speech_speed', '1.0', 'number', 'Default speech speed for TTS'),
('voice_features_enabled', 'true', 'boolean', 'Global toggle for voice features'),
('supported_audio_formats', '["audio/webm", "audio/mp3", "audio/wav", "audio/ogg"]', 'json', 'Supported audio file formats'),
('openai_model_whisper', 'whisper-1', 'string', 'OpenAI Whisper model for speech-to-text'),
('openai_model_tts', 'tts-1', 'string', 'OpenAI TTS model for text-to-speech'),
('voice_cache_duration_hours', '24', 'number', 'How long to cache generated voice files'),
('auto_cleanup_temp_files', 'true', 'boolean', 'Automatically cleanup temporary voice files');

-- 8. Add voice permissions to ai_role_permissions table (CORRECTED)
-- Note: role_id values: 1=superadmin, 2=admin, 3=agent, 4=user (based on existing data)

-- Voice permissions for voice_usage_logs table
INSERT INTO `ai_role_permissions` (`role_id`, `table_name`, `allowed_columns`, `denied_columns`, `where_conditions`, `max_rows`, `allowed_operations`) VALUES
(1, 'voice_usage_logs', '[\"*\"]', NULL, NULL, NULL, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]'),
(2, 'voice_usage_logs', '[\"id\", \"user_id\", \"feature_type\", \"success\", \"processing_time_ms\", \"language_detected\", \"created_at\"]', '[\"error_message\", \"api_cost\"]', NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]'),
(3, 'voice_usage_logs', '[\"id\", \"user_id\", \"feature_type\", \"success\", \"created_at\"]', '[\"error_message\", \"api_cost\", \"processing_time_ms\"]', '[{\"field\": \"user_id\", \"operator\": \"=\", \"value\": \"USER_ID\"}]', 100, '[\"SELECT\", \"COUNT\", \"ORDER BY\"]'),
(4, 'voice_usage_logs', NULL, '[\"*\"]', NULL, 0, '[]');

-- Voice permissions for voice_files table
INSERT INTO `ai_role_permissions` (`role_id`, `table_name`, `allowed_columns`, `denied_columns`, `where_conditions`, `max_rows`, `allowed_operations`) VALUES
(1, 'voice_files', '[\"*\"]', NULL, NULL, NULL, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]'),
(2, 'voice_files', '[\"id\", \"user_id\", \"file_type\", \"file_size\", \"duration_seconds\", \"created_at\"]', '[\"file_path\", \"cloudinary_public_id\"]', NULL, 1000, '[\"SELECT\", \"COUNT\", \"SUM\", \"AVG\", \"GROUP BY\", \"ORDER BY\"]'),
(3, 'voice_files', '[\"id\", \"user_id\", \"file_type\", \"duration_seconds\", \"created_at\"]', '[\"file_path\", \"cloudinary_public_id\", \"file_size\"]', '[{\"field\": \"user_id\", \"operator\": \"=\", \"value\": \"USER_ID\"}]', 50, '[\"SELECT\", \"COUNT\", \"ORDER BY\"]'),
(4, 'voice_files', NULL, '[\"*\"]', NULL, 0, '[]');

-- Voice permissions for voice_settings table
INSERT INTO `ai_role_permissions` (`role_id`, `table_name`, `allowed_columns`, `denied_columns`, `where_conditions`, `max_rows`, `allowed_operations`) VALUES
(1, 'voice_settings', '[\"*\"]', NULL, NULL, NULL, '[\"SELECT\", \"COUNT\", \"GROUP BY\", \"ORDER BY\"]'),
(2, 'voice_settings', '[\"setting_key\", \"setting_value\", \"setting_type\", \"description\", \"is_active\"]', NULL, '[{\"field\": \"is_active\", \"operator\": \"=\", \"value\": true}]', 50, '[\"SELECT\", \"COUNT\", \"ORDER BY\"]'),
(3, 'voice_settings', '[\"setting_key\", \"setting_value\", \"description\"]', NULL, '[{\"field\": \"is_active\", \"operator\": \"=\", \"value\": true}, {\"field\": \"setting_key\", \"operator\": \"IN\", \"value\": [\"voice_features_enabled\", \"supported_audio_formats\", \"max_audio_file_size\"]}]', 10, '[\"SELECT\"]'),
(4, 'voice_settings', NULL, '[\"*\"]', NULL, 0, '[]');

-- 9. Update existing conversation_messages permissions to include voice columns
-- Superadmin: Full access (already has "*")
-- Admin: Add voice columns to allowed columns
UPDATE `ai_role_permissions` 
SET `allowed_columns` = '[\"id\", \"conversation_id\", \"role\", \"content\", \"created_at\", \"audio_url\", \"audio_duration\", \"voice_enabled\", \"transcription_confidence\"]'
WHERE `role_id` = 2 AND `table_name` = 'conversation_messages';

-- Agent: Limited voice columns
UPDATE `ai_role_permissions` 
SET `allowed_columns` = '[\"id\", \"conversation_id\", \"role\", \"content\", \"created_at\", \"voice_enabled\"]',
    `denied_columns` = '[\"audio_url\", \"transcription_confidence\"]'
WHERE `role_id` = 3 AND `table_name` = 'conversation_messages';

-- 10. Update users table permissions to include voice preferences
-- Admin: Add voice preference columns
UPDATE `ai_role_permissions` 
SET `allowed_columns` = '[\"id\", \"name\", \"surname\", \"email\", \"role_id\", \"approval_status\", \"created_at\", \"updated_at\", \"investment_total\", \"currency\", \"investment_preference\", \"investment_region\", \"voice_enabled\", \"preferred_voice\", \"voice_speed\", \"voice_language\"]'
WHERE `role_id` = 2 AND `table_name` = 'users';

-- Agent: Basic voice info only
UPDATE `ai_role_permissions` 
SET `allowed_columns` = '[\"id\", \"name\", \"surname\", \"email\", \"approval_status\", \"created_at\", \"role_id\", \"voice_enabled\"]',
    `denied_columns` = '[\"password\", \"reset_code\", \"refresh_token\", \"phone\", \"investment_total\", \"phone_verification_code\", \"twoFactorSecret\", \"backupCodes\", \"signup_verification_code\", \"google_id\", \"preferred_voice\", \"voice_speed\", \"voice_language\"]'
WHERE `role_id` = 3 AND `table_name` = 'users';

-- 11. Create indexes for better performance
CREATE INDEX `idx_conversation_messages_audio` ON `conversation_messages` (`audio_url`, `voice_enabled`);
CREATE INDEX `idx_users_voice_prefs` ON `users` (`voice_enabled`, `preferred_voice`);

-- 12. Add triggers for automatic cleanup of temporary voice files
DELIMITER //

CREATE TRIGGER `cleanup_expired_voice_files` 
BEFORE INSERT ON `voice_files`
FOR EACH ROW
BEGIN
    -- Set expiration time for temporary files (24 hours from now)
    IF NEW.is_temporary = TRUE AND NEW.expires_at IS NULL THEN
        SET NEW.expires_at = DATE_ADD(NOW(), INTERVAL 24 HOUR);
    END IF;
END//

DELIMITER ;

-- =============================================
-- INSTALL BACKEND DEPENDENCIES
-- =============================================
-- Run this command in your backend directory:
-- npm install form-data

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the migration:

-- Check conversation_messages columns
-- SHOW COLUMNS FROM conversation_messages LIKE '%voice%';
-- SHOW COLUMNS FROM conversation_messages LIKE '%audio%';

-- Check users voice columns
-- SHOW COLUMNS FROM users LIKE '%voice%';

-- Check new tables
-- SELECT COUNT(*) as voice_usage_logs_count FROM voice_usage_logs;
-- SELECT COUNT(*) as voice_files_count FROM voice_files;
-- SELECT COUNT(*) as voice_settings_count FROM voice_settings;

-- Check voice permissions
-- SELECT * FROM ai_role_permissions WHERE table_name IN ('voice_usage_logs', 'voice_files', 'voice_settings');

-- Check voice settings
-- SELECT * FROM voice_settings WHERE is_active = 1;

-- =============================================
-- MIGRATION COMPLETE
-- ============================================= 
 
 