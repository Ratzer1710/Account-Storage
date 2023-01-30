package com.ratzer.accountStorage.model;

import javax.validation.constraints.NotEmpty;

import com.ratzer.accountStorage.configuration.UserRole;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class UserDto {
	
	private Long id;
	@NotEmpty(message = "Username can not be empty")
	private String username;
	@NotEmpty(message = "Password can not be empty")
	private String password;
	@Enumerated(EnumType.STRING)
	private UserRole userRole;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public UserRole getUserRole() {
		return userRole;
	}
	public void setUserRole(UserRole userRole) {
		this.userRole = userRole;
	}	
		
}
