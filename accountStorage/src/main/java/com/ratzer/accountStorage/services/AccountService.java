package com.ratzer.accountStorage.services;

import java.util.List;
import java.util.Optional;

import com.ratzer.accountStorage.model.Account;

public interface AccountService {
	
	void saveAccount(Account account);
	
	void deleteAccount(Long id);
	
	Optional<Account> findAccountById(Long id);
	
	List<Account> findUsersAccounts(String user);
}
