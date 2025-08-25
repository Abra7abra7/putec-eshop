-- Migration: Remove accommodation tables
-- Date: 2025-08-24
-- Reason: Using external Previo system for accommodation

-- Drop accommodation related tables (if they exist)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS accommodations;

-- Note: Tables may already be removed, so we use IF EXISTS
-- No need to drop policies or publications for non-existent tables
