package com.ratzer.accountStorage.services;

import java.util.List;

import com.ratzer.accountStorage.model.User;
import com.ratzer.accountStorage.model.UserDto;

public interface UserService {
	
	void registerUser(UserDto userDto);
	
	void configUser(String username);
	
	void deleteUser(String username);
	
	User findUserByUsername(String username);
	
	List<UserDto> findAllUsers();
}
