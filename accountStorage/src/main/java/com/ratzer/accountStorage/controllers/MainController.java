package com.ratzer.accountStorage.controllers;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.context.annotation.Scope;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.ratzer.accountStorage.configuration.WebPages;
import com.ratzer.accountStorage.model.Account;
import com.ratzer.accountStorage.model.User;
import com.ratzer.accountStorage.model.UserDto;
import com.ratzer.accountStorage.services.AccountService;
import com.ratzer.accountStorage.services.UserService;

@Controller
@SessionAttributes({"currUser", "accounts", "newAccount"})
public class MainController {
	
	private UserService userService;
	private AccountService accountService;
	
	public MainController(UserService userService, AccountService accountService) {
		this.userService = userService;
		this.accountService = accountService;
	}
	
	@GetMapping(path="/index")
    public String home(Model model){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		boolean hasAdminRole = authentication.getAuthorities().stream()
		          .anyMatch(r -> r.getAuthority().equals("ADMIN"));
		String role;
		if (hasAdminRole) {
			role = "ADMIN";
		} else {
			role = "USER";
		}
		String user = authentication.getName();
		List<Account> accounts = accountService.findUsersAccounts(user);
		Account newAccount = new Account();
		model.addAttribute("role", role);
		model.addAttribute("currUser", user);
		model.addAttribute("accounts", accounts);
		model.addAttribute("newAccount", newAccount);
        return WebPages.HOME;
    }
	
	@PostMapping("/index/newAccount")
	public String newAccount(@Valid @ModelAttribute("newAccount") Account account, Model model) {
		
		accountService.saveAccount(account);
		
		System.out.println("New account added to " + account.getUser() + "'S storage");
		return "redirect:/index";
	}
	
	@RequestMapping(path = "/index/delete", method = RequestMethod.GET)
	public String userDelete(@RequestParam(value="id", required=false) Long id, Model model) {
		accountService.deleteAccount(id);
		return "redirect:/index";
	}
	
	@GetMapping("/login")
    public ModelAndView signin(){
		ModelAndView modelAndView = new ModelAndView(WebPages.LOGIN);
        return modelAndView;
    }
	
	@GetMapping("/register")
	public ModelAndView signup(Model model) {
		ModelAndView modelAndView = new ModelAndView(WebPages.REGISTER);
		UserDto user = new UserDto();
		model.addAttribute("user", user);
		return modelAndView;
	}
	
	@PostMapping("/register/registration")
	public String registration(@Valid @ModelAttribute("user") UserDto userDto, BindingResult result, Model model) {
		User userExists = userService.findUserByUsername(userDto.getUsername());
		if (userExists != null) {
			result.rejectValue("username", null, "There is already an account with that username");
			return WebPages.REGISTER;
		}
		
		if (result.hasErrors()) {
			model.addAttribute("user", userDto);
			return WebPages.REGISTER;
		}
		
		userService.registerUser(userDto);
		
		System.out.println("New user added");
		System.out.println("Username: " + userDto.getUsername());
		
		return WebPages.LOGIN;
	}
	
	@GetMapping("/users")
	public ModelAndView users(Model model) {
		ModelAndView modelAndView = new ModelAndView(WebPages.USERS);
		List<UserDto> users = userService.findAllUsers();
		model.addAttribute("users", users);
		return modelAndView;
	}

	@RequestMapping(path = "/users/config", method = RequestMethod.GET)
	public String userConfig(@RequestParam(value="username", required=false) String username, Model model) {
		userService.configUser(username);
		System.out.println(username + "'s credentials were modified");
		return "redirect:/index";
	}
	
	@RequestMapping(path = "/users/delete", method = RequestMethod.GET)
	public String userDelete(@RequestParam(value="username", required=false) String username, Model model) {
		userService.deleteUser(username);
		System.out.println(username + "'s account was deleted");
		return "redirect:/index";
	}
}
