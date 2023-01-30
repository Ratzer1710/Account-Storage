package com.ratzer.accountStorage.servicesImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ratzer.accountStorage.configuration.UserRole;
import com.ratzer.accountStorage.model.UserDto;
import com.ratzer.accountStorage.model.User;
import com.ratzer.accountStorage.repository.UserRepository;
import com.ratzer.accountStorage.services.UserService;

@Service
public class UserServiceImpl implements UserService {
	
	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	
	public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}
	
	@Override
	public void registerUser(UserDto userDto) {
		User user = new User();		
		
		user.setUsername(userDto.getUsername());
		user.setPassword(passwordEncoder.encode(userDto.getPassword()));
		user.setUserRole(UserRole.USER);
		userRepository.save(user);
	}
	
	@Override
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
	
	@Override
	public List<UserDto> findAllUsers() {
		List<User> users = userRepository.findAll();
		return users.stream()
				.map((user) -> mapToUserDto(user))
				.collect(Collectors.toList());
	}
	
	private UserDto mapToUserDto(User user) {
		UserDto userDto = new UserDto();
		userDto.setId(user.getId());
		userDto.setUsername(user.getUsername());
		userDto.setUserRole(user.getUserRole());
		return userDto;
	}
	
	@Override
	public void configUser(String username) {
		User user = findUserByUsername(username);
		if (user.getUserRole().name() == "USER") {
			user.setUserRole(UserRole.ADMIN);
		} else if (user.getUserRole().name() == "ADMIN") {
			user.setUserRole(UserRole.USER);
		}
		userRepository.save(user);
	}
	
	@Override
	public void deleteUser(String username) {
		User user = findUserByUsername(username);
		userRepository.delete(user);
	}
}
