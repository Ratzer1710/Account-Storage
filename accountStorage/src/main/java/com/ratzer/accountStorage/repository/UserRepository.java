package com.ratzer.accountStorage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ratzer.accountStorage.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

}
