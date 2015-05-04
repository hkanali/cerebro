-- MySQL dump 10.13  Distrib 5.6.21, for osx10.9 (x86_64)
--
-- Host: localhost    Database: cerebro
-- ------------------------------------------------------
-- Server version	5.6.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `facebookers`
--

DROP TABLE IF EXISTS `facebookers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facebookers` (
  `id` varchar(11) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `icon_path` varchar(255) DEFAULT NULL,
  `post_count` int(11) unsigned DEFAULT '0',
  `workspace` varchar(100) DEFAULT NULL,
  `college` varchar(11) DEFAULT NULL,
  `friend_count` int(11) unsigned DEFAULT NULL,
  `telphone` int(11) unsigned DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `relations` int(11) unsigned DEFAULT NULL,
  `address` varchar(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facebookers`
--

LOCK TABLES `facebookers` WRITE;
/*!40000 ALTER TABLE `facebookers` DISABLE KEYS */;
/*!40000 ALTER TABLE `facebookers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instagramers`
--

DROP TABLE IF EXISTS `instagramers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instagramers` (
  `id` varchar(30) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `description` text,
  `icon_path` varchar(255) DEFAULT NULL,
  `post_count` int(11) unsigned DEFAULT '0',
  `follow_count` int(11) unsigned DEFAULT '0',
  `follower_count` int(11) unsigned DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instagramers`
--

LOCK TABLES `instagramers` WRITE;
/*!40000 ALTER TABLE `instagramers` DISABLE KEYS */;
/*!40000 ALTER TABLE `instagramers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mixiers`
--

DROP TABLE IF EXISTS `mixiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mixiers` (
  `id` varchar(11) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `icon_path` varchar(255) DEFAULT NULL,
  `post_count` int(11) unsigned DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mixiers`
--

LOCK TABLES `mixiers` WRITE;
/*!40000 ALTER TABLE `mixiers` DISABLE KEYS */;
/*!40000 ALTER TABLE `mixiers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pixivers`
--

DROP TABLE IF EXISTS `pixivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pixivers` (
  `id` varchar(11) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL,
  `icon_path` varchar(255) DEFAULT NULL,
  `post_count` int(11) unsigned DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pixivers`
--

LOCK TABLES `pixivers` WRITE;
/*!40000 ALTER TABLE `pixivers` DISABLE KEYS */;
/*!40000 ALTER TABLE `pixivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_relations`
--

DROP TABLE IF EXISTS `social_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `social_relations` (
  `master_id` int(11) unsigned DEFAULT NULL,
  `social_type` int(11) unsigned DEFAULT NULL,
  `social_id` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_relations`
--

LOCK TABLES `social_relations` WRITE;
/*!40000 ALTER TABLE `social_relations` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_relations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `twitterers`
--

DROP TABLE IF EXISTS `twitterers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `twitterers` (
  `id` int(11) unsigned NOT NULL,
  `screen_name` varchar(15) NOT NULL DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `description` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `icon_path` varchar(255) DEFAULT NULL,
  `posts_count` int(11) unsigned DEFAULT '0',
  `favorites_count` int(11) unsigned DEFAULT '0',
  `follows_count` int(11) unsigned DEFAULT '0',
  `followers_count` int(11) unsigned DEFAULT '0',
  `listed_count` int(11) unsigned DEFAULT '0',
  `born_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `screen_name` (`screen_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `twitterers`
--

LOCK TABLES `twitterers` WRITE;
/*!40000 ALTER TABLE `twitterers` DISABLE KEYS */;
/*!40000 ALTER TABLE `twitterers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-04-16  2:18:35
