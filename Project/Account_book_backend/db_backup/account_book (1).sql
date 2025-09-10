-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 03, 2025 at 12:15 PM
-- Server version: 8.0.41-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `account_book`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `account_type` enum('None','PAYABLE_RECEIVABLE','BANK','CREDIT_CARD','PRODUCT','PERSONNEL','SAVINGS','CASH') NOT NULL DEFAULT 'None',
  `unit` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `starting_balance` float DEFAULT '0',
  `is_archive` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `bookId` bigint DEFAULT NULL,
  `balance` float DEFAULT '0',
  `userId` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `name`, `description`, `account_type`, `unit`, `createdAt`, `updatedAt`, `starting_balance`, `is_archive`, `is_deleted`, `bookId`, `balance`, `userId`) VALUES
(1, 'personal', 'good', 'BANK', 'upee', '2025-01-06 16:55:20', '2025-01-21 15:36:49', 0, 0, 1, NULL, 0, NULL),
(6, 'Akash Acc', 'cychgugugu', 'CASH', '0', '2025-01-09 16:20:28', '2025-03-03 10:52:32', 0, 1, 0, 16, 36526, 6),
(11, 'akki', 'good', 'PERSONNEL', 'US Dollar $', '2025-01-25 11:13:56', '2025-01-25 11:13:56', 0, 0, 0, NULL, 0, NULL),
(12, 'payable test', 'Ok', 'BANK', '$', '2025-01-25 13:19:10', '2025-01-25 13:19:10', 0, 0, 0, NULL, 0, 6),
(14, 'Cash', 'Test', 'CASH', 'US Dollar $', '2025-01-25 13:27:59', '2025-01-25 13:27:59', 0, 0, 0, NULL, 0, NULL),
(17, 'Bank', 'Test', 'BANK', '$', '2025-01-25 13:30:11', '2025-02-25 17:37:49', 0, 0, 0, 16, 730, 4),
(18, 'Ballu', 'good', 'PERSONNEL', 'upee', '2025-01-25 15:43:53', '2025-02-26 16:08:11', 0, 0, 0, NULL, 17959, 30),
(19, 'Rohan', 'hll', 'PERSONNEL', 'upee', '2025-01-26 06:07:24', '2025-02-13 16:43:56', 0, 0, 0, 16, 60, 19),
(21, 'personal test', 'ok', 'PERSONNEL', 'US Dollar $', '2025-01-26 06:12:03', '2025-01-26 06:12:03', 0, 0, 0, NULL, 0, NULL),
(23, 'Bank8ntt', '90', 'BANK', '$', '2025-01-26 06:58:20', '2025-01-26 07:01:55', 0, 0, 1, NULL, 0, NULL),
(24, 'added', 'qdding', 'PAYABLE_RECEIVABLE', '$', '2025-01-26 07:03:35', '2025-02-13 16:27:34', 0, 0, 0, NULL, 198, NULL),
(25, 'akki', 'good', 'BANK', 'upee', '2025-01-27 15:46:50', '2025-02-27 04:30:12', 0, 0, 0, 16, 160, NULL),
(26, 'test', 'good', 'BANK', 'upee', '2025-01-27 15:52:06', '2025-01-27 15:52:06', 0, 0, 0, 16, 0, NULL),
(27, 'payable test', 'okkk', 'PAYABLE_RECEIVABLE', '$', '2025-01-27 16:24:08', '2025-01-27 16:24:08', 0, 0, 0, 16, 0, NULL),
(28, 'test personal', 'okk', 'PERSONNEL', '$', '2025-01-27 17:05:02', '2025-02-13 16:41:55', 0, 0, 0, 16, 10, NULL),
(29, 'credit card test', 'okkk', 'CREDIT_CARD', '$', '2025-01-27 17:13:02', '2025-01-27 17:13:02', 0, 0, 0, 16, 0, NULL),
(30, 'cashhhh', 'okkk', 'CASH', '$', '2025-01-27 18:21:47', '2025-03-02 12:00:00', 0, 1, 0, 16, 8282, 30),
(31, 'test2', 'good', 'PERSONNEL', '$ United States dollar USD', '2025-01-29 10:46:18', '2025-02-22 14:11:57', 0, 1, 0, 16, 0, NULL),
(32, 'testing account', 'All kinds of electronic devices like mobile phones, laptops, etc.', 'PERSONNEL', '$ United States dollar USD', '2025-01-29 10:53:30', '2025-02-24 06:45:48', 0, 0, 0, 16, 200, 20),
(33, 'praveen', 'Marketing expenditure', 'SAVINGS', 'Indian Rupee ₹', '2025-01-31 13:39:30', '2025-02-19 08:34:24', 0, 0, 0, 16, 12000, NULL),
(34, 'abc1', 'abc1', 'CASH', 'Indian Rupee ₹', '2025-01-31 16:38:15', '2025-02-27 05:33:59', 0, 1, 0, 18, 389, 19),
(35, 'abc2', 'abc2', 'CASH', 'Indian Rupee ₹', '2025-01-31 16:38:51', '2025-02-28 07:04:05', 0, 0, 0, 18, 4880, 35),
(36, 'xyz1', 'xyz1', 'SAVINGS', 'Indian Rupee ₹', '2025-01-31 16:39:29', '2025-03-02 12:00:00', 0, 0, 0, 16, 2270, 19),
(37, '22 acc', 'good', 'PERSONNEL', 'US Dollar $', '2025-02-07 05:32:47', '2025-02-07 05:32:47', 0, 0, 0, 16, 0, NULL),
(38, 'Sachinnnnnnnnn', 'hello', 'PAYABLE_RECEIVABLE', 'Euro €', '2025-02-08 10:53:04', '2025-02-22 13:44:41', 0, 0, 1, 16, 10, 19),
(39, 'A', 'All kinds of electronic devices like mobile phones, laptops, etc.', 'SAVINGS', 'upee', '2025-02-15 06:12:50', '2025-02-21 17:27:04', 0, 0, 1, 16, 0, NULL),
(40, 'Ballu', 'good', 'PERSONNEL', 'upee', '2025-02-24 07:10:47', '2025-02-28 06:50:48', 0, 0, 0, 16, 8005, 30),
(41, 'Raman', 'All kinds of electronic devices like mobile phones, laptops, etc.', 'CASH', 'euro', '2025-02-24 08:31:12', '2025-02-24 08:55:18', 0, 0, 0, 22, 35, 1),
(42, 'sbi', 'for transaction', 'BANK', 'US Dollar $', '2025-02-25 03:41:06', '2025-03-02 06:43:02', 0, 0, 0, 18, 869, 36),
(43, 'Rakesh', 'Delhi', 'SAVINGS', 'Indian Rupee ₹', '2025-02-25 08:04:28', '2025-03-03 06:54:32', 0, 0, 0, 18, 231921, 35),
(44, 'Santosh ', 'bank account ', 'BANK', 'Indian Rupee ₹', '2025-02-25 08:19:48', '2025-02-27 04:30:54', 0, 0, 0, 18, 110, 35),
(45, 'Santosh 2', 'saving ', 'SAVINGS', 'Indian Rupee ₹', '2025-02-25 08:20:36', '2025-02-25 08:20:36', 0, 0, 0, 18, 0, 35),
(46, 'Dipank', 'Expense', 'PERSONNEL', 'Indian Rupee ₹', '2025-02-25 08:21:16', '2025-02-28 09:11:24', 0, 0, 0, 18, -1, 35),
(47, 'Dipank', 'Expense', 'PERSONNEL', 'Indian Rupee ₹', '2025-02-25 08:21:17', '2025-02-25 08:21:17', 0, 0, 0, 18, 0, 35),
(48, 'Dipank', 'Expense', 'PERSONNEL', 'Indian Rupee ₹', '2025-02-25 08:21:22', '2025-02-25 08:21:22', 0, 0, 0, 18, 0, 35),
(49, 'Dipank', 'Expense', 'PERSONNEL', 'Indian Rupee ₹', '2025-02-25 08:21:25', '2025-02-25 08:21:25', 0, 0, 0, 18, 0, 35),
(50, 'Dipank', 'Expense', 'PERSONNEL', 'Indian Rupee ₹', '2025-02-25 08:21:18', '2025-02-25 08:21:18', 0, 0, 0, 18, 0, 35),
(51, 'Dipank', 'Expense', 'PERSONNEL', 'Indian Rupee ₹', '2025-02-25 08:21:18', '2025-03-03 07:16:54', 0, 1, 0, 18, 600, 35),
(52, '', '', 'BANK', '$', '2025-02-25 17:35:24', '2025-02-25 17:35:24', 0, 0, 0, 16, 0, 30),
(53, 'fxgcgc', 'fgcgv', 'PRODUCT', 'United Arab Emirates Dirham د.إ', '2025-02-25 17:45:36', '2025-02-26 09:24:37', 0, 1, 0, 16, 100, 30),
(54, 'hello ', 'test', 'PERSONNEL', 'Afghan Afghani ؋', '2025-02-25 17:46:34', '2025-02-25 17:46:34', 0, 0, 0, 16, 0, 30),
(55, 'vvffv', 'dcrfrc', 'SAVINGS', 'Albanian Lek Lekë', '2025-02-25 17:47:43', '2025-02-25 17:47:43', 0, 0, 0, 16, 0, 30),
(56, 'hello', 'vvgvggv', 'PERSONNEL', 'Armenian Dram դր.', '2025-02-25 17:48:05', '2025-02-25 17:48:05', 0, 0, 0, 16, 0, 30),
(57, 'txctgc', 'xfgcg ', 'PERSONNEL', '$', '2025-02-25 17:49:21', '2025-02-25 17:49:21', 0, 0, 0, 16, 0, 30),
(58, 'pp', 'pp', 'PRODUCT', 'Armenian Dram դր.', '2025-02-25 17:50:01', '2025-02-26 09:24:37', 0, 1, 0, 16, 0, 30),
(59, 'efefefdfd', 'dfdfddfdfdff', 'PAYABLE_RECEIVABLE', 'US Dollar $', '2025-02-26 14:27:21', '2025-03-03 10:45:51', 0, 0, 0, 18, 4, 35),
(60, 'dsdsd', 'dsdsdsd', 'PAYABLE_RECEIVABLE', 'Afghan Afghani ؋', '2025-02-26 14:33:50', '2025-02-26 14:33:50', 0, 0, 0, 18, 0, 35),
(61, 'testing sheet ', 'testing ', 'BANK', 'Indian Rupee ₹', '2025-02-26 18:30:17', '2025-02-27 18:03:23', 0, 0, 0, 18, -3, 35),
(62, 'tea acc', 'tea ', 'PAYABLE_RECEIVABLE', 'Indian Rupee ₹', '2025-02-27 09:44:32', '2025-02-27 13:37:08', 0, 0, 0, 18, 5, 35),
(63, 'sakln', 'terst', 'PAYABLE_RECEIVABLE', 'US Dollar $', '2025-03-03 09:38:53', '2025-03-03 10:52:32', 0, 0, 0, 16, 10, 35),
(64, 'deeer', 'rerer', 'PAYABLE_RECEIVABLE', 'Euro €', '2025-03-03 09:52:04', '2025-03-03 09:52:04', 0, 0, 0, 18, 0, 35);

-- --------------------------------------------------------

--
-- Table structure for table `alloted_accounts`
--

CREATE TABLE `alloted_accounts` (
  `id` bigint NOT NULL,
  `assign_by` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `accountId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `bookId` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alloted_accounts`
--

INSERT INTO `alloted_accounts` (`id`, `assign_by`, `createdAt`, `updatedAt`, `accountId`, `userId`, `bookId`) VALUES
(1, 'Test Admin 1', '2025-03-01 07:46:44', '2025-03-01 07:46:44', 48, 35, 16),
(2, 'Test Admin 1', '2025-03-01 07:48:25', '2025-03-01 07:48:25', 60, 35, 18),
(3, 'Akash', '2025-03-03 07:39:22', '2025-03-03 07:39:22', 6, 36, 16),
(4, 'Test Admin 1', '2025-03-03 09:35:19', '2025-03-03 09:35:19', 50, 43, 18);

-- --------------------------------------------------------

--
-- Table structure for table `alloted_books`
--

CREATE TABLE `alloted_books` (
  `id` bigint NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bookId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `assign_by` varchar(255) DEFAULT NULL,
  `read_book` tinyint(1) DEFAULT '1',
  `create_book` tinyint(1) DEFAULT '0',
  `update_book` tinyint(1) DEFAULT '0',
  `delete_book` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alloted_books`
--

INSERT INTO `alloted_books` (`id`, `createdAt`, `updatedAt`, `bookId`, `userId`, `assign_by`, `read_book`, `create_book`, `update_book`, `delete_book`) VALUES
(1, '2025-02-22 14:42:22', '2025-03-03 06:32:31', 20, 2, NULL, 1, 1, 0, 0),
(2, '2025-02-22 14:42:32', '2025-03-03 06:32:31', 20, 2, NULL, 1, 1, 0, 0),
(3, '2025-02-22 14:42:41', '2025-02-22 14:42:41', 20, 3, NULL, 1, 0, 0, 0),
(4, '2025-02-22 14:43:29', '2025-03-03 06:32:31', 21, 2, NULL, 1, 1, 0, 0),
(5, '2025-02-22 14:58:55', '2025-03-03 06:36:05', 18, 33, NULL, 1, 1, 0, 0),
(6, '2025-02-23 09:34:52', '2025-02-23 09:34:52', 16, 30, NULL, 1, 0, 0, 0),
(7, '2025-02-23 09:57:32', '2025-02-23 09:57:32', 16, 36, NULL, 1, 0, 0, 0),
(8, '2025-02-24 11:31:03', '2025-02-24 11:31:03', 18, 35, NULL, 1, 0, 0, 0),
(9, '2025-03-03 06:25:01', '2025-03-03 06:25:01', 16, 35, 'Super Admin', 1, 0, 0, 0),
(10, '2025-03-03 06:25:01', '2025-03-03 06:25:01', 18, 35, 'Super Admin', 1, 0, 0, 0),
(11, '2025-03-03 06:36:05', '2025-03-03 06:36:05', 16, 33, 'Super Admin', 1, 1, 0, 0),
(12, '2025-03-03 06:36:05', '2025-03-03 06:36:05', 19, 33, 'Super Admin', 1, 1, 0, 0),
(13, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 16, 32, 'Super Admin', 1, 0, 0, 0),
(14, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 18, 32, 'Super Admin', 1, 0, 0, 0),
(15, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 19, 32, 'Super Admin', 1, 0, 0, 0),
(16, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 20, 32, 'Super Admin', 1, 0, 0, 0),
(17, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 21, 32, 'Super Admin', 1, 0, 0, 0),
(18, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 22, 32, 'Super Admin', 1, 0, 0, 0),
(19, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 23, 32, 'Super Admin', 1, 0, 0, 0),
(20, '2025-03-03 07:58:15', '2025-03-03 07:58:15', 24, 32, 'Super Admin', 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `usage_type` enum('home budget','business managment') DEFAULT NULL,
  `usage_mode` enum('simple','normal') DEFAULT NULL,
  `account_unit` varchar(255) DEFAULT NULL,
  `time_zone` varchar(255) DEFAULT NULL,
  `hide_account` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `name`, `description`, `usage_type`, `usage_mode`, `account_unit`, `time_zone`, `hide_account`, `createdAt`, `updatedAt`) VALUES
(16, 'My Business', 'Description', 'home budget', 'simple', 'Euro €', 'india', 0, '2025-01-27 15:13:00', '2025-02-15 14:31:30'),
(18, 'Test book 1', 'ind', 'business managment', 'normal', 'Indian Rupee ₹', 'india', 0, '2025-01-31 16:37:08', '2025-02-20 07:12:35'),
(19, 'mp ', 'testing ', 'business managment', 'normal', 'Indian Rupee ₹', 'india', 0, '2025-01-31 17:12:44', '2025-01-31 17:12:44'),
(20, 'yut', 'good', 'home budget', 'simple', 'kg', 'india', 0, '2025-02-04 06:37:37', '2025-02-20 06:57:06'),
(21, 'yut', 'good', 'home budget', 'simple', 'kg', 'india', 0, '2025-02-15 05:40:17', '2025-02-15 05:40:17'),
(22, 'test2', 'add test record', 'home budget', 'simple', 'kg', 'india', 0, '2025-02-15 05:50:48', '2025-02-24 08:53:48'),
(23, 'test2', '', 'home budget', 'simple', 'kg', 'india', 0, '2025-02-15 05:58:39', '2025-02-15 05:58:39'),
(24, 'Bangalore', '', 'home budget', 'simple', 'kg', 'india', 0, '2025-03-02 12:34:19', '2025-03-02 12:34:19');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint NOT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `upper_category` enum('None','Office Expense') DEFAULT 'None',
  `monthly_limit` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `upper_category`, `monthly_limit`, `createdAt`, `updatedAt`) VALUES
(2, 'allu', 'None', '35', '2025-01-06 17:03:18', '2025-01-29 09:39:24'),
(4, 'allu', 'None', '34', '2025-01-13 15:58:38', '2025-01-13 15:58:38'),
(5, 'Hello', 'None', '200', '2025-01-13 16:04:39', '2025-01-13 16:04:39'),
(6, 'allu', 'None', '34', '2025-01-29 05:23:23', '2025-01-29 05:23:23'),
(7, 'dg', 'Office Expense', '34', '2025-01-29 11:20:12', '2025-01-29 11:20:12'),
(8, 'expense', 'Office Expense', '34', '2025-01-29 11:21:42', '2025-01-29 11:21:42'),
(9, 'helloooo', 'None', '2000000000', '2025-02-23 15:34:59', '2025-02-23 15:34:59');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `contact_image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `surname`, `phone_no`, `email_id`, `company`, `job_title`, `contact_image`, `createdAt`, `updatedAt`) VALUES
(1, 'KGF', '34', '9768574374', 'kgf@gmail.com', 'mac', 'deve', NULL, '2025-01-13 15:41:30', '2025-01-13 15:41:30'),
(2, 'Sachin ', 'Choudhary', '9988775533', 'sachinh@gmail.com', 'coo', 'vbk', NULL, '2025-01-13 17:06:34', '2025-01-13 17:06:34');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `description`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, 'good', '2025-01-31 05:35:31', '2025-01-31 05:35:31', NULL),
(2, 'nice', '2025-02-01 14:53:37', '2025-02-01 14:53:37', NULL),
(3, 'excellent', '2025-02-01 14:55:22', '2025-02-01 14:55:22', NULL),
(4, 'excellent', '2025-02-01 14:56:05', '2025-02-01 14:56:05', NULL),
(5, 'nice', '2025-02-01 14:56:34', '2025-02-01 14:56:34', NULL),
(6, 'jhg', '2025-02-15 10:36:51', '2025-02-15 10:36:51', NULL),
(7, 'good', '2025-02-24 06:24:13', '2025-02-24 06:24:13', NULL),
(8, 'good', '2025-02-24 06:24:28', '2025-02-24 06:24:28', 6),
(9, 'good', '2025-02-24 06:24:43', '2025-02-24 06:24:43', 6),
(10, 'dsf', '2025-02-24 06:38:56', '2025-02-24 06:38:56', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type_of_notes` enum('addNote','task','order') DEFAULT NULL,
  `is_postponde` tinyint(1) DEFAULT '0',
  `postponded_date` datetime DEFAULT NULL,
  `completed` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` bigint DEFAULT NULL,
  `bookId` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `description`, `type_of_notes`, `is_postponde`, `postponded_date`, `completed`, `deleted`, `createdAt`, `updatedAt`, `userId`, `bookId`) VALUES
(1, 'best', 'task', 0, '2025-01-23 00:00:00', 1, 1, '2025-01-20 15:54:49', '2025-01-30 17:04:55', 19, 16),
(2, 'best ', 'task', 0, '2025-01-23 00:00:00', 0, 0, '2025-01-25 10:09:09', '2025-01-25 10:09:09', 20, 16),
(3, 'Creating Notes', 'addNote', 0, NULL, 0, 1, '2025-01-26 07:25:28', '2025-02-23 16:08:36', 6, 16),
(4, 'tasknaddef', 'task', 0, NULL, 0, 0, '2025-01-26 07:25:45', '2025-01-26 07:25:45', 20, 16),
(5, 'order added', 'order', 0, NULL, 0, 0, '2025-01-26 07:25:58', '2025-01-31 13:42:18', 19, 16),
(6, 'hwllo', 'addNote', 0, NULL, 0, 1, '2025-01-30 16:14:52', '2025-01-30 17:04:30', 6, 16),
(7, 'task', 'task', 0, NULL, 1, 0, '2025-02-01 13:59:56', '2025-02-01 13:59:56', NULL, 16),
(8, 'Main work', 'order', 0, NULL, 0, 0, '2025-02-06 05:19:14', '2025-02-06 05:19:14', NULL, NULL),
(9, 'create notes one', 'addNote', 0, NULL, 0, 0, '2025-02-23 16:08:28', '2025-02-23 16:08:28', NULL, NULL),
(10, 'remeber', 'order', 1, NULL, 0, 0, '2025-02-24 05:31:19', '2025-02-24 05:31:19', 1, NULL),
(11, 'ds', 'order', 0, NULL, 0, 0, '2025-02-24 05:36:26', '2025-02-24 05:36:26', 1, NULL),
(12, 'dsf', 'task', 0, NULL, 0, 0, '2025-02-24 05:43:16', '2025-02-24 05:43:16', 1, NULL),
(13, 'df', 'addNote', 0, NULL, 0, 0, '2025-02-24 05:45:11', '2025-02-24 05:45:11', 1, NULL),
(14, 'ds', 'order', 0, NULL, 0, 0, '2025-02-24 05:46:47', '2025-02-24 05:46:47', 1, NULL),
(15, 'best ', 'task', 0, '2025-01-23 00:00:00', 0, 0, '2025-02-24 05:48:54', '2025-02-24 05:48:54', NULL, NULL),
(17, 'best ', 'task', 0, '2025-01-23 00:00:00', 0, 0, '2025-02-24 05:51:33', '2025-02-24 05:51:33', 6, 16),
(19, 'sef', 'order', 0, NULL, 0, 0, '2025-02-24 05:53:37', '2025-02-24 05:53:37', 1, 16),
(20, 'add', 'addNote', 0, NULL, 0, 0, '2025-02-24 06:06:30', '2025-02-24 06:06:30', 1, 16),
(21, 'dee', 'addNote', 0, NULL, 0, 0, '2025-02-24 06:08:10', '2025-02-24 06:08:10', 1, 16);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `target_id` varchar(255) DEFAULT NULL,
  `source_id` varchar(255) DEFAULT NULL,
  `data` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` bigint DEFAULT NULL,
  `bookId` bigint DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `message`, `type`, `target_id`, `source_id`, `data`, `title`, `createdAt`, `updatedAt`, `userId`, `bookId`, `transaction_id`) VALUES
(1, 'Amount : 100 has Transfered by Bank', ' payment_transfer ', '1970-01-01 00:00:00', '4', 'Amount : 100 has Transfered by Bank', NULL, '2025-01-31 15:45:07', '2025-01-31 15:45:07', 4, NULL, NULL),
(2, 'Amount : 100 has Transfered by Bank', ' payment_transfer ', '1970-01-01 00:00:00', '4', 'Amount : 100 has Transfered by Bank', NULL, '2025-01-31 15:47:25', '2025-01-31 15:47:25', 5, NULL, NULL),
(3, 'Amount : 1 has Transfered by cashhhh', ' payment_transfer ', '1970-01-01 00:00:00', '20', 'Amount : 1 has Transfered by cashhhh', NULL, '2025-02-06 14:34:17', '2025-02-06 14:34:17', 20, NULL, NULL),
(4, 'Amount : 200 has Transfered by cashhhh', ' payment_transfer ', '1970-01-01 00:00:00', '20', 'Amount : 200 has Transfered by cashhhh', NULL, '2025-02-06 14:36:45', '2025-02-06 14:36:45', 20, NULL, NULL),
(5, 'Amount : 200 has Transfered by cashhhh', ' payment_transfer ', '1970-01-01 00:00:00', '20', 'Amount : 200 has Transfered by cashhhh', NULL, '2025-02-06 14:41:19', '2025-02-06 14:41:19', 20, NULL, NULL),
(6, 'Amount : 855386 has Transfered by cashhhh', ' payment_transfer ', '1970-01-01 00:00:00', '20', 'Amount : 855386 has Transfered by cashhhh', NULL, '2025-02-06 14:47:30', '2025-02-06 14:47:30', 20, NULL, NULL),
(7, 'Amount : 100 has Transfered by sachinnn', ' payment_transfer ', '1970-01-01 00:00:00', '3', 'Amount : 100 has Transfered by sachinnn', NULL, '2025-02-06 17:17:08', '2025-02-06 17:17:08', 3, NULL, NULL),
(8, 'Amount : 10 has Transfered by Akash', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 10 has Transfered by Akash', NULL, '2025-02-13 11:10:48', '2025-02-13 11:10:48', 6, NULL, NULL),
(9, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-13 11:19:58', '2025-02-13 11:19:58', 6, NULL, NULL),
(10, 'Amount : 10 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 10 has Transfered by Akash Acc', NULL, '2025-02-13 16:25:45', '2025-02-13 16:25:45', 6, NULL, NULL),
(11, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-13 16:39:04', '2025-02-13 16:39:04', 6, NULL, NULL),
(12, 'Amount : 10 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 10 has Transfered by Akash Acc', NULL, '2025-02-13 16:40:07', '2025-02-13 16:40:07', 6, NULL, NULL),
(13, 'Amount : 10 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 10 has Transfered by Akash Acc', NULL, '2025-02-13 16:40:50', '2025-02-13 16:40:50', 6, NULL, NULL),
(14, 'Amount : 10 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 10 has Transfered by Akash Acc', NULL, '2025-02-13 16:42:31', '2025-02-13 16:42:31', 6, NULL, NULL),
(15, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-13 16:43:56', '2025-02-13 16:43:56', 6, NULL, NULL),
(16, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '1970-01-01 00:00:00', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-15 10:22:58', '2025-02-15 10:22:58', 6, NULL, NULL),
(17, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '32', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-23 15:28:36', '2025-02-23 15:28:36', 30, 16, 'TRS23022025168'),
(18, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '32', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-23 15:30:41', '2025-02-23 15:30:41', 30, 16, 'TRS23022025170'),
(19, 'Amount : 20 has Transfered by Akash Acc', 'EXPENSE', '32', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-23 15:30:50', '2025-02-23 15:30:50', 30, 16, 'TRS23022025171'),
(20, 'Amount : 20 has Transfered by cashhhh', 'INCOME', '30', '30', 'Amount : 20 has Transfered by cashhhh', NULL, '2025-02-23 15:37:47', '2025-02-23 15:37:47', 30, 16, 'TRS23022025177'),
(21, 'Amount : 909 has Transfered by Akash Acc', 'EXPENSE', '6', '6', 'Amount : 909 has Transfered by Akash Acc', NULL, '2025-02-23 15:52:40', '2025-02-23 15:52:40', 30, 16, 'TRS23022025180'),
(22, 'Amount : 90 has Transfered by Akash Acc', 'INCOME', '6', '6', 'Amount : 90 has Transfered by Akash Acc', NULL, '2025-02-23 15:52:53', '2025-02-23 15:52:53', 30, 16, 'TRS23022025181'),
(23, 'Amount : 800 has Transfered by Akash Acc', 'PAYMENT', '6', '6', 'Amount : 800 has Transfered by Akash Acc', NULL, '2025-02-23 15:53:13', '2025-02-23 15:53:13', 30, 16, 'TRS23022025182'),
(24, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '32', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-24 06:45:07', '2025-02-24 06:45:07', NULL, 16, 'TRS24022025184'),
(25, 'Amount : 20 has Transfered by Akash Acc', ' payment_transfer ', '32', '6', 'Amount : 20 has Transfered by Akash Acc', NULL, '2025-02-24 06:45:54', '2025-02-24 06:45:54', NULL, 16, 'TRS24022025185'),
(26, 'Amount : 20 has Transfered by cashhhh', 'INCOME', '30', '30', 'Amount : 20 has Transfered by cashhhh', NULL, '2025-02-24 07:02:17', '2025-02-24 07:02:17', 30, 16, 'TRS24022025186'),
(27, 'Amount : 20 has Transfered by cashhhh', 'INCOME', '30', '30', 'Amount : 20 has Transfered by cashhhh', NULL, '2025-02-24 07:07:32', '2025-02-24 07:07:32', 30, 16, 'TRS24022025187'),
(28, 'Amount : 232 has Transfered by abc1', 'INCOME', '32', '34', 'Amount : 232 has Transfered by abc1', NULL, '2025-02-24 07:11:38', '2025-02-24 07:11:38', 1, 18, 'TRS24022025188'),
(29, 'Amount : 765 has Transfered by xyz1', 'INCOME', '19', '36', 'Amount : 765 has Transfered by xyz1', NULL, '2025-02-24 08:43:51', '2025-02-24 08:43:51', 1, 16, 'TRS24022025195'),
(30, 'Amount : 765 has Transfered by xyz1', 'INCOME', '19', '36', 'Amount : 765 has Transfered by xyz1', NULL, '2025-02-24 08:44:33', '2025-02-24 08:44:33', 1, 16, 'TRS24022025196'),
(31, 'Amount : 35 has Transfered by Raman', 'INCOME', '41', '41', 'Amount : 35 has Transfered by Raman', NULL, '2025-02-24 08:55:19', '2025-02-24 08:55:19', 1, 22, 'TRS24022025197'),
(32, 'Amount : 100 has Transfered by abc1', 'EXPENSE', '34', '34', 'Amount : 100 has Transfered by abc1', NULL, '2025-02-25 03:40:07', '2025-02-25 03:40:07', 36, 18, 'TRS25022025198'),
(33, 'Amount : 100 has Transfered by sbi', 'INCOME', '42', '42', 'Amount : 100 has Transfered by sbi', NULL, '2025-02-25 03:41:28', '2025-02-25 03:41:28', 36, 18, 'TRS25022025199'),
(34, 'Amount : 10 has Transfered by sbi', ' payment_transfer ', '42', '42', 'Amount : 10 has Transfered by sbi', NULL, '2025-02-25 03:42:28', '2025-02-25 03:42:28', 36, 18, 'TRS25022025200'),
(35, 'Amount : 10 has Transfered by sbi', ' payment_transfer ', '42', '42', 'Amount : 10 has Transfered by sbi', NULL, '2025-02-25 03:43:16', '2025-02-25 03:43:16', 36, 18, 'TRS25022025201'),
(36, 'Amount : 25300 has Transfered by Rakesh', 'EXPENSE', '43', '43', 'Amount : 25300 has Transfered by Rakesh', NULL, '2025-02-25 08:04:45', '2025-02-25 08:04:45', 35, 18, 'TRS25022025202'),
(37, 'Amount : 1200 has Transfered by Rakesh', 'INCOME', '43', '43', 'Amount : 1200 has Transfered by Rakesh', NULL, '2025-02-25 08:05:39', '2025-02-25 08:05:39', 35, 18, 'TRS25022025203'),
(38, 'Amount : 124000 has Transfered by Rakesh', 'INCOME', '43', '43', 'Amount : 124000 has Transfered by Rakesh', NULL, '2025-02-25 08:07:10', '2025-02-25 08:07:10', 35, 18, 'TRS25022025204'),
(39, 'Amount : 43000 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 43000 has Transfered by Rakesh', NULL, '2025-02-25 08:08:03', '2025-02-25 08:08:03', 35, 18, 'TRS25022025205'),
(40, 'Amount : 90000 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 90000 has Transfered by Rakesh', NULL, '2025-02-25 08:24:23', '2025-02-25 08:24:23', 35, 18, 'TRS25022025206'),
(41, 'Amount : 7632 has Transfered by Ballu', 'INCOME', '49', '40', 'Amount : 7632 has Transfered by Ballu', NULL, '2025-02-25 10:58:06', '2025-02-25 10:58:06', 1, 16, 'TRS25022025207'),
(42, 'Amount : 20 has Transfered by Ballu', 'EXPENSE', '40', '40', 'Amount : 20 has Transfered by Ballu', NULL, '2025-02-25 17:35:42', '2025-02-25 17:35:42', 30, 16, 'TRS25022025214'),
(43, 'Amount : 70 has Transfered by Bank', 'EXPENSE', '17', '17', 'Amount : 70 has Transfered by Bank', NULL, '2025-02-25 17:37:49', '2025-02-25 17:37:49', 30, 16, 'TRS25022025216'),
(44, 'Amount : 599 has Transfered by cashhhh', 'EXPENSE', '30', '30', 'Amount : 599 has Transfered by cashhhh', NULL, '2025-02-25 18:42:19', '2025-02-25 18:42:19', 30, 16, 'TRS25022025217'),
(45, 'Amount : 100 has Transfered by pp', 'INCOME', '53', '58', 'Amount : 100 has Transfered by pp', NULL, '2025-02-26 09:23:25', '2025-02-26 09:23:25', 1, 16, 'TRS26022025218'),
(46, 'Amount : 100 has Transfered by pp', ' payment_transfer ', '53', '58', 'Amount : 100 has Transfered by pp', NULL, '2025-02-26 09:24:37', '2025-02-26 09:24:37', 1, 16, 'TRS26022025219'),
(47, 'Amount : 90 has Transfered by cashhhh', 'EXPENSE', '30', '30', 'Amount : 90 has Transfered by cashhhh', NULL, '2025-02-26 15:29:51', '2025-02-26 15:29:51', 30, 16, 'TRS26022025220'),
(48, 'Amount : 100 has Transfered by cashhhh', ' payment_transfer ', '30', '30', 'Amount : 100 has Transfered by cashhhh', NULL, '2025-02-26 15:59:48', '2025-02-26 15:59:48', 30, 16, 'TRS26022025221'),
(49, 'Amount : 199 has Transfered by cashhhh', ' payment_transfer ', '30', '30', 'Amount : 199 has Transfered by cashhhh', NULL, '2025-02-26 16:05:32', '2025-02-26 16:05:32', 30, 16, 'TRS26022025222'),
(50, 'Amount : 399 has Transfered by cashhhh', ' payment_transfer ', '40', '30', 'Amount : 399 has Transfered by cashhhh', NULL, '2025-02-26 16:09:15', '2025-02-26 16:09:15', 30, 16, 'TRS26022025224'),
(51, 'Amount : 74 has Transfered by cashhhh', ' payment_transfer ', '40', '30', 'Amount : 74 has Transfered by cashhhh', NULL, '2025-02-26 16:13:41', '2025-02-26 16:13:41', 30, 16, 'TRS26022025225'),
(52, 'Amount : 200 has Transfered by cashhhh', 'EXPENSE', '30', '30', 'Amount : 200 has Transfered by cashhhh', NULL, '2025-02-26 16:18:27', '2025-02-26 16:18:27', 30, 16, 'TRS26022025228'),
(53, 'Amount : 300 has Transfered by cashhhh', 'INCOME', '30', '30', 'Amount : 300 has Transfered by cashhhh', NULL, '2025-02-26 16:18:49', '2025-02-26 16:18:49', 30, 16, 'TRS26022025229'),
(54, 'Amount : 1999 has Transfered by cashhhh', 'PAYMENT', '40', '30', 'Amount : 1999 has Transfered by cashhhh', NULL, '2025-02-26 16:19:35', '2025-02-26 16:19:35', 30, 16, 'TRS26022025230'),
(55, 'Amount : 2000 has Transfered by cashhhh', 'ADD', '30', '30', 'Amount : 2000 has Transfered by cashhhh', NULL, '2025-02-26 16:22:54', '2025-02-26 16:22:54', 30, 16, 'TRS26022025231'),
(56, 'Amount : 99 has Transfered by Akash Acc', 'EXPENSE', '6', '6', 'Amount : 99 has Transfered by Akash Acc', NULL, '2025-02-26 17:03:44', '2025-02-26 17:03:44', 30, 16, 'TRS26022025232'),
(57, 'Amount : 20 has Transfered by Ballu', 'EXPENSE', '40', '40', 'Amount : 20 has Transfered by Ballu', NULL, '2025-02-26 17:33:25', '2025-02-26 17:33:25', 30, 16, 'TRS26022025233'),
(58, 'Amount : 10 has Transfered by sbi', ' payment_transfer ', '44', '42', 'Amount : 10 has Transfered by sbi', NULL, '2025-02-27 04:28:10', '2025-02-27 04:28:10', 36, 18, 'TRS27022025234'),
(59, 'Amount : 100 has Transfered by Rakesh', ' payment_transfer ', '44', '43', 'Amount : 100 has Transfered by Rakesh', NULL, '2025-02-27 04:30:54', '2025-02-27 04:30:54', 36, 18, 'TRS27022025236'),
(60, 'Amount : 700 has Transfered by Rakesh', ' payment_transfer ', '42', '43', 'Amount : 700 has Transfered by Rakesh', NULL, '2025-02-27 04:32:22', '2025-02-27 04:32:22', 36, 18, 'TRS27022025237'),
(61, 'Amount : 55 has Transfered by abc1', 'ADD', '34', '34', 'Amount : 55 has Transfered by abc1', NULL, '2025-02-27 05:33:59', '2025-02-27 05:33:59', 35, 18, 'TRS27022025238'),
(62, 'Amount : 22 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 22 has Transfered by Rakesh', NULL, '2025-02-27 11:15:01', '2025-02-27 11:15:01', 35, 18, 'TRS27022025239'),
(63, 'Amount : 20 has Transfered by Ballu', 'EXPENSE', '40', '40', 'Amount : 20 has Transfered by Ballu', NULL, '2025-02-27 13:15:53', '2025-02-27 13:15:53', 30, 16, 'TRS27022025240'),
(64, 'Amount : 20 has Transfered by Ballu', 'EXPENSE', '40', '40', 'Amount : 20 has Transfered by Ballu', NULL, '2025-02-27 13:25:16', '2025-02-27 13:25:16', 30, 16, 'TRS27022025241'),
(65, 'Amount : 5 has Transfered by tea acc', 'INCOME', '62', '62', 'Amount : 5 has Transfered by tea acc', NULL, '2025-02-27 13:37:08', '2025-02-27 13:37:08', 35, 18, 'TRS27022025242'),
(66, 'Amount : 20.0 has Transfered by Rakesh', ' payment_transfer ', '42', '43', 'Amount : 20.0 has Transfered by Rakesh', NULL, '2025-02-27 13:43:54', '2025-02-27 13:43:54', 35, 18, 'TRS27022025243'),
(67, 'Amount : 20.0 has Transfered by Rakesh', ' payment_transfer ', '42', '43', 'Amount : 20.0 has Transfered by Rakesh', NULL, '2025-02-27 13:46:03', '2025-02-27 13:46:03', 35, 18, 'TRS27022025244'),
(68, 'Amount : 3 has Transfered by Rakesh', 'EXPENSE', '43', '43', 'Amount : 3 has Transfered by Rakesh', NULL, '2025-02-27 18:31:15', '2025-02-27 18:31:15', 35, 18, 'TRS27022025248'),
(69, 'Amount : 333 has Transfered by Rakesh', 'EXPENSE', '43', '43', 'Amount : 333 has Transfered by Rakesh', NULL, '2025-02-27 18:31:40', '2025-02-27 18:31:40', 35, 18, 'TRS27022025249'),
(70, 'Amount : 44 has Transfered by Rakesh', 'INCOME', '43', '43', 'Amount : 44 has Transfered by Rakesh', NULL, '2025-02-27 18:31:57', '2025-02-27 18:31:57', 35, 18, 'TRS27022025250'),
(71, 'Amount : 3 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 3 has Transfered by Rakesh', NULL, '2025-02-27 18:32:24', '2025-02-27 18:32:24', 35, 18, 'TRS27022025251'),
(72, 'Amount : 3 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 3 has Transfered by Rakesh', NULL, '2025-02-27 18:32:57', '2025-02-27 18:32:57', 35, 18, 'TRS27022025252'),
(73, 'Amount : 66 has Transfered by Rakesh', 'COLLECTION', '43', '43', 'Amount : 66 has Transfered by Rakesh', NULL, '2025-02-27 18:33:52', '2025-02-27 18:33:52', 35, 18, 'TRS27022025253'),
(74, 'Amount : 12 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 12 has Transfered by Rakesh', NULL, '2025-02-27 18:34:24', '2025-02-27 18:34:24', 35, 18, 'TRS27022025254'),
(75, 'Amount : 12 has Transfered by Rakesh', 'ADD', '43', '43', 'Amount : 12 has Transfered by Rakesh', NULL, '2025-02-27 18:34:56', '2025-02-27 18:34:56', 35, 18, 'TRS27022025255'),
(76, 'Amount : 44 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 44 has Transfered by Rakesh', NULL, '2025-02-27 18:35:46', '2025-02-27 18:35:46', 35, 18, 'TRS27022025256'),
(77, 'Amount : 34 has Transfered by Rakesh', 'SUBTRACT', '43', '43', 'Amount : 34 has Transfered by Rakesh', NULL, '2025-02-27 18:36:17', '2025-02-27 18:36:17', 35, 18, 'TRS27022025257'),
(78, 'Amount : 45 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 45 has Transfered by Rakesh', NULL, '2025-02-27 18:49:31', '2025-02-27 18:49:31', 35, 18, 'TRS27022025258'),
(79, 'Amount : 12 has Transfered by Rakesh', ' payment_transfer ', '43', '43', 'Amount : 12 has Transfered by Rakesh', NULL, '2025-02-28 06:49:01', '2025-02-28 06:49:01', 35, 18, 'TRS28022025259'),
(80, 'Amount : 20 has Transfered by Ballu', ' payment_transfer ', '40', '40', 'Amount : 20 has Transfered by Ballu', NULL, '2025-02-28 06:49:42', '2025-02-28 06:49:42', 30, 16, 'TRS28022025260'),
(81, 'Amount : 20 has Transfered by abc2', ' payment_transfer ', '40', '35', 'Amount : 20 has Transfered by abc2', NULL, '2025-02-28 06:50:48', '2025-02-28 06:50:48', 43, 18, 'TRS28022025261'),
(82, 'Amount : 20 has Transfered by abc2', ' payment_transfer ', '43', '35', 'Amount : 20 has Transfered by abc2', NULL, '2025-02-28 06:51:10', '2025-02-28 06:51:10', 43, 18, 'TRS28022025262'),
(83, 'Amount : 20 has Transfered by abc2', ' payment_transfer ', '30', '35', 'Amount : 20 has Transfered by abc2', NULL, '2025-02-28 07:00:49', '2025-02-28 07:00:49', 35, 18, 'TRS28022025263'),
(84, 'Amount : 20 has Transfered by abc2', ' payment_transfer ', '43', '35', 'Amount : 20 has Transfered by abc2', NULL, '2025-02-28 07:01:50', '2025-02-28 07:01:50', 43, 18, 'TRS28022025264'),
(85, 'Amount : 20 has Transfered by abc2', 'EXPENSE', '43', '35', 'Amount : 20 has Transfered by abc2', NULL, '2025-02-28 07:02:08', '2025-02-28 07:02:08', 43, 18, 'TRS28022025265'),
(86, 'Amount : 20 has Transfered by abc2', 'EXPENSE', '43', '35', 'Amount : 20 has Transfered by abc2', NULL, '2025-02-28 07:04:05', '2025-02-28 07:04:05', 43, 18, 'TRS28022025266'),
(87, 'Amount : 1.0 has Transfered by Dipank', 'EXPENSE', '46', '46', 'Amount : 1.0 has Transfered by Dipank', NULL, '2025-02-28 09:11:24', '2025-02-28 09:11:24', 35, 18, 'TRS28022025267'),
(88, 'Amount : 11.2 has Transfered by Rakesh', 'EXPENSE', '43', '43', 'Amount : 11.2 has Transfered by Rakesh', NULL, '2025-02-28 09:33:50', '2025-02-28 09:33:50', 35, 18, 'TRS28022025268'),
(89, 'Amount : 5.0 has Transfered by sbi', ' payment_transfer ', '42', '42', 'Amount : 5.0 has Transfered by sbi', NULL, '2025-02-28 10:59:46', '2025-02-28 10:59:46', 36, 18, 'TRS28022025269'),
(90, 'Amount : 2.0 has Transfered by sbi', ' payment_transfer ', '42', '42', 'Amount : 2.0 has Transfered by sbi', NULL, '2025-02-28 11:00:28', '2025-02-28 11:00:28', 36, 18, 'TRS28022025270'),
(91, 'Amount : 20 has Transfered by cashhhh', ' payment_transfer ', '36', '30', 'Amount : 20 has Transfered by cashhhh', NULL, '2025-03-02 05:51:04', '2025-03-02 05:51:04', 30, 16, 'TRS02032025271'),
(92, 'Amount : 12.0 has Transfered by sbi', ' payment_transfer ', '42', '42', 'Amount : 12.0 has Transfered by sbi', NULL, '2025-03-02 06:43:02', '2025-03-02 06:43:02', 35, 18, 'TRS02032025272'),
(93, 'Amount: 20 has been credited to your account (xyz1).', 'payment_received(EMI)', '36', '30', 'Amount: 20 has been credited to your account (xyz1).', NULL, '2025-03-02 09:13:38', '2025-03-02 09:13:38', 30, 16, 'TRS02032025273'),
(94, 'Amount: 10 has been credited to your account (xyz1).', 'payment_received(EMI)', '36', '30', 'Amount: 10 has been credited to your account (xyz1).', NULL, '2025-03-02 09:22:11', '2025-03-02 09:22:11', 30, 16, 'TRS02032025274'),
(95, 'Amount: 200 has been credited to your account (xyz1).', 'payment_received(EMI)', '36', '30', 'Amount: 200 has been credited to your account (xyz1).', NULL, '2025-03-02 12:00:00', '2025-03-02 12:00:00', 30, 16, 'TRS02032025276'),
(96, 'Amount: 200 has been credited to your account (xyz1).', 'payment_received(EMI)', '36', '30', 'Amount: 200 has been credited to your account (xyz1).', NULL, '2025-03-02 12:00:00', '2025-03-02 12:00:00', 30, 16, 'TRS02032025275'),
(97, 'Amount: 3640.0 has been credited to your account (Rakesh).', 'payment_received(EMI)', '43', '43', 'Amount: 3640.0 has been credited to your account (Rakesh).', NULL, '2025-03-03 06:52:34', '2025-03-03 06:52:34', 35, 18, 'TRS03032025277'),
(98, 'Amount : 55.0 has Transfered by Rakesh', 'INCOME', '43', '43', 'Amount : 55.0 has Transfered by Rakesh', NULL, '2025-03-03 06:54:32', '2025-03-03 06:54:32', 35, 18, 'TRS03032025278'),
(99, 'Amount : 600.0 has Transfered by Dipank', 'INCOME', '51', '51', 'Amount : 600.0 has Transfered by Dipank', NULL, '2025-03-03 07:16:54', '2025-03-03 07:16:54', 35, 18, 'TRS03032025279'),
(100, 'Amount: 3577.0 has been credited to your account (Dipank).', 'payment_received(EMI)', '51', '51', 'Amount: 3577.0 has been credited to your account (Dipank).', NULL, '2025-03-03 07:18:26', '2025-03-03 07:18:26', 35, 18, 'TRS03032025280'),
(101, 'Amount : 100.0 has Transfered by Akash Acc', ' payment_transfer ', '6', '6', 'Amount : 100.0 has Transfered by Akash Acc', NULL, '2025-03-03 09:11:54', '2025-03-03 09:11:54', 36, 16, 'TRS03032025281'),
(102, 'Amount : 4.0 has Transfered by Akash Acc', ' payment_transfer ', '6', '6', 'Amount : 4.0 has Transfered by Akash Acc', NULL, '2025-03-03 09:14:45', '2025-03-03 09:14:45', 36, 16, 'TRS03032025282'),
(103, 'Amount : 20.0 has Transfered by Akash Acc', 'INCOME', '6', '6', 'Amount : 20.0 has Transfered by Akash Acc', NULL, '2025-03-03 09:20:35', '2025-03-03 09:20:35', 36, 16, 'TRS03032025283'),
(104, 'Amount : 20.0 has Transfered by Akash Acc', 'EXPENSE', '6', '6', 'Amount : 20.0 has Transfered by Akash Acc', NULL, '2025-03-03 09:20:55', '2025-03-03 09:20:55', 36, 16, 'TRS03032025284'),
(105, 'Amount : 20.0 has Transfered by Akash Acc', ' payment_transfer ', '6', '6', 'Amount : 20.0 has Transfered by Akash Acc', NULL, '2025-03-03 09:21:31', '2025-03-03 09:21:31', 36, 16, 'TRS03032025285'),
(106, 'Amount: 500.0 has been credited to your account (Akash Acc).', 'payment_received(EMI)', '6', '6', 'Amount: 500.0 has been credited to your account (Akash Acc).', NULL, '2025-03-03 09:25:17', '2025-03-03 09:25:17', 36, 16, 'TRS03032025286'),
(107, 'Amount : 5.0 has Transfered by Akash Acc', ' payment_transfer ', '63', '6', 'Amount : 5.0 has Transfered by Akash Acc', NULL, '2025-03-03 10:43:55', '2025-03-03 10:43:55', 36, 16, 'TRS03032025287'),
(108, 'Amount : 4.0 has Transfered by Akash Acc', ' payment_transfer ', '59', '6', 'Amount : 4.0 has Transfered by Akash Acc', NULL, '2025-03-03 10:45:51', '2025-03-03 10:45:51', 36, 16, 'TRS03032025288'),
(109, 'Amount : 5.0 has Transfered by Akash Acc', ' payment_transfer ', '63', '6', 'Amount : 5.0 has Transfered by Akash Acc', NULL, '2025-03-03 10:52:32', '2025-03-03 10:52:32', 36, 16, 'TRS03032025289');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint NOT NULL,
  `transaction_type` enum('INCOME','SALE','INVENTORY_SALE','EXPENSE','PURCHASE','INVENTORY_PURCHASE','PERSONNEL_EXPENSE','COLLECTION','PAYMENT','TRANSFER','LEND','BORROW','ADD','SUBTRACT') NOT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `to_account` varchar(255) DEFAULT NULL,
  `amount` float DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `starting_balance` tinyint(1) DEFAULT NULL,
  `account_type` enum('None','PAYABLE_RECEIVABLE','BANK','CREDIT_CARD','PRODUCT','PERSONNEL','SAVINGS','CASH') NOT NULL DEFAULT 'None',
  `account_settled` tinyint(1) DEFAULT '0',
  `accountId` bigint DEFAULT NULL,
  `bookId` bigint DEFAULT NULL,
  `transaction_time` varchar(255) DEFAULT NULL,
  `view_by_superAdmin` tinyint(1) DEFAULT '0',
  `acc_setled_date` datetime DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `upload_image` varchar(255) DEFAULT NULL,
  `settlement_status` enum('None','Pending','Approved','Rejected') DEFAULT 'None',
  `target_acc_name` varchar(255) DEFAULT NULL,
  `source_acc_name` varchar(255) DEFAULT NULL,
  `coll_kisht_type` varchar(255) DEFAULT NULL,
  `coll_emi_times` int DEFAULT NULL,
  `coll_total_amount` float DEFAULT '0',
  `coll_emiDue_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `transaction_type`, `transaction_date`, `category`, `description`, `to_account`, `amount`, `createdAt`, `updatedAt`, `starting_balance`, `account_type`, `account_settled`, `accountId`, `bookId`, `transaction_time`, `view_by_superAdmin`, `acc_setled_date`, `transaction_id`, `userId`, `upload_image`, `settlement_status`, `target_acc_name`, `source_acc_name`, `coll_kisht_type`, `coll_emi_times`, `coll_total_amount`, `coll_emiDue_date`) VALUES
(1, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', '123', 400, '2025-01-06 16:57:21', '2025-01-06 16:57:21', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(2, 'INVENTORY_SALE', '2024-02-15 00:00:00', 'final', 'good', '123', 400, '2025-01-06 16:57:58', '2025-01-06 16:57:58', NULL, 'None', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(7, 'INCOME', '2025-01-09 00:00:00', 'final', 'fughcjv', 'tyfycgf', 555, '2025-01-09 17:00:55', '2025-02-25 10:56:16', NULL, 'None', 0, 19, 16, NULL, 1, '2025-02-11 00:00:00', NULL, 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(9, 'EXPENSE', '2025-01-10 00:00:00', 'final', 'cjgjvjcj', 'tyfycgf', 88888, '2025-01-09 17:10:00', '2025-02-25 10:56:16', NULL, 'None', 0, 19, 16, NULL, 1, '2025-02-11 00:00:00', NULL, 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(10, 'INCOME', '2025-01-09 00:00:00', 'final', 'Paid to Rohan', 'sachinnn', 8000, '2025-01-09 17:42:53', '2025-01-09 17:42:53', NULL, 'None', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(11, 'INCOME', '2025-02-15 00:00:00', 'final', 'good', '123', 4000, '2025-01-13 16:26:14', '2025-01-13 16:26:14', 0, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(12, 'EXPENSE', '2025-01-22 00:00:00', 'final', 'hello', 'fxxtcyv', 5555, '2025-01-13 16:34:52', '2025-01-13 16:34:52', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(13, 'INCOME', '2025-03-14 00:00:00', 'final', 'ncbjvjgj', 'fycycy', 560, '2025-01-13 17:29:24', '2025-01-13 17:29:24', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(16, 'INCOME', '2025-01-15 00:00:00', 'final', 'testing', 'fxxtcyv', 331, '2025-01-15 18:25:56', '2025-01-15 18:25:56', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(18, 'INCOME', '2025-01-21 00:00:00', 'final', 'helllloooo', '36', 488888, '2025-01-21 16:22:27', '2025-01-21 16:22:27', NULL, 'None', 0, 6, 16, NULL, 0, NULL, NULL, 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(21, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', 'personal', 4000, '2025-01-22 15:04:47', '2025-01-22 15:04:47', 0, 'PAYABLE_RECEIVABLE', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(23, 'EXPENSE', '2024-02-15 00:00:00', 'final', 'good', 'personal', 6000, '2025-01-22 15:16:54', '2025-01-22 15:16:54', 0, 'PAYABLE_RECEIVABLE', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(25, 'EXPENSE', '2024-02-15 00:00:00', 'final', 'good', 'personal', 9000, '2025-01-23 16:00:20', '2025-01-23 16:00:20', 0, 'PAYABLE_RECEIVABLE', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(26, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', '123', 4000, '2025-01-24 15:21:14', '2025-01-24 15:21:14', 0, 'PAYABLE_RECEIVABLE', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(27, 'EXPENSE', '2025-01-24 00:00:00', '', 'Hello', '', 555, '2025-01-24 15:29:49', '2025-01-24 15:29:49', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(28, 'EXPENSE', '2025-01-24 00:00:00', '', 'yccuvuvugu', '', 6, '2025-03-24 15:30:04', '2025-01-24 15:30:04', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(29, 'INCOME', '2025-01-24 00:00:00', '', 'vyvcu', '', 99, '2025-01-24 15:30:15', '2025-01-24 15:30:15', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(30, 'PAYMENT', '2025-01-24 00:00:00', 'Hello', 'testinggg', 'personal', 55555600, '2025-01-24 15:45:08', '2025-01-24 15:45:08', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(31, 'PAYMENT', '2025-01-24 00:00:00', 'Hello', 'test', 'sachinnn', 99909, '2025-01-24 15:57:17', '2025-01-24 15:57:17', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(32, 'EXPENSE', '2025-01-24 00:00:00', '', 'Test', '', 99, '2025-01-24 15:57:36', '2025-01-24 15:57:36', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(33, 'EXPENSE', '2025-01-24 00:00:00', '', 'test', '', 90, '2025-01-24 16:00:43', '2025-01-24 16:00:43', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(34, 'INCOME', '2025-01-24 00:00:00', '', 'Income hai ye', '', 69, '2025-01-24 16:01:09', '2025-01-24 16:01:09', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(35, 'EXPENSE', '2025-01-24 00:00:00', '', 'hchfy', '', 77, '2025-01-24 16:02:18', '2025-01-24 16:02:18', 0, 'BANK', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(36, 'INCOME', '2025-01-24 00:00:00', 'final', 'gggg', '123 INR ₹', 55, '2025-01-24 16:07:24', '2025-01-24 16:07:24', NULL, 'None', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(37, 'INCOME', '2025-01-24 00:00:00', 'final', 'vhchc', 'personal', 6666, '2025-01-24 16:07:56', '2025-01-24 16:07:56', NULL, 'None', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(38, 'COLLECTION', '2025-01-24 00:00:00', 'allu', 'ghhh', 'sachinnn', 666, '2025-01-24 16:29:23', '2025-01-24 16:29:23', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(39, 'INCOME', '2025-01-25 00:00:00', 'final', 'addeddd', '123 INR ₹', 64313, '2025-01-25 10:37:47', '2025-01-25 10:37:47', NULL, 'None', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(40, 'INCOME', '2025-01-25 00:00:00', 'final', 'av trans', 'fycycy', 416, '2025-01-25 10:38:34', '2025-01-25 10:38:34', NULL, 'None', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(41, 'EXPENSE', '2025-01-25 00:00:00', 'final', 'av expense', 'fycycy', 400, '2025-01-25 10:39:19', '2025-01-25 10:39:19', NULL, 'None', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(42, 'INCOME', '2025-01-25 00:00:00', '', 'hello', '', 599, '2025-01-25 13:09:51', '2025-01-25 13:09:51', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(43, 'INCOME', '2025-01-25 00:00:00', '', 'hello', '', 500, '2025-01-25 13:14:02', '2025-01-25 13:14:02', 0, 'PRODUCT', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(44, 'EXPENSE', '2025-01-25 00:00:00', '', 'hello', '', 499, '2025-01-25 13:14:18', '2025-01-25 13:14:18', 0, 'PRODUCT', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(45, 'EXPENSE', '2025-01-26 00:00:00', '', 'transaction', '', 20, '2025-01-26 06:15:01', '2025-01-26 06:15:01', 0, 'PAYABLE_RECEIVABLE', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(46, 'INCOME', '2025-01-26 00:00:00', '', 'hdkki', '', 122, '2025-01-26 06:32:53', '2025-01-26 06:32:53', 0, 'BANK', 0, 17, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(47, 'INCOME', '2025-01-26 00:00:00', '', 'hhh', '', 200, '2025-01-26 06:33:47', '2025-01-26 06:33:47', 0, 'PAYABLE_RECEIVABLE', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(48, 'EXPENSE', '2025-01-26 00:00:00', '', 'add', '', 299, '2025-01-26 06:34:23', '2025-01-26 06:34:23', 0, 'BANK', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(49, 'EXPENSE', '2025-01-26 00:00:00', '', 'yelp', '', 100, '2025-01-26 06:58:32', '2025-01-26 06:58:32', 0, 'BANK', 0, 23, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(50, 'EXPENSE', '2025-01-26 00:00:00', '', 'am I right', '', 100, '2025-01-26 07:02:03', '2025-01-26 07:02:03', 0, 'SAVINGS', 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(51, 'INCOME', '2025-01-26 00:00:00', '', 'am I right', '', 100, '2025-01-26 07:03:04', '2025-01-26 07:03:04', 0, 'PERSONNEL', 0, 18, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(54, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', '123', 4000, '2025-01-27 16:29:13', '2025-01-27 16:29:13', 0, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(55, 'EXPENSE', '2025-01-27 00:00:00', '', 'test', '', 500, '2025-01-27 16:54:40', '2025-01-27 16:54:40', 0, 'BANK', 0, 26, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(56, 'EXPENSE', '2025-01-27 00:00:00', '', 'addd', '', 699, '2025-01-27 17:16:12', '2025-01-27 17:16:12', 0, 'CREDIT_CARD', 0, 29, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(57, 'INCOME', '2025-01-27 00:00:00', '', 'hhh', '', 999, '2025-01-27 17:18:01', '2025-01-27 17:18:01', 0, 'PERSONNEL', 0, 28, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(58, 'INCOME', '2025-01-27 00:00:00', '', '+++', '', 199, '2025-01-27 17:18:42', '2025-01-27 17:18:42', 0, 'PAYABLE_RECEIVABLE', 0, 27, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(59, 'INCOME', '2025-01-27 00:00:00', '', 'adding in akki', '', 201, '2025-01-27 17:20:06', '2025-01-27 17:20:06', 0, 'BANK', 0, 25, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(60, 'EXPENSE', '2025-01-27 00:00:00', '', 'adding', '', 500, '2025-01-27 17:20:32', '2025-01-27 17:20:32', 0, 'BANK', 0, 26, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(61, 'INCOME', '2025-01-27 00:00:00', '', 'adding 2000', '', 2000, '2025-01-27 17:20:41', '2025-01-27 17:20:41', 0, 'BANK', 0, 26, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(62, 'INCOME', '2025-01-27 00:00:00', '', '', '', 100, '2025-01-27 17:24:38', '2025-01-27 17:24:38', 0, 'PERSONNEL', 0, 28, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(63, 'EXPENSE', '2025-01-27 00:00:00', '', '', '', 99, '2025-01-27 17:24:54', '2025-01-27 17:24:54', 0, 'PERSONNEL', 0, 28, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(64, 'INCOME', '2025-01-27 00:00:00', 'final', 'okk', 'credit card test', 55, '2025-01-27 17:27:37', '2025-01-27 17:27:37', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(65, 'INCOME', '2025-01-27 00:00:00', 'final', 'okk', 'Bank', 55, '2025-01-27 17:28:23', '2025-01-27 17:28:23', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(66, 'INCOME', '2025-01-27 00:00:00', 'final', '', 'credit card test', 1, '2025-01-27 17:29:50', '2025-01-27 17:29:50', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(67, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', 'credit card test', 4000, '2025-01-27 17:36:43', '2025-01-27 17:36:43', 0, 'PAYABLE_RECEIVABLE', 0, 29, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(68, 'INCOME', '2025-01-27 00:00:00', 'final', 'okk', 'credit card test', 99, '2025-01-27 17:38:39', '2025-01-27 17:38:39', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(69, 'INCOME', '2025-01-27 00:00:00', 'final', '', 'credit card test', 99, '2025-01-27 17:40:08', '2025-01-27 17:40:08', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(70, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', 'credit card test', 4000, '2025-01-27 17:40:53', '2025-01-27 17:40:53', NULL, 'None', 0, 29, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(71, 'INCOME', '2025-01-27 00:00:00', 'final', '', 'test personal', 1, '2025-01-27 17:41:43', '2025-01-27 17:41:43', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(72, 'INCOME', '2025-01-27 00:00:00', 'final', 'hh', 'akki', 99, '2025-01-27 17:42:14', '2025-01-27 17:42:14', NULL, 'None', 0, NULL, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(73, 'INCOME', '2025-01-27 00:00:00', 'final', '', 'akki', 99, '2025-01-27 17:54:53', '2025-01-27 17:54:53', NULL, 'None', 0, 25, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(74, 'EXPENSE', '2025-01-27 00:00:00', 'final', '', 'akki', 200, '2025-01-27 17:58:14', '2025-01-27 17:58:14', NULL, 'None', 0, 25, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(75, 'EXPENSE', '2025-01-27 00:00:00', '', '', '', 90, '2025-01-27 18:21:57', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(76, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', '123', 4000, '2025-01-29 06:23:20', '2025-01-29 06:23:20', 0, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(77, 'INCOME', '2024-02-15 00:00:00', 'final', 'good', '123', 4000, '2025-01-29 10:20:19', '2025-01-29 10:20:19', 0, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(78, 'INCOME', '2025-01-18 00:00:00', 'allu', 'All kinds of electronic devices like mobile phones, laptops, etc.', '27', 32544, '2025-01-29 10:21:35', '2025-01-29 10:21:35', 0, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(79, 'TRANSFER', '2025-01-31 00:00:00', 'Hello', 'test transfer', 'test', 10, '2025-01-31 03:18:24', '2025-01-31 03:18:24', 0, 'PERSONNEL', 0, 28, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(80, 'TRANSFER', '2025-01-31 00:00:00', 'Hello', 'hi', 'akki', 12, '2025-01-31 03:24:04', '2025-01-31 03:24:04', 0, 'PERSONNEL', 0, 28, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(81, 'TRANSFER', '2025-01-31 00:00:00', '', '', 'akki', 100, '2025-01-31 03:53:56', '2025-01-31 03:53:56', 0, 'BANK', 0, 26, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(82, 'INCOME', '2025-01-31 00:00:00', '', 'rent', '', 100, '2025-01-31 04:58:30', '2025-01-31 04:58:30', 0, 'BANK', 0, 25, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(83, 'EXPENSE', '2025-01-31 00:00:00', '', 'abc', '', 40, '2025-01-31 07:40:55', '2025-01-31 07:40:55', 0, 'BANK', 0, 25, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(85, 'TRANSFER', '2024-02-15 00:00:00', 'final', 'good', '6', 100, '2025-01-31 15:41:40', '2025-01-31 15:41:40', NULL, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(86, 'PAYMENT', '2025-01-31 00:00:00', 'Hello', 'air ticket', 'Bank', 15000, '2025-01-31 15:44:08', '2025-01-31 15:44:08', 0, 'SAVINGS', 0, 33, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(87, 'TRANSFER', '2024-02-15 00:00:00', 'final', 'good', '6', 100, '2025-01-31 15:45:07', '2025-01-31 15:45:07', NULL, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(88, 'TRANSFER', '2024-02-15 00:00:00', 'final', 'good', '6', 100, '2025-01-31 15:47:25', '2025-01-31 15:47:25', NULL, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(91, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'cash', '', 2000, '2025-01-31 16:42:17', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(92, 'INCOME', '2025-01-31 00:00:00', 'Uncategorized', 'ram', '', 1500, '2025-01-31 16:42:31', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(93, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'refund', '', 3000, '2025-01-31 16:43:00', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(94, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'refund', '', 3000, '2025-01-31 16:43:01', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(95, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'refund', '', 3000, '2025-01-31 16:43:02', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(96, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'refund', '', 3000, '2025-01-31 16:43:02', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(97, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', '1', '', 200, '2025-01-31 16:47:15', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(98, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'cash', '', 2000, '2025-01-31 16:47:59', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(99, 'INCOME', '2025-01-31 00:00:00', 'Uncategorized', 'receive cash', '', 5000, '2025-01-31 16:48:41', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(100, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'cash', '', 1000, '2025-01-31 17:09:43', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(101, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'data', '', 800, '2025-01-31 17:17:47', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(102, 'INCOME', '2025-01-31 00:00:00', 'Uncategorized', 'upi in travel ac', '', 5000, '2025-01-31 17:22:28', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(103, 'EXPENSE', '2025-01-31 00:00:00', 'Uncategorized', 'ticket for mumbai', '', 7500, '2025-01-31 17:23:06', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(104, 'INCOME', '2025-01-31 00:00:00', 'Uncategorized', 'test', '', 5000, '2025-01-31 17:27:42', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(105, 'EXPENSE', '2025-02-01 00:00:00', 'Uncategorized', 'helloo', '', 55, '2025-02-01 16:25:54', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(106, 'INCOME', '2025-02-01 00:00:00', 'Uncategorized', 'expense', '', 496, '2025-02-01 16:26:10', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(107, 'PAYMENT', '2025-02-01 00:00:00', 'Uncategorized', 'gshsh', 'xyz1', 666, '2025-02-01 16:26:32', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(108, 'EXPENSE', '2025-02-01 00:00:00', 'Uncategorized', 'chfu', '', 808080, '2025-02-01 16:54:26', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(109, 'EXPENSE', '2025-02-01 00:00:00', 'Uncategorized', 'ddd', '', 505080, '2025-02-01 16:54:47', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(110, 'INCOME', '2025-02-01 00:00:00', 'Uncategorized', 'hchc', '', 6886870, '2025-02-01 16:55:04', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(111, 'PAYMENT', '2025-02-01 00:00:00', 'expense', 'chchc', 'abc1', 68686900, '2025-02-01 16:55:24', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(112, 'COLLECTION', '2025-02-01 00:00:00', 'expense', 'hh vh', 'cashhhh', 202020, '2025-02-01 16:55:41', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(113, 'INCOME', NULL, 'Uncategorized', '', '11', 348, '2025-02-04 06:47:26', '2025-02-04 06:47:26', 0, 'PAYABLE_RECEIVABLE', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(114, 'INCOME', '2025-02-06 00:00:00', 'Uncategorized', 'vvh', '', 50000, '2025-02-05 18:34:14', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(115, 'EXPENSE', '2025-02-06 00:00:00', 'Uncategorized', 'hello', '', 10, '2025-02-06 03:01:27', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(116, 'INCOME', '2025-02-06 00:00:00', 'Uncategorized', 'income', '', 11470, '2025-02-06 03:02:02', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(117, 'PAYMENT', '2025-02-06 00:00:00', 'expense', 'payment', 'abc1', 2900000, '2025-02-06 03:02:25', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(118, 'COLLECTION', '2025-02-06 00:00:00', 'expense', 'collecyion', 'testing account', 58000000, '2025-02-06 03:02:53', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(119, 'EXPENSE', '2025-02-06 00:00:00', 'Uncategorized', 'xgxgcg', '', 800, '2025-02-06 03:13:06', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(120, 'INCOME', '2025-02-06 00:00:00', 'Uncategorized', 'chvhhv', '', 85580600, '2025-02-06 03:16:34', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(121, 'EXPENSE', '2025-02-06 00:00:00', 'Uncategorized', 'bvhhc', '', 975, '2025-02-06 03:29:53', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(122, 'EXPENSE', '2025-02-06 00:00:00', 'Uncategorized', 'g gvvy', '', 79800, '2025-02-06 03:31:09', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(123, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'hcgc', '34', 200, '2025-02-06 14:23:26', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(124, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'ugguguug', '30', 200, '2025-02-06 14:29:07', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(125, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'vhh', '30', 200, '2025-02-06 14:29:47', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(126, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'vgvghu', '30', 200, '2025-02-06 14:31:18', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(127, 'TRANSFER', '2024-02-15 00:00:00', 'final', 'good', '34', 1, '2025-02-06 14:33:15', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(128, 'TRANSFER', '2024-02-15 00:00:00', 'final', 'good', '34', 1, '2025-02-06 14:34:17', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(129, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'hello', '30', 200, '2025-02-06 14:36:45', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(130, 'TRANSFER', '2025-02-06 00:00:00', 'expense', '', '36', 200, '2025-02-06 14:40:21', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(131, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'hssh', '36', 200, '2025-02-06 14:41:19', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(132, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'cgcg', '30', 855386, '2025-02-06 14:47:30', '2025-02-24 07:35:29', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(133, 'TRANSFER', '2025-02-06 00:00:00', 'expense', 'for rent', '36', 100, '2025-02-06 17:17:08', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(134, 'EXPENSE', '2025-02-08 00:00:00', 'Uncategorized', 'hello', '', 500, '2025-02-08 10:58:50', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(136, 'ADD', '2025-02-08 00:00:00', 'Uncategorized', 'hello', '', 200, '2025-02-08 11:35:28', '2025-02-25 10:54:18', 1, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(137, 'SUBTRACT', '2025-02-08 00:00:00', 'Uncategorized', 'Adding substract', '', 2000, '2025-02-08 11:41:28', '2025-02-25 10:54:18', 1, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(138, 'ADD', '2025-02-08 00:00:00', 'Uncategorized', '', '', 2000, '2025-02-08 11:41:37', '2025-02-25 10:54:18', 1, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(139, 'ADD', '2025-02-08 00:00:00', 'Uncategorized', '1000', '', 200, '2025-02-08 11:41:50', '2025-02-25 10:54:18', 1, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(140, 'SUBTRACT', '2025-02-08 00:00:00', 'Uncategorized', 'minus', '', 700, '2025-02-08 11:42:37', '2025-02-25 10:54:18', 1, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(141, 'PAYMENT', '2025-02-13 00:00:00', 'Hello', 'test', '24', 50, '2025-02-13 11:04:14', '2025-02-13 11:04:14', 0, 'BANK', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(142, 'TRANSFER', '2025-02-13 00:00:00', 'Hello', 'testing amount', '24', 98, '2025-02-13 11:04:58', '2025-02-13 11:04:58', NULL, 'BANK', 0, 17, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(143, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'testing', '24', 50, '2025-02-13 11:07:01', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(144, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'for testing', '19', 10, '2025-02-13 11:10:48', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(146, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'transfer 40 in added', '24', 40, '2025-02-13 12:11:00', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(147, 'TRANSFER', '2025-02-13 00:00:00', 'expense', 'okk', '32', 50, '2025-02-13 16:23:01', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(148, 'TRANSFER', '2025-02-13 00:00:00', 'expense', '', '38', 10, '2025-02-13 16:25:45', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(149, 'TRANSFER', '2025-02-13 00:00:00', 'expense', 'vwba', '24', 10, '2025-02-13 16:27:34', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(150, 'EXPENSE', '2025-02-13 00:00:00', 'Uncategorized', 'hello test', '', 10, '2025-02-13 16:28:02', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(151, 'INCOME', '2025-02-13 00:00:00', 'Uncategorized', 'income test', '', 10, '2025-02-13 16:28:16', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(152, 'PAYMENT', '2025-02-13 00:00:00', 'expense', 'test payment', '32', 10, '2025-02-13 16:28:30', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(153, 'COLLECTION', '2025-02-13 00:00:00', 'expense', 'hello collection', '32', 10, '2025-02-13 16:28:44', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(154, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'hello transafer', '32', 10, '2025-02-13 16:29:00', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(155, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'good', '32', 20, '2025-02-13 16:39:04', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(156, 'TRANSFER', '2025-02-13 00:00:00', 'expense', 'nsjjs', '32', 10, '2025-02-13 16:40:07', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(157, 'TRANSFER', '2025-02-13 00:00:00', 'expense', 'okkk', '32', 10, '2025-02-13 16:40:50', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(158, 'TRANSFER', '2025-02-13 00:00:00', 'expense', 'hhy', '28', 10, '2025-02-13 16:41:55', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(159, 'TRANSFER', '2025-02-13 00:00:00', 'expense', 'ghg', '19', 10, '2025-02-13 16:42:31', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(160, 'TRANSFER', '2025-02-13 00:00:00', 'expense', 'good', '19', 20, '2025-02-13 16:43:56', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(161, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'good', '32', 20, '2025-02-15 10:22:58', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(162, 'EXPENSE', '2025-02-16 00:00:00', 'Uncategorized', 'helloo', '', 11, '2025-02-16 06:08:00', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(163, 'INCOME', '2025-02-19 00:00:00', 'Uncategorized', 'Air ticket', '', 27000, '2025-02-19 08:34:24', '2025-02-19 08:34:24', 0, 'SAVINGS', 0, 33, 16, NULL, 0, NULL, NULL, NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(164, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'bh', '', 80, '2025-02-23 14:18:04', '2025-02-24 07:35:29', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS23022025164', NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(165, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'hh', '', 8, '2025-02-23 15:21:59', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025165', NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(166, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'm', '', 69, '2025-02-23 15:24:04', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS23022025166', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(167, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'helll', '', 99, '2025-02-23 15:25:15', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS23022025167', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(168, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'good', '32', 20, '2025-02-23 15:28:36', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025168', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(169, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'h', '', 9090, '2025-02-23 15:30:32', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS23022025169', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(170, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'good', '32', 20, '2025-02-23 15:30:41', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025170', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(171, 'EXPENSE', '2025-02-13 00:00:00', 'allu', 'good', '32', 20, '2025-02-23 15:30:50', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025171', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(172, 'EXPENSE', '2025-02-13 00:00:00', 'allu', 'good', '', 20, '2025-02-23 15:31:19', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS23022025172', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(173, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'hl', '', 69, '2025-02-23 15:32:12', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025173', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(175, 'INCOME', '2025-02-13 00:00:00', 'allu', 'good', '', 20, '2025-02-23 15:33:36', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS23022025175', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(176, 'INCOME', '2025-02-13 00:00:00', 'allu', 'good', '', 20, '2025-02-23 15:36:44', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS23022025176', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(177, 'INCOME', '2025-02-13 00:00:00', 'allu', 'good', '30', 20, '2025-02-23 15:37:47', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS23022025177', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(178, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'cg', '', 69, '2025-02-23 15:50:53', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025178', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(179, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'h', '', 309, '2025-02-23 15:51:48', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025179', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(180, 'EXPENSE', '2025-02-23 00:00:00', 'Uncategorized', 'bb', '6', 909, '2025-02-23 15:52:40', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025180', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(181, 'INCOME', '2025-02-23 00:00:00', 'Uncategorized', 'h', '6', 90, '2025-02-23 15:52:53', '2025-02-25 10:54:18', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025181', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(182, 'PAYMENT', '2025-02-23 00:00:00', 'helloooo', 'hello', '6', 800, '2025-02-23 15:53:13', '2025-02-23 16:29:38', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS23022025182', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(183, 'LEND', '2025-03-01 00:00:00', 'Hello', 'fe', '11', 4351, '2025-02-24 06:43:08', '2025-02-25 10:56:16', 0, 'PAYABLE_RECEIVABLE', 0, 19, 16, NULL, 1, NULL, 'TRS24022025183', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(184, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'good', '32', 20, '2025-02-24 06:44:55', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS24022025184', NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(185, 'TRANSFER', '2025-02-13 00:00:00', 'allu', 'good', '32', 20, '2025-02-24 06:45:49', '2025-02-25 10:54:18', NULL, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS24022025185', NULL, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(186, 'INCOME', '2025-02-13 00:00:00', 'allu', 'good', '30', 20, '2025-02-24 07:01:30', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS24022025186', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(187, 'INCOME', '2025-02-13 00:00:00', 'allu', 'good', '30', 20, '2025-02-24 07:06:53', '2025-02-24 18:22:08', 0, 'CASH', 1, 30, 16, NULL, 1, '2025-02-24 00:00:00', 'TRS24022025187', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(188, 'INCOME', '2025-02-08 00:00:00', 'dg', 'dssf', '32', 232, '2025-02-24 07:11:25', '2025-02-24 07:37:29', 0, 'PAYABLE_RECEIVABLE', 0, 34, 16, NULL, 1, NULL, 'TRS24022025188', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(190, 'INCOME', '2025-03-01 00:00:00', 'allu', 'All kinds of electronic devices like mobile phones, laptops, etc.', '28', 3546, '2025-02-24 08:39:05', '2025-02-24 08:39:05', 0, 'PAYABLE_RECEIVABLE', 0, 18, 22, NULL, 0, NULL, 'TRS24022025190', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(191, 'INCOME', '2025-03-01 00:00:00', 'allu', 'All kinds of electronic devices like mobile phones, laptops, etc.', '28', 3546, '2025-02-24 08:40:53', '2025-02-24 08:40:54', 0, 'PAYABLE_RECEIVABLE', 0, 18, 22, NULL, 0, NULL, 'TRS24022025191', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(192, 'INCOME', '2025-03-01 00:00:00', 'allu', 'All kinds of electronic devices like mobile phones, laptops, etc.', '28', 3546, '2025-02-24 08:41:25', '2025-02-24 08:41:26', 0, 'PAYABLE_RECEIVABLE', 0, 18, 22, NULL, 0, NULL, 'TRS24022025192', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(193, 'INCOME', '2025-03-01 00:00:00', 'allu', 'All kinds of electronic devices like mobile phones, laptops, etc.', '28', 3546, '2025-02-24 08:41:50', '2025-02-24 08:41:51', 0, 'PAYABLE_RECEIVABLE', 0, 18, 22, NULL, 0, NULL, 'TRS24022025193', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(194, 'INCOME', '2025-03-01 00:00:00', 'allu', 'All kinds of electronic devices like mobile phones, laptops, etc.', '28', 3546, '2025-02-24 08:43:24', '2025-02-24 08:43:24', 0, 'PAYABLE_RECEIVABLE', 0, 18, 22, NULL, 0, NULL, 'TRS24022025194', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(195, 'INCOME', '2025-02-13 00:00:00', 'Hello', 'All kinds of electronic devices like mobile phones, laptops, etc.', '19', 765, '2025-02-24 08:43:49', '2025-02-24 08:43:50', 0, 'PAYABLE_RECEIVABLE', 0, 36, 22, NULL, 0, NULL, 'TRS24022025195', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(196, 'INCOME', '2025-02-10 00:00:00', 'allu', 'jh', '19', 765, '2025-02-24 08:44:32', '2025-02-24 08:44:32', 0, 'PAYABLE_RECEIVABLE', 0, 36, 22, NULL, 0, NULL, 'TRS24022025196', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(197, 'INCOME', '2025-02-08 00:00:00', 'Hello', '', '41', 35, '2025-02-24 08:55:17', '2025-02-24 19:33:20', 0, 'PAYABLE_RECEIVABLE', 0, 41, 22, NULL, 1, NULL, 'TRS24022025197', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(198, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'well done', '34', 100, '2025-02-25 03:40:07', '2025-02-25 09:13:43', 0, 'CASH', 0, 34, 18, NULL, 1, NULL, 'TRS25022025198', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(199, 'INCOME', '2025-02-25 00:00:00', 'Uncategorized', 'good', '42', 100, '2025-02-25 03:41:28', '2025-02-25 03:41:28', 0, 'BANK', 0, 42, 18, NULL, 0, NULL, 'TRS25022025199', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(200, 'TRANSFER', '2025-02-25 00:00:00', 'expense', 'for rent', '42', 10, '2025-02-25 03:42:28', '2025-02-25 03:42:28', NULL, 'BANK', 0, 42, 18, NULL, 0, NULL, 'TRS25022025200', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(201, 'TRANSFER', '2025-02-25 00:00:00', 'expense', 'good', '42', 10, '2025-02-25 03:43:16', '2025-02-25 03:43:16', NULL, 'BANK', 0, 42, 18, NULL, 1, NULL, 'TRS25022025201', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(202, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'Air Ticket', '43', 25300, '2025-02-25 08:04:45', '2025-02-25 09:12:22', 0, 'SAVINGS', 0, 43, 18, NULL, 1, NULL, 'TRS25022025202', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(203, 'INCOME', '2025-02-25 00:00:00', 'Uncategorized', 'Cash Received', '43', 1200, '2025-02-25 08:05:39', '2025-02-25 09:12:22', 0, 'SAVINGS', 0, 43, 18, NULL, 1, NULL, 'TRS25022025203', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(204, 'INCOME', '2025-02-25 00:00:00', 'Uncategorized', 'Cash Received from Santosh', '43', 124000, '2025-02-25 08:07:10', '2025-02-25 09:12:22', 0, 'SAVINGS', 0, 43, 18, NULL, 1, NULL, 'TRS25022025204', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(205, 'TRANSFER', '2025-02-25 00:00:00', 'dg', 'Cash deposit to bank', '43', 43000, '2025-02-25 08:08:02', '2025-02-25 09:12:22', NULL, 'SAVINGS', 0, 43, 18, NULL, 1, NULL, 'TRS25022025205', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(206, 'TRANSFER', '2025-02-25 00:00:00', 'expense', 'cash paid', '43', 90000, '2025-02-25 08:24:01', '2025-02-25 09:12:22', NULL, 'SAVINGS', 0, 43, 18, NULL, 1, NULL, 'TRS25022025206', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(207, 'INCOME', '2025-02-20 00:00:00', 'allu', 'f', '49', 7632, '2025-02-25 10:58:06', '2025-02-25 10:58:37', 0, 'PAYABLE_RECEIVABLE', 0, 40, 16, NULL, 1, NULL, 'TRS25022025207', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(208, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'y', '40', 8, '2025-02-25 17:25:21', '2025-02-25 18:44:39', NULL, 'None', 0, 40, 16, NULL, 1, NULL, 'TRS25022025208', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(209, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'y', '40', 8, '2025-02-25 17:28:41', '2025-02-25 18:44:39', NULL, 'None', 0, 40, 16, NULL, 1, NULL, 'TRS25022025209', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(210, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'cggv', '40', 8, '2025-02-25 17:29:49', '2025-02-25 18:44:39', NULL, 'None', 0, 40, 16, NULL, 1, NULL, 'TRS25022025210', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(211, 'EXPENSE', '2025-02-25 00:00:00', 'expk', 'cggv', '40', 8, '2025-02-25 17:30:31', '2025-02-25 18:44:39', NULL, 'None', 0, 40, 16, NULL, 1, NULL, 'TRS25022025211', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(212, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'cggv', '40', 8, '2025-02-25 17:30:49', '2025-02-25 18:44:39', NULL, 'None', 0, 40, 16, NULL, 1, NULL, 'TRS25022025212', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(213, 'EXPENSE', '2025-02-25 00:00:00', 'allu', 'good', '40', 20, '2025-02-25 17:32:46', '2025-02-25 18:44:39', 0, 'CASH', 0, 40, 16, NULL, 1, NULL, 'TRS25022025213', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(214, 'EXPENSE', '2025-02-25 00:00:00', 'allu', 'good', '40', 20, '2025-02-25 17:35:42', '2025-02-25 18:44:39', 0, 'CASH', 0, 40, 16, NULL, 1, NULL, 'TRS25022025214', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(215, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'ghh', '18', 70, '2025-02-25 17:36:30', '2025-02-25 17:36:30', NULL, 'None', 0, 18, 16, NULL, 0, NULL, 'TRS25022025215', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(216, 'EXPENSE', '2025-02-25 00:00:00', 'Uncategorized', 'ghh', '17', 70, '2025-02-25 17:37:49', '2025-02-25 17:37:49', NULL, 'None', 0, 17, 16, NULL, 0, NULL, 'TRS25022025216', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(217, 'EXPENSE', '2025-02-26 00:00:00', 'Uncategorized', 'Test', '30', 599, '2025-02-25 18:42:19', '2025-02-25 18:44:26', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS25022025217', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(218, 'INCOME', NULL, 'Uncategorized', '', '53', 100, '2025-02-26 09:23:25', '2025-02-26 09:23:25', 0, 'PAYABLE_RECEIVABLE', 0, 58, 16, NULL, 0, NULL, 'TRS26022025218', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(219, 'TRANSFER', NULL, 'Uncategorized', 'Cash rece', '53', 100, '2025-02-26 09:24:37', '2025-02-26 09:24:37', NULL, 'PAYABLE_RECEIVABLE', 0, 58, 16, NULL, 0, NULL, 'TRS26022025219', 1, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(220, 'EXPENSE', '2025-02-26 00:00:00', 'Uncategorized', 'Testing Image', '30', 90, '2025-02-26 15:29:51', '2025-03-02 12:14:22', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025220', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(221, 'TRANSFER', '2025-02-26 00:00:00', 'expense', 'Test', '30', 100, '2025-02-26 15:59:48', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025221', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(222, 'TRANSFER', '2025-02-26 00:00:00', 'helloooo', 'Test', '30', 199, '2025-02-26 16:05:32', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025222', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(223, 'TRANSFER', '2025-02-26 00:00:00', 'helloooo', 'Testinggg', '18', 299, '2025-02-26 16:08:11', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025223', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(224, 'TRANSFER', '2025-02-26 00:00:00', 'expense', '399 check', '40', 399, '2025-02-26 16:09:15', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025224', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(225, 'TRANSFER', '2025-02-26 00:00:00', 'expense', 'hello test', '40', 74, '2025-02-26 16:13:41', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025225', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(226, 'EXPENSE', '2025-02-26 00:00:00', 'Uncategorized', 'Expese Test', 'null', 100, '2025-02-26 16:15:18', '2025-03-02 12:14:22', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025226', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(227, 'EXPENSE', '2025-02-26 00:00:00', 'Uncategorized', 'Expense Tesy', 'null', 299, '2025-02-26 16:17:10', '2025-03-02 12:14:22', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025227', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(228, 'EXPENSE', '2025-02-26 00:00:00', 'Uncategorized', 'Description', '30', 200, '2025-02-26 16:18:27', '2025-03-02 12:14:22', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025228', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(229, 'INCOME', '2025-02-26 00:00:00', 'Uncategorized', 'Income', '30', 300, '2025-02-26 16:18:49', '2025-03-02 12:14:22', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025229', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(230, 'PAYMENT', '2025-02-26 00:00:00', 'helloooo', 'Descriptiom', '40', 1999, '2025-02-26 16:19:35', '2025-03-02 12:14:22', 0, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025230', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(231, 'ADD', '2025-02-26 00:00:00', 'Uncategorized', 'Add', '30', 2000, '2025-02-26 16:22:54', '2025-03-02 12:14:22', 1, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS26022025231', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(232, 'EXPENSE', '2025-02-26 00:00:00', 'Uncategorized', 'Hello', '6', 99, '2025-02-26 17:03:44', '2025-03-02 12:14:54', 0, 'CASH', 0, 6, 16, NULL, 1, NULL, 'TRS26022025232', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(233, 'EXPENSE', '2025-02-25 00:00:00', 'allu', 'good', '40', 20, '2025-02-26 17:33:25', '2025-03-02 12:33:40', 0, 'CASH', 0, 40, 16, NULL, 1, NULL, 'TRS26022025233', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(234, 'PAYMENT', '2025-02-27 00:00:00', 'helloooo', 'rent', '44', 10, '2025-02-27 04:28:10', '2025-02-27 04:28:10', NULL, 'BANK', 0, 42, 18, NULL, 0, NULL, 'TRS27022025234', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(235, 'TRANSFER', '2025-02-27 00:00:00', 'dg', 'test', '25', 100, '2025-02-27 04:30:12', '2025-02-27 04:30:12', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025235', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(236, 'TRANSFER', '2025-02-27 00:00:00', 'allu', 'rent', '44', 100, '2025-02-27 04:30:54', '2025-02-27 04:30:54', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025236', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(237, 'TRANSFER', '2025-02-27 00:00:00', 'helloooo', 'good', '42', 700, '2025-02-27 04:32:21', '2025-02-27 04:32:21', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025237', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(238, 'ADD', '2025-02-27 00:00:00', 'Uncategorized', '', '34', 55, '2025-02-27 05:33:59', '2025-02-27 05:33:59', 1, 'CASH', 0, 34, 18, NULL, 0, NULL, 'TRS27022025238', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(239, 'TRANSFER', '2025-02-27 00:00:00', 'Hello', 'fff', '43', 22, '2025-02-27 11:15:01', '2025-02-27 11:15:01', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025239', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(240, 'EXPENSE', '2025-02-25 00:00:00', 'allu', 'good', '40', 20, '2025-02-27 13:15:53', '2025-03-02 12:33:40', 0, 'CASH', 0, 40, 16, NULL, 1, NULL, 'TRS27022025240', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(241, 'EXPENSE', '2025-02-25 00:00:00', 'allu', 'good', '40', 20, '2025-02-27 13:25:16', '2025-03-02 12:33:40', 0, 'CASH', 0, 40, 16, NULL, 1, NULL, 'TRS27022025241', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(242, 'INCOME', '2025-02-27 00:00:00', 'expense', 'FGFG', '62', 5, '2025-02-27 13:37:08', '2025-02-27 13:37:08', 0, 'BANK', 0, 62, 18, NULL, 0, NULL, 'TRS27022025242', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(243, 'TRANSFER', '2025-02-27 00:00:00', 'Hello', 'test', '42', 20, '2025-02-27 13:43:54', '2025-02-27 13:43:54', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025243', 35, NULL, 'None', 'payable test', 'Rakesh', NULL, NULL, 0, NULL);
INSERT INTO `transactions` (`id`, `transaction_type`, `transaction_date`, `category`, `description`, `to_account`, `amount`, `createdAt`, `updatedAt`, `starting_balance`, `account_type`, `account_settled`, `accountId`, `bookId`, `transaction_time`, `view_by_superAdmin`, `acc_setled_date`, `transaction_id`, `userId`, `upload_image`, `settlement_status`, `target_acc_name`, `source_acc_name`, `coll_kisht_type`, `coll_emi_times`, `coll_total_amount`, `coll_emiDue_date`) VALUES
(244, 'TRANSFER', '2025-02-27 00:00:00', 'Hello', 'test', '42', 20, '2025-02-27 13:46:03', '2025-02-27 13:46:03', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025244', 35, NULL, 'None', 'sbi', 'Rakesh', NULL, NULL, 0, NULL),
(245, 'EXPENSE', '2025-02-27 00:00:00', 'Uncategorized', 'we', 'null', 12, '2025-02-27 16:36:59', '2025-02-27 16:36:59', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025245', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(246, 'EXPENSE', '2025-02-27 00:00:00', 'Uncategorized', 'vcv', 'null', 3, '2025-02-27 18:03:23', '2025-02-27 18:03:23', 0, 'BANK', 0, 61, 18, NULL, 0, NULL, 'TRS27022025246', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(247, 'EXPENSE', '2025-02-27 00:00:00', 'Uncategorized', 'demo', 'null', 4, '2025-02-27 18:16:53', '2025-02-27 18:16:53', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025247', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(248, 'EXPENSE', '2025-02-28 00:00:00', 'Uncategorized', 'xx', '43', 3, '2025-02-27 18:31:15', '2025-02-27 18:31:15', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025248', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(249, 'EXPENSE', '2025-02-28 00:00:00', 'Uncategorized', 'xcxc', '43', 333, '2025-02-27 18:31:39', '2025-02-27 18:31:40', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025249', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(250, 'INCOME', '2025-02-28 00:00:00', 'Uncategorized', 'cvvcv', '43', 44, '2025-02-27 18:31:56', '2025-02-27 18:31:57', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025250', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(251, 'PAYMENT', '2025-02-28 00:00:00', 'Hello', 'paymenyyyy', '43', 3, '2025-02-27 18:32:24', '2025-02-27 18:32:24', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025251', 35, NULL, 'None', 'Rakesh', 'tea acc', NULL, NULL, 0, NULL),
(252, 'PAYMENT', '2025-02-28 00:00:00', 'Hello', 'hh', '43', 3, '2025-02-27 18:32:57', '2025-02-27 18:32:57', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025252', 35, NULL, 'None', 'Rakesh', 'dsdsd', NULL, NULL, 0, NULL),
(253, 'COLLECTION', '2025-02-28 00:00:00', 'allu', 'rrt', '43', 66, '2025-02-27 18:33:51', '2025-02-27 18:33:51', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025253', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(254, 'TRANSFER', '2025-02-28 00:00:00', 'expense', 'dddd', '43', 12, '2025-02-27 18:34:24', '2025-02-27 18:34:24', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025254', 35, NULL, 'None', 'added', 'Rakesh', NULL, NULL, 0, NULL),
(255, 'ADD', '2025-02-28 00:00:00', 'Uncategorized', '3443', '43', 12, '2025-02-27 18:34:56', '2025-02-27 18:34:56', 1, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025255', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(256, 'TRANSFER', '2025-02-28 00:00:00', 'Hello', 'data', '43', 44, '2025-02-27 18:35:46', '2025-02-27 18:35:46', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025256', 35, NULL, 'None', 'payable test', 'Rakesh', NULL, NULL, 0, NULL),
(257, 'SUBTRACT', '2025-02-28 00:00:00', 'Uncategorized', 'sdds', '43', 34, '2025-02-27 18:36:17', '2025-02-27 18:36:17', 1, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025257', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(258, 'TRANSFER', '2025-02-28 00:00:00', 'allu', '43bvb', '43', 45, '2025-02-27 18:49:31', '2025-02-27 18:49:31', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS27022025258', 35, NULL, 'None', 'efefefdfd', 'Rakesh', NULL, NULL, 0, NULL),
(259, 'TRANSFER', '2025-02-28 00:00:00', 'allu', 'transefar', '43', 12, '2025-02-28 06:49:01', '2025-02-28 06:49:01', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS28022025259', 35, NULL, 'None', 'tea acc', 'Rakesh', NULL, NULL, 0, NULL),
(260, 'TRANSFER', '2025-02-25 00:00:00', 'allu', 'good', '40', 20, '2025-02-28 06:49:42', '2025-03-02 12:33:40', NULL, 'CASH', 0, 40, 16, NULL, 1, NULL, 'TRS28022025260', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(261, 'TRANSFER', '2025-02-28 00:00:00', 'allu', 'good', '40', 20, '2025-02-28 06:50:48', '2025-02-28 06:50:48', NULL, 'CASH', 0, 35, 18, NULL, 0, NULL, 'TRS28022025261', 43, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(262, 'TRANSFER', '2025-02-28 00:00:00', 'allu', 'good', '43', 20, '2025-02-28 06:51:10', '2025-02-28 06:51:10', NULL, 'CASH', 0, 35, 18, NULL, 0, NULL, 'TRS28022025262', 43, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(263, 'TRANSFER', '2025-02-27 00:00:00', 'allu', 'good', '30', 20, '2025-02-28 07:00:49', '2025-03-01 12:34:58', NULL, 'CASH', 0, 35, 18, NULL, 0, '2025-03-01 00:00:00', 'TRS28022025263', 35, NULL, 'Pending', NULL, NULL, NULL, NULL, 0, NULL),
(264, 'TRANSFER', '2025-02-28 00:00:00', 'allu', 'good', '43', 20, '2025-02-28 07:01:50', '2025-02-28 07:01:50', NULL, 'CASH', 0, 35, 18, NULL, 0, NULL, 'TRS28022025264', 43, 'upload_image/upload_image_1740726109226.jpg', 'None', NULL, NULL, NULL, NULL, 0, NULL),
(265, 'EXPENSE', '2025-02-28 00:00:00', 'allu', 'good', '43', 20, '2025-02-28 07:02:08', '2025-02-28 07:02:08', 0, 'CASH', 0, 35, 18, NULL, 0, NULL, 'TRS28022025265', 43, 'upload_image/upload_image_1740726126934.jpg', 'None', NULL, NULL, NULL, NULL, 0, NULL),
(266, 'EXPENSE', '2025-02-28 00:00:00', 'allu', 'good', '43', 20, '2025-02-28 07:04:05', '2025-02-28 07:04:05', 0, 'CASH', 0, 35, 18, NULL, 0, NULL, 'TRS28022025266', 43, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(267, 'EXPENSE', '2025-02-28 00:00:00', 'Uncategorized', 'rrr', '46', 1, '2025-02-28 09:11:24', '2025-02-28 09:11:24', 0, 'PERSONNEL', 0, 46, 18, NULL, 0, NULL, 'TRS28022025267', 35, 'upload_image/upload_image_1740733884723.jpg', 'None', NULL, NULL, NULL, NULL, 0, NULL),
(268, 'EXPENSE', '2025-02-28 00:00:00', 'Uncategorized', 'test for image', '43', 11.2, '2025-02-28 09:33:50', '2025-02-28 09:33:50', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS28022025268', 35, 'upload_image/upload_image_1740735230101.jpg', 'None', NULL, NULL, NULL, NULL, 0, NULL),
(269, 'TRANSFER', '2025-02-28 00:00:00', 'expense', 'ccv', '42', 5, '2025-02-28 10:59:46', '2025-02-28 10:59:46', NULL, 'BANK', 0, 42, 18, NULL, 0, NULL, 'TRS28022025269', 36, NULL, 'None', 'Akash Acc', 'Sbi', NULL, NULL, 0, NULL),
(270, 'PAYMENT', '2025-02-28 00:00:00', 'Hello', 'dd', '42', 2, '2025-02-28 11:00:28', '2025-02-28 11:00:28', NULL, 'BANK', 0, 42, 18, NULL, 0, NULL, 'TRS28022025270', 36, NULL, 'None', 'efefefdfd', 'Sbi', NULL, NULL, 0, NULL),
(271, 'TRANSFER', '2025-03-01 00:00:00', 'allu', 'good', '36', 20, '2025-03-02 05:51:04', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS02032025271', 30, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(272, 'TRANSFER', '2025-03-02 00:00:00', 'dg', '2 feb', '42', 12, '2025-03-02 06:43:02', '2025-03-02 06:43:02', NULL, 'BANK', 0, 42, 18, NULL, 0, NULL, 'TRS02032025272', 35, NULL, 'None', 'Santosh ', 'Sbi', NULL, NULL, 0, NULL),
(273, 'COLLECTION', '2025-03-02 00:00:00', 'allu', 'good', '36', 20, '2025-03-02 09:13:38', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS02032025273', 30, NULL, 'None', 'xyz1', 'cashhhh', 'monthly', 5, 1000, '2025-03-02 00:00:00'),
(274, 'COLLECTION', '2025-03-02 00:00:00', 'allu', 'good', '36', 10, '2025-03-02 09:22:11', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, NULL, 1, NULL, 'TRS02032025274', 30, NULL, 'None', 'xyz1', 'cashhhh', 'monthly', 5, 1000, '2025-03-02 00:00:00'),
(275, 'COLLECTION', '2025-03-02 12:00:00', 'EMI', 'Scheduled EMI payment', '36', 200, '2025-03-02 12:00:00', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, '2025-03-02T12:00:00.691Z', 1, NULL, 'TRS02032025275', 30, NULL, 'None', 'xyz1', 'cashhhh', 'monthly', 4, 800, '2025-04-02 00:00:00'),
(276, 'COLLECTION', '2025-03-02 12:00:00', 'EMI', 'Scheduled EMI payment', '36', 200, '2025-03-02 12:00:00', '2025-03-02 12:14:22', NULL, 'CASH', 0, 30, 16, '2025-03-02T12:00:00.702Z', 1, NULL, 'TRS02032025276', 30, NULL, 'None', 'xyz1', 'cashhhh', 'monthly', 4, 800, '2025-04-02 00:00:00'),
(277, 'COLLECTION', '2025-03-03 00:00:00', 'allu', '455', '43', 3640, '2025-03-03 06:52:34', '2025-03-03 06:52:34', NULL, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS03032025277', 35, NULL, 'None', 'efefefdfd', 'Rakesh', 'EVERY 2 MONTH', 8, 3640, '2026-07-03 00:00:00'),
(278, 'INCOME', '2025-03-03 00:00:00', 'Uncategorized', 'rffr', '43', 55, '2025-03-03 06:54:32', '2025-03-03 06:54:32', 0, 'SAVINGS', 0, 43, 18, NULL, 0, NULL, 'TRS03032025278', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(279, 'INCOME', '2025-03-03 00:00:00', 'Uncategorized', 'rrr', '51', 600, '2025-03-03 07:16:54', '2025-03-03 07:16:54', 0, 'PERSONNEL', 0, 51, 18, NULL, 0, NULL, 'TRS03032025279', 35, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(280, 'COLLECTION', '2025-03-03 00:00:00', 'dg', 'collecasion', '51', 3577, '2025-03-03 07:18:26', '2025-03-03 07:18:26', NULL, 'PERSONNEL', 0, 51, 18, NULL, 0, NULL, 'TRS03032025280', 35, NULL, 'None', 'added', 'Dipank', 'MONTHLY', 7, 3577, '2025-10-03 00:00:00'),
(281, 'TRANSFER', '2025-03-03 00:00:00', 'Uncategorized', 'For Rent', '6', 100, '2025-03-03 09:11:54', '2025-03-03 09:11:54', NULL, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025281', 36, NULL, 'None', 'sbi', 'Akash Acc', NULL, NULL, 0, NULL),
(282, 'TRANSFER', '2025-03-03 00:00:00', 'Hello', 'jgjjabb', '6', 4, '2025-03-03 09:14:45', '2025-03-03 09:14:45', NULL, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025282', 36, NULL, 'None', 'sbi', 'Akash Acc', NULL, NULL, 0, NULL),
(283, 'INCOME', '2025-03-03 00:00:00', 'Uncategorized', 'Income', '6', 20, '2025-03-03 09:20:35', '2025-03-03 09:20:35', 0, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025283', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(284, 'EXPENSE', '2025-03-03 00:00:00', 'Uncategorized', 'Expensive', '6', 20, '2025-03-03 09:20:55', '2025-03-03 09:20:55', 0, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025284', 36, NULL, 'None', NULL, NULL, NULL, NULL, 0, NULL),
(285, 'PAYMENT', '2025-03-03 00:00:00', 'Hello', 'payment', '6', 20, '2025-03-03 09:21:31', '2025-03-03 09:21:31', NULL, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025285', 36, NULL, 'None', 'sbi', 'Akash Acc', NULL, NULL, 0, NULL),
(286, 'COLLECTION', '2025-03-03 00:00:00', 'Hello', 'Emi', '6', 500, '2025-03-03 09:25:16', '2025-03-03 09:25:16', NULL, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025286', 36, NULL, 'None', 'sbi', 'Akash Acc', 'null', 5, 500, '2025-08-03 00:00:00'),
(287, 'PAYMENT', '2025-03-03 00:00:00', 'Hello', 'TESTPP', '63', 5, '2025-03-03 10:43:55', '2025-03-03 10:43:55', NULL, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025287', 36, NULL, 'None', 'sakln', 'Akash Acc', NULL, NULL, 0, NULL),
(288, 'PAYMENT', '2025-03-03 00:00:00', 'dg', 'RRTT', '59', 4, '2025-03-03 10:45:51', '2025-03-03 10:45:51', NULL, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025288', 36, NULL, 'None', 'efefefdfd', 'Akash Acc', NULL, NULL, 0, NULL),
(289, 'TRANSFER', '2025-03-03 00:00:00', 'allu', 'RTTT', '63', 5, '2025-03-03 10:52:32', '2025-03-03 10:52:32', NULL, 'CASH', 0, 6, 16, NULL, 0, NULL, 'TRS03032025289', 36, NULL, 'None', 'sakln', 'Akash Acc', NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `user_status` enum('Online','Offline') DEFAULT NULL,
  `email_id` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userIp` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_verify` tinyint(1) DEFAULT '0',
  `is_verify` tinyint(1) DEFAULT '0',
  `status` enum('verified','rejected','suspended') DEFAULT 'verified',
  `notification` tinyint(1) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `login_from` varchar(255) DEFAULT NULL,
  `device_token` varchar(255) DEFAULT NULL,
  `follow_count` int DEFAULT '0',
  `remember_token` varchar(255) DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `refreshToken_Expiration` varchar(255) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `new_password` varchar(255) DEFAULT NULL,
  `confirm_new_password` varchar(255) DEFAULT NULL,
  `user_type` enum('user','admin','super_admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `gender`, `name`, `phone_no`, `country`, `city`, `user_status`, `email_id`, `password`, `userIp`, `profile_image`, `otp`, `otp_verify`, `is_verify`, `status`, `notification`, `device_id`, `login_from`, `device_token`, `follow_count`, `remember_token`, `refreshToken`, `refreshToken_Expiration`, `is_public`, `is_active`, `createdAt`, `updatedAt`, `new_password`, `confirm_new_password`, `user_type`) VALUES
(1, 'male', 'Supper Admin', '8877665544', NULL, NULL, 'Online', 'lmrhub@gmail.com', '$2b$10$72YITnWyoupaldrCbEu/g.2/dzWLmjN4lENFzNGgUJ6eyA9Kmwgta', '::ffff:150.129.31.201', NULL, '1234', 1, 1, 'verified', NULL, 'ehU4w9oMQyq2iX4m1G5i6n:APA91bE9xGosk2iUP-dqkZwHjy53xfb2U5um1K6KOmxMdhubcbpfxx5t11yvhKgP85zksfMHBr8-iZeB0vEDaqxvK3fMgcm007-gepuiQ7lKyM0LMpWlBCo', 'web', NULL, 0, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDEwMDIzOTIsImV4cCI6MTc0MTYwNzE5Mn0.mHLcZE7cCpu5yrpuYOBTI5KLYR03EERk_58MMQaKp7w', '1741607192861', 1, 1, '2025-01-02 15:19:51', '2025-03-03 11:46:32', NULL, NULL, 'super_admin'),
(2, NULL, 'A', '8877665546', NULL, NULL, NULL, 'a@gmail.com', '$2b$10$kLDoL6TfqE0KuwoHRlxXUeM0MNc4N8Xb41cP7XuIQ6SRoYFk6oTMG', NULL, NULL, NULL, 0, 0, 'verified', NULL, 'cp8Dl80PTCKmblQ5jhTWlh:APA91bFG5-76TDPuqvdXDVK2ckjqnQ6Bj8Z9BDikygn0sQsWWrkF2pBcEYrlnN6b9aWtsIxbf1O8Xxwii8YK4n50Smd9pruFBKHJoOVuSDEcBKTbJOw8d5s', 'app', NULL, 0, NULL, NULL, NULL, 1, 1, '2025-01-29 05:31:56', '2025-01-29 05:31:57', NULL, NULL, 'user'),
(3, NULL, 'R', '0780869470', NULL, NULL, NULL, 'r@gmail.com', '$2b$10$PbTSX4q777JdJVCsAaltL.6N96osJwT/BxMebUSP84FuPaxlIg.cG', NULL, NULL, NULL, 0, 0, 'verified', NULL, 'cp8Dl80PTCKmblQ5jhTWlh:APA91bFG5-76TDPuqvdXDVK2ckjqnQ6Bj8Z9BDikygn0sQsWWrkF2pBcEYrlnN6b9aWtsIxbf1O8Xxwii8YK4n50Smd9pruFBKHJoOVuSDEcBKTbJOw8d5s', 'app', NULL, 0, NULL, NULL, NULL, 1, 1, '2025-01-29 12:19:18', '2025-01-29 12:19:18', NULL, NULL, 'user'),
(4, NULL, 'A', '8877665540', NULL, NULL, NULL, 'a@gmail.com', '$2b$10$3wJ4eWkeX39l.IJ55QeJ7eHpXHsL58kdgppsmimK4ICNCjbeBkH6u', NULL, NULL, NULL, 0, 0, 'verified', NULL, 'cp8Dl80PTCKmblQ5jhTWlh:APA91bFG5-76TDPuqvdXDVK2ckjqnQ6Bj8Z9BDikygn0sQsWWrkF2pBcEYrlnN6b9aWtsIxbf1O8Xxwii8YK4n50Smd9pruFBKHJoOVuSDEcBKTbJOw8d5s', 'app', NULL, 0, NULL, NULL, NULL, 1, 1, '2025-01-29 12:20:53', '2025-01-29 12:20:53', NULL, NULL, 'user'),
(5, NULL, 'Sachin', '+919977184307', NULL, NULL, NULL, 'test@gmail.com', '$2b$10$1oli6zx/Evf1f/x7BgzTsuIdcTUg92FY130xILfV5yV3KDMOieuNC', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-01-31 16:19:31', '2025-01-31 16:19:31', NULL, NULL, 'user'),
(6, 'male', 'Akash', '+919999988888', NULL, NULL, 'Online', 'akash@gmail.com', '$2b$10$v/CXswhpbdfxLDbPD2s/Z.ZOI6XU2C01PemssIVnirCqCTB010cPC', '::ffff:152.58.25.132', NULL, '111111', 1, 0, 'verified', NULL, 'eAr0btzFQ-a1T_nd-R_BL_:APA91bHVoGnLZTZMt6F3Rzm9IvmtzU9QB9KGmsaHZDwjBqc5lEPscwBtN91rsf8SH7PuEKuglSZEymrfslJ3WiFHGHOJpSplx3BfemauhVv5XJiNEVApWi4', 'app', NULL, 0, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDAxMzgwODEsImV4cCI6MTc0MDc0Mjg4MX0.-xT6Gbno8f8LnAmJS5J1NIg4w7cm_JASc0wva6e3hKU', '1740742881613', 1, 1, '2025-01-31 16:35:18', '2025-02-21 11:41:21', NULL, NULL, 'user'),
(7, NULL, 'Test', '', NULL, NULL, NULL, 'test@gmail.com', '$2b$10$kEl6ky7jIDzZXWuB096hZ.yILA2L0WROLQou05xmq6wU0jAlHD/yy', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-01 12:16:37', '2025-02-01 12:16:43', NULL, NULL, 'user'),
(8, NULL, 'Test', '9977184307', NULL, NULL, NULL, 'test@gmail.com', '$2b$10$MAS70yxIfnJnOaYfQ.PpLuwp3.zJyTzMB0NlGHIU12A5OkRK1jHaO', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-01 12:20:14', '2025-02-01 12:20:22', NULL, NULL, 'user'),
(9, NULL, 'A', '5555555555', NULL, NULL, NULL, 'a@gmail.com', '$2b$10$16TEBWWaLcMBurPIK2uzxu45X0TIxntlah0JDrcr/j..AiBGwmzQO', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-01 15:32:17', '2025-02-01 15:32:18', NULL, NULL, 'user'),
(10, NULL, 'A', '23477837383', NULL, NULL, NULL, 'a@gmail.com', '$2b$10$tgj7emtoamUmT9719i3L..qutApz6OxW5unURKTB8kRTTcLOXgomq', NULL, NULL, '123456', 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-01 15:32:18', '2025-02-01 15:39:49', NULL, NULL, 'user'),
(13, NULL, 'sachin test', '+918888877777', NULL, NULL, NULL, 'sachin@gmail.com', '$2b$10$CnF0JFtizkjhrnFh3R9wPu8TWNip2vF//B2E0iUTUJq03BGeQHyc.', NULL, NULL, '456738', 1, 1, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-02 11:45:51', '2025-02-02 11:45:51', NULL, NULL, 'user'),
(19, NULL, 'Rohan', '+918888877776', NULL, NULL, 'Online', 'rohan@gmail.com', '$2b$10$z2ePKPcqSmSGV5Y5PGGDuex149kN.Gq4IGjh5Wgpkds8rsyw2tOxu', '::ffff:152.59.24.219', NULL, '998845', 1, 1, 'verified', NULL, 'cm4pezjLTdaPbO9-IpfbUd:APA91bEosygikO715EsIX7OukVIaq2yQjPaEOUC69fsRwnT7VUxhRu6QJfiZOGcoXjeCRhYUAhfmarS5xDd9eGhjussFgLQOOo5KajuyvE-M2P0YaVeZooM', 'web', NULL, 0, NULL, NULL, '1740648242711', 1, 1, '2025-02-05 18:40:38', '2025-02-25 07:59:04', '000000', '000000', 'user'),
(20, NULL, 'tyrt', '+919999988888', NULL, NULL, 'Online', 'tyr@gmail.com', '', '::ffff:152.58.25.132', NULL, '123456', 1, 1, 'verified', NULL, 'eAr0btzFQ-a1T_nd-R_BL_:APA91bHVoGnLZTZMt6F3Rzm9IvmtzU9QB9KGmsaHZDwjBqc5lEPscwBtN91rsf8SH7PuEKuglSZEymrfslJ3WiFHGHOJpSplx3BfemauhVv5XJiNEVApWi4', 'app', NULL, 0, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDAxMzgwODEsImV4cCI6MTc0MDc0Mjg4MX0.-xT6Gbno8f8LnAmJS5J1NIg4w7cm_JASc0wva6e3hKU', '1739386655559', 1, 1, '2025-02-05 18:53:25', '2025-02-21 11:41:21', '111111', '111111', 'user'),
(23, NULL, 'praveen', '+1865838685', NULL, NULL, NULL, 'test@test.com', '$2b$10$PYo93fczYCGsBe8V4bPTOeWOwXRukVrl/Hbg2sZ5L8S4lFeDkjDRO', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-19 08:30:06', '2025-02-19 08:30:06', NULL, NULL, 'user'),
(25, NULL, 'praveen', '+18683681234', NULL, NULL, NULL, 'test@test.com', '$2b$10$wdtCURNsdGt9VR4owa0Dfes5HvPSEvTTv4na4TYUrj1XPcyEB0QMu', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-19 08:30:49', '2025-02-19 08:30:49', NULL, NULL, 'user'),
(30, NULL, 'test User', '+916232580009', NULL, NULL, 'Online', 'k@gmail.com', '$2b$10$FgXFLrx.MjcmbKfGS.OtPeme/cqX0FrGqhiI3Frxyu81rws2cU64y', '::ffff:110.227.51.97', NULL, '906050', 1, 1, 'verified', NULL, 'cIdB7TmlSpGlkJQvQAWA4I:APA91bHyCns2gUY2nbA_2hbes3w_Vyen9VLMaCbJ9wG4XSGi3Z-jkN9LqmAnreUrmFxV5g6CrAtcSzn1nnkcSi0fLJy3Npknoe8FrPF1bNi6e_ulx8o6MSY', 'app', 'cIdB7TmlSpGlkJQvQAWA4I:APA91bHyCns2gUY2nbA_2hbes3w_Vyen9VLMaCbJ9wG4XSGi3Z-jkN9LqmAnreUrmFxV5g6CrAtcSzn1nnkcSi0fLJy3Npknoe8FrPF1bNi6e_ulx8o6MSY', 0, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDA1MDQ1NzAsImV4cCI6MTc0MTEwOTM3MH0.553VIzMQ9TfbZsVu00NsEHEAROgf9yR53vHXlZ8-cYs', '1741109370866', 1, 1, '2025-02-19 16:28:23', '2025-03-03 07:52:10', NULL, NULL, 'admin'),
(32, NULL, 'John Doe', '0987654321', NULL, NULL, NULL, 'john@gmail.com', '$2b$10$zalU5vH7xkL9yLxUK9eZae9FRx.O86FJNuek3TPdrmpg1WRzsxC2e', '::ffff:1.187.180.195', NULL, '492793', 0, 0, 'verified', NULL, NULL, 'web', NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-20 05:45:20', '2025-03-03 07:51:50', NULL, NULL, 'admin'),
(33, NULL, 'Akki Admin 2', '+919988776655', NULL, NULL, NULL, 'akki@gmail.com', '$2b$10$ebYj/JZRM8tp3S1rFCvfH.Y4QMDlVpb6mL0A4tU3CJqB7c5QGLGvC', NULL, NULL, '546789', 1, 1, 'verified', NULL, NULL, 'app', NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-23 17:44:54', '2025-02-23 17:44:54', NULL, NULL, 'admin'),
(35, NULL, 'Test Admin 1', '+918109696715', NULL, NULL, 'Online', 'rohanmaher97@gmail.com', '$2b$10$IyttpEX8dW/guJ2IxfictOHN4SPjRvlldy6kSn2DsQ7cfu8T2TyJC', '::ffff:152.59.24.39', NULL, '779409', 1, 1, 'verified', NULL, 'cwmDCNHxSC6xET_IyWFlz3:APA91bHXb_rah5DBI0sVXEY27YqtBQLE93KsTXtonATP6jOSSKxqNNpzu0wKK0FLgexRzdM7epxLOxhAcZVtdf6-9C9Ve6MyXaLxh6Wn19qq_UXuU3BJcKs', 'app', NULL, 0, NULL, NULL, '1741600447993', 1, 1, '2025-02-23 18:46:24', '2025-03-03 09:56:15', NULL, NULL, 'admin'),
(36, NULL, 'Akash', '+918818810923', NULL, NULL, 'Online', 'Akash@gmail.com', '$2b$10$SbvOqtpNgbXR/OXmF5SJh.AipaqBCOnleiUOLL7MCSVT6OT8fowUu', '::ffff:27.5.47.70', NULL, '879688', 1, 1, 'verified', NULL, 'cZEa2kUUSYWfBO9ebbTKjb:APA91bHi4-4n3XchbWpprdrPyRoowBSAPH3bgmPBw2koOmboo-fmBlonhRsUJwZMHqmEApEJ1DthIqsPlGEvHR4NwkeyV0T9AF5dHGgp3RMT9Tr7AqYGToA', 'app', NULL, 0, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDA5OTYzNTQsImV4cCI6MTc0MTYwMTE1NH0.nhOH0_4LTFHycrTaPkednZdWDmki4hHyTy2JFSP5oLA', '1741601154554', 1, 1, '2025-02-24 05:09:43', '2025-03-03 10:05:54', NULL, NULL, 'user'),
(40, NULL, 'demo', '+91', NULL, NULL, NULL, 'demo@gamil.com', '$2b$10$qfV5pKuHblU/rI27DcYgOOdNhN5Om5Y.GLhyhNCttU0h/6HmtbOs.', NULL, NULL, NULL, 1, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-25 12:56:14', '2025-02-25 12:57:49', NULL, NULL, 'user'),
(41, NULL, 'demo', '+919589238677', NULL, NULL, NULL, 'demo@gmail.com', '$2b$10$VpOUnnCZXOB9aP7wukcYVu4S12vSqfClkb2Bph1k8L1wmoMYR8.zW', '::ffff:152.58.40.115', NULL, '357431', 0, 0, 'verified', NULL, 'fjSRaPewSfugrfkDA-9om8:APA91bEyhYaV4smN9_06auq2tZ-r6-I4hxY4IvyOL0ajp_caXg_OMwQvpzn_IMq6iAU67mqHtDQ2LAJtx_IQygOJpGMs4cAjkjMR-wipAqokF1jHOAW21I8', 'app', NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-26 07:40:19', '2025-02-28 10:50:42', NULL, NULL, 'user'),
(42, NULL, 'saklen khan', '+919876543210', NULL, NULL, NULL, 'saklenkhan501@gmail.com', '$2b$10$i.Z/QZn66/kLY616bwYNF.CMS8JdQ72x2DttzzgqxtIAvdGPFsjeK', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-26 14:04:05', '2025-02-26 14:04:05', NULL, NULL, 'user'),
(43, NULL, 'saklen', '+919876543211', NULL, NULL, NULL, 'saklen@gmail.com', '$2b$10$y0ZJGchxgmzn2FdhyNeWQen7KL8O4GNOieygwLdBrvlz4l/aYByCO', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-26 14:05:56', '2025-02-26 14:05:56', NULL, NULL, 'user'),
(44, NULL, 'saklenkhan', '+919111296785', NULL, NULL, NULL, 'saklenkhan501@gmail.com', '$2b$10$RUB6/27P6efKFKff7SJYTOu6qTX3aTXlceeKfXcXBpc/nesgnLnkO', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-28 10:48:55', '2025-02-28 10:49:01', NULL, NULL, 'user'),
(45, NULL, 'saklenkhan', '+919111296785', NULL, NULL, NULL, 'saklenkhan501@gmail.com', '$2b$10$okuw5RmbRjqluD3U21aVseP8nZX8xeJKLxxKiaSSoC7JaPrj3D4hC', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-28 10:48:56', '2025-02-28 10:49:04', NULL, NULL, 'user'),
(46, NULL, 'saklenkhan', '+919111296785', NULL, NULL, NULL, 'saklenkhan501@gmail.com', '$2b$10$OuTSI0KvxchTuxr/dO826e71L.TOIvNJhWHiCl5iowQ.wZfLMuQjq', NULL, NULL, NULL, 0, 0, 'verified', NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 1, 1, '2025-02-28 10:48:59', '2025-02-28 10:49:03', NULL, NULL, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookId` (`bookId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `alloted_accounts`
--
ALTER TABLE `alloted_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountId` (`accountId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `bookId` (`bookId`);

--
-- Indexes for table `alloted_books`
--
ALTER TABLE `alloted_books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookId` (`bookId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `bookId` (`bookId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `bookId` (`bookId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountId` (`accountId`),
  ADD KEY `bookId` (`bookId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `alloted_accounts`
--
ALTER TABLE `alloted_accounts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `alloted_books`
--
ALTER TABLE `alloted_books`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=290;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_137` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_138` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `alloted_accounts`
--
ALTER TABLE `alloted_accounts`
  ADD CONSTRAINT `alloted_accounts_ibfk_28` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `alloted_accounts_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `alloted_accounts_ibfk_30` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `alloted_books`
--
ALTER TABLE `alloted_books`
  ADD CONSTRAINT `alloted_books_ibfk_71` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `alloted_books_ibfk_72` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_61` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notes_ibfk_62` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_63` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_64` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_173` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_174` FOREIGN KEY (`bookId`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_175` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
