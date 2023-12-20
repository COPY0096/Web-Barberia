-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema app-barberia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema app-barberia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `app-barberia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `app-barberia` ;

-- -----------------------------------------------------
-- Table `app-barberia`.`barberos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app-barberia`.`barberos` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID primario de Barberos',
  `nombre` VARCHAR(60) NULL DEFAULT NULL COMMENT 'Nombre de los Barberos',
  `apellido` VARCHAR(60) NULL DEFAULT NULL COMMENT 'Apellido de los Barberos',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb3
COMMENT = 'Tabla de Barberos Barberia/Salon';


-- -----------------------------------------------------
-- Table `app-barberia`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app-barberia`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID primario de Usuarios',
  `nombre` VARCHAR(60) NULL DEFAULT NULL COMMENT 'Nombre de los Usuarios',
  `apellido` VARCHAR(60) NULL DEFAULT NULL COMMENT 'Apellido de los usuarios',
  `email` VARCHAR(30) NULL DEFAULT NULL COMMENT 'Email de los Usuarios',
  `password` VARCHAR(60) NULL DEFAULT NULL,
  `telefono` VARCHAR(10) NULL DEFAULT NULL COMMENT 'Telefono de los Usuarios',
  `admin` TINYINT(1) NULL DEFAULT NULL COMMENT 'Admin es un campo que identifica a un administrador del sistema ',
  `confirmado` TINYINT(1) NULL DEFAULT NULL COMMENT 'Confirmado se utiliza para confirmar el correo de los posibles usuarios',
  `token` VARCHAR(15) NULL DEFAULT NULL COMMENT 'Token es un token unico generado para ciertos procesos del sistema',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb3
COMMENT = 'Tabla de Usuarios de la Barberia/Salon';


-- -----------------------------------------------------
-- Table `app-barberia`.`citas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app-barberia`.`citas` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID primario de Citas',
  `fecha` DATE NULL DEFAULT NULL COMMENT 'Fecha guarda la fecha en la que se solicita la cita',
  `hora` TIME NULL DEFAULT NULL COMMENT 'Hora guarda la hora a la que se solicita la cita',
  `usuarioId` INT NULL DEFAULT NULL COMMENT 'usuarioId es clave foranea de id en la tabla Usuarios',
  PRIMARY KEY (`id`),
  INDEX `usuarioId_idx` (`usuarioId` ASC) VISIBLE,
  CONSTRAINT `usuarioId`
    FOREIGN KEY (`usuarioId`)
    REFERENCES `app-barberia`.`usuarios` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb3
COMMENT = 'Tabla de Citas Barberia/Salon';


-- -----------------------------------------------------
-- Table `app-barberia`.`citasbarberos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app-barberia`.`citasbarberos` (
  `id` INT NOT NULL COMMENT 'ID primario de CitasBarberos',
  `citaId` INT NULL DEFAULT NULL COMMENT 'citaId es clave foranea de id en la tabla Citas',
  `barberoId` INT NULL DEFAULT NULL COMMENT 'barberoId es clave foranea de id en la tabla Barberos',
  PRIMARY KEY (`id`),
  INDEX `Idbarbero_idx` (`barberoId` ASC) VISIBLE,
  INDEX `Idcita_idx` (`citaId` ASC) VISIBLE,
  CONSTRAINT `Idbarbero`
    FOREIGN KEY (`barberoId`)
    REFERENCES `app-barberia`.`barberos` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL,
  CONSTRAINT `Idcita`
    FOREIGN KEY (`citaId`)
    REFERENCES `app-barberia`.`citas` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Tabla pivote entre las tablas de Citas y Barberos';


-- -----------------------------------------------------
-- Table `app-barberia`.`servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app-barberia`.`servicios` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID primario de Servicios',
  `nombre` VARCHAR(60) NULL DEFAULT NULL COMMENT 'Nombre de los servicios',
  `precio` DECIMAL(5,2) NULL DEFAULT NULL COMMENT 'Precio de los servicios',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb3
COMMENT = 'Tabla de Servicios Barberia/Salon';


-- -----------------------------------------------------
-- Table `app-barberia`.`citasservicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app-barberia`.`citasservicios` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'ID primario de CitasServicios',
  `citaId` INT NULL DEFAULT NULL COMMENT 'citaId es clave foranea de id en la tabla Citas',
  `servicioId` INT NULL DEFAULT NULL COMMENT 'servicioId es clave foranea de id en la tabla Servicios',
  PRIMARY KEY (`id`),
  INDEX `servicioId_idx` (`servicioId` ASC) VISIBLE,
  INDEX `citaId_idx` (`citaId` ASC) VISIBLE,
  CONSTRAINT `citaId`
    FOREIGN KEY (`citaId`)
    REFERENCES `app-barberia`.`citas` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL,
  CONSTRAINT `servicioId`
    FOREIGN KEY (`servicioId`)
    REFERENCES `app-barberia`.`servicios` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 53
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = 'Tabla pivote entre las tablas de Citas y Servicios';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
