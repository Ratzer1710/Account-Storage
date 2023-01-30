package com.ratzer.accountStorage.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ratzer.accountStorage.configuration.UserRole;
import com.ratzer.accountStorage.model.User;
import com.ratzer.accountStorage.repository.UserRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    private List<UserRole> roles = new ArrayList<>(Arrays.asList(UserRole.values()));
    
    public List<UserRole> getRoles() {
		return roles;
	}

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user != null) {
            return new org.springframework.security.core.userdetails.User(user.getUsername(),
                    user.getPassword(),
                    mapRolesToAuthorities(roles, user));
        }else{
            throw new UsernameNotFoundException("Invalid username or password.");
        }
    }
    
    private Collection < ? extends GrantedAuthority> mapRolesToAuthorities(Collection <UserRole> roles, User user) {
        Collection < ? extends GrantedAuthority> mapRoles = roles.stream()
                .map(role -> new SimpleGrantedAuthority(user.getUserRole().name()))
                .collect(Collectors.toList());
        return mapRoles;
    }
}