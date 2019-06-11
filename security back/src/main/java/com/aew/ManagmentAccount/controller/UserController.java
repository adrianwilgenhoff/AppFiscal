package com.aew.ManagmentAccount.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import javax.validation.Valid;

import com.aew.ManagmentAccount.domain.Authority;
import com.aew.ManagmentAccount.domain.User;
import com.aew.ManagmentAccount.error.BadRequestAlertException;
import com.aew.ManagmentAccount.error.EmailAlreadyUsedException;
import com.aew.ManagmentAccount.error.LoginAlreadyUsedException;
import com.aew.ManagmentAccount.payload.UserUpdateRole;
import com.aew.ManagmentAccount.repository.AuthorityRepository;
import com.aew.ManagmentAccount.repository.UserRepository;
import com.aew.ManagmentAccount.service.MailService;
import com.aew.ManagmentAccount.service.UserService;
import com.aew.ManagmentAccount.util.HeaderUtil;
import com.aew.ManagmentAccount.util.PaginationUtil;
import com.aew.ManagmentAccount.util.RandomUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing users.
 * 
 * This class accesses the User entity, and needs to fetch its collection of
 * authorities.
 */
@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    /**
     * POST /users : Creates a new user.
     * <p>
     * Creates a new user if the login and email are not already used, and sends an
     * mail with an activation link. The user needs to be activated on creation.
     *
     * @param user the user to create
     * @return the ResponseEntity with status 201 (Created) and with body the new
     *         user, or with status 400 (Bad Request) if the login or email is
     *         already in use
     * @throws URISyntaxException        if the Location URI syntax is incorrect
     * @throws BadRequestAlertException  400 (Bad Request) if the login or email is
     *                                   already in use
     * @throws LoginAlreadyUsedException
     * @throws EmailAlreadyUsedException
     */
    @PostMapping("/users")
    @PreAuthorize("hasRole(\"" + "ROLE_ADMIN" + "\")")
    public ResponseEntity<User> createUser(@Valid @RequestBody User user)
            throws URISyntaxException, BadRequestAlertException, LoginAlreadyUsedException, EmailAlreadyUsedException {
        log.debug("REST request to save User : {}", user);

        if (user.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID");
        } else if (userRepository.findByLogin(user.getLogin().toLowerCase()).isPresent()) {
            throw new LoginAlreadyUsedException();
        } else if (userRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        } else {
            user.setPassword(encoder.encode(user.getPassword()));
            if (!user.isActivated()) {
                user.setActivationKey(RandomUtil.generateActivationKey());
                mailService.sendActivationEmail(user);
            }
            User newUser = userRepository.save(user);

            return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
                    .headers(HeaderUtil.createAlert("userManagement.created", newUser.getLogin())).body(newUser);
        }
    }

    /**
     * PUT /users : Updates an existing User.
     *
     * @param user the user to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated
     *         user
     * @throws EmailAlreadyUsedException 400 (Bad Request) if the email is already
     *                                   in use
     * @throws LoginAlreadyUsedException 400 (Bad Request) if the login is already
     *                                   in use
     */
    @PutMapping("/users")
    @PreAuthorize("hasRole(\"" + "ROLE_ADMIN" + "\")")
    public ResponseEntity<User> updateUser(@Valid @RequestBody User user)
            throws EmailAlreadyUsedException, LoginAlreadyUsedException {
        log.debug("REST request to update User : {}", user);
        Optional<User> existingUser = userRepository.findByEmailIgnoreCase(user.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(user.getId()))) {
            throw new EmailAlreadyUsedException();
        }
        existingUser = userRepository.findByLogin(user.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(user.getId()))) {
            throw new LoginAlreadyUsedException();
        }
        User updatedUser = userRepository.save(user);
        return new ResponseEntity<User>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/users")
    @PreAuthorize("hasRole(\"" + "ROLE_ADMIN" + "\")")
    public ResponseEntity<User> updateUserRole(@RequestBody UserUpdateRole userUpdateRole)
            throws UsernameNotFoundException {
        log.debug("REST request to update User : {}", userUpdateRole.getLogin());
        Optional<User> existingUser = userRepository.findByLogin(userUpdateRole.getLogin().toLowerCase());
        if (!existingUser.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        System.out.println("login: " + userUpdateRole.getLogin());
        existingUser.get().setAuthorities(userUpdateRole.getAuthorities());

        User updatedUser = userRepository.save(existingUser.get());
        return new ResponseEntity<User>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/user/checkUsernameAvailability")
    public Boolean checkUsernameAvailability(@RequestParam(value = "login") String login) {
        return !userRepository.existsByLogin(login);

    }

    @GetMapping("/user/checkEmailAvailability")
    public Boolean checkEmailAvailability(@RequestParam(value = "email") String email) {
        return !userRepository.existsByEmail(email);
    }

    /**
     * GET /users : get all users.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and with body all users
     */
    // @GetMapping("/users")
    // public ResponseEntity<List<User>> getAllUsers(Pageable pageable) {
    // final Page<User> page = userService.getAllUsers(pageable);
    // HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page,
    // "/api/v1/users");
    // return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    // }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
    }

    /**
     * GET /users/:login : get the "login" user.
     *
     * @param login the login of the user to find
     * @return the ResponseEntity with status 200 (OK) and with body the "login"
     *         user, or with status 404 (Not Found)
     * @throws BadRequestAlertException
     */
    @GetMapping("/users/{login}")
    public ResponseEntity<Optional<User>> getUser(@PathVariable String login) throws BadRequestAlertException {
        log.debug("REST request to get User : {}", login);
        Optional<User> user = userRepository.findByLogin(login);
        if (!user.isPresent()) {
            throw new BadRequestAlertException("User not found");
        } else {
            return ResponseEntity.ok(user);
        }
    }

    /**
     * DELETE /users/:login : delete the "login" User.
     *
     * @param login the login of the user to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/users/{login}")
    @PreAuthorize("hasRole(\"" + "ROLE_ADMIN" + "\")")
    public ResponseEntity<String> deleteUser(@PathVariable String login) {
        log.debug("REST request to delete User: {}", login);
        userService.deleteUser(login);
        return new ResponseEntity<String>("User Deleted", HttpStatus.NO_CONTENT);
    }
}
