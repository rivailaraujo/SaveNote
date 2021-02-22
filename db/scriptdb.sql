-- MySQL Script generated by MySQL Workbench
-- sex 19 fev 2021 21:51:28 -03
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema savenote_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema savenote_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `savenote_db` DEFAULT CHARACTER SET utf8 ;
USE `savenote_db` ;

-- -----------------------------------------------------
-- Table `savenote_db`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `savenote_db`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `imagem` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(60) NOT NULL,
  `cidade` VARCHAR(45) NOT NULL,
  `estado` VARCHAR(2) NOT NULL,
  `criado` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`));


-- -----------------------------------------------------
-- Table `savenote_db`.`sessao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `savenote_db`.`sessao` (
  `id_sessao` INT NOT NULL,
  `id_usuario` INT NOT NULL DEFAULT 0,
  `token` VARCHAR(200) NOT NULL,
  `data_expiracao` VARCHAR(45) NULL,
  `expirado` TINYINT(4) NOT NULL,
  `criado` VARCHAR(45) NOT NULL,
  `atualizado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_sessao`),
  INDEX `fk_sessao_usuario_idx` (`id_usuario` ASC),
  CONSTRAINT `fk_sessao_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `savenote_db`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `savenote_db`.`notebook`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `savenote_db`.`notebook` (
  `id_notebook` INT NOT NULL AUTO_INCREMENT,
  `nome_notebook` VARCHAR(45) NOT NULL,
  `publico` TINYINT(4) NOT NULL,
  `avaliacao_media` DOUBLE NOT NULL DEFAULT 0,
  `id_usuario` INT NOT NULL,
  `criado` DATETIME NOT NULL,
  PRIMARY KEY (`id_notebook`),
  INDEX `fk_notebook_usuario1_idx` (`id_usuario` ASC),
  CONSTRAINT `fk_notebook_usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `savenote_db`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `savenote_db`.`anotacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `savenote_db`.`anotacao` (
  `id_anotacao` INT NOT NULL AUTO_INCREMENT,
  `id_notebook` INT NOT NULL,
  `nome_anotacao` VARCHAR(45) NOT NULL,
  `caminho` VARCHAR(100) NOT NULL,
  `create_time` DATETIME NOT NULL,
  PRIMARY KEY (`id_anotacao`),
  INDEX `fk_anotacao_notebook1_idx` (`id_notebook` ASC),
  CONSTRAINT `fk_anotacao_notebook1`
    FOREIGN KEY (`id_notebook`)
    REFERENCES `savenote_db`.`notebook` (`id_notebook`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
