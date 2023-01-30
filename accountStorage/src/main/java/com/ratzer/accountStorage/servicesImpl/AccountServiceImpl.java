package com.ratzer.accountStorage.servicesImpl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ratzer.accountStorage.model.Account;
import com.ratzer.accountStorage.repository.AccountRepository;
import com.ratzer.accountStorage.services.AccountService;

@Service
public class AccountServiceImpl implements AccountService{
	private AccountRepository accountRepository;
	public AccountServiceImpl(AccountRepository accountRepository) {
		this.accountRepository = accountRepository;
	}
	
	@Override
	public void saveAccount(Account accountInfo) {
		Account account = new Account();
		
		account.setService(accountInfo.getService());
		account.setEmail(accountInfo.getEmail());
		account.setUsername(accountInfo.getUsername());
		account.setPassword(accountInfo.getPassword());
		account.setUser(accountInfo.getUser());
		accountRepository.save(account);
	}
	
	@Override
	public Optional<Account> findAccountById(Long id) {
		return accountRepository.findById(id);
	}
	
	@Override
	public List<Account> findUsersAccounts(String user) {
		List<Account> accounts = accountRepository.findByUser(user);	
		return accounts.stream()
				.collect(Collectors.toList());
	}
	
	@Override
	public void deleteAccount(Long id) {
		accountRepository.deleteById(id);
	}
}
