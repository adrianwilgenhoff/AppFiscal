package com.aew.ManagmentAccount.security;

import com.aew.ManagmentAccount.domain.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * This is the class whose instances will be returned from our custom
 * UserDetailsService. Spring Security will use the information stored in the
 * UserPrincipal object to perform authentication and authorization.
 * 
 * @author Adrian E. Wilgenhoff
 */
public class UserPrinciple implements UserDetails {

    private static final long serialVersionUID = -5499378464331456762L;

    private Long id;

    private String name;

    private String username;

    private String email;

    private String lastname;

    @JsonIgnore
    private String password;

    private Instant createdDate;

    private Collection<? extends GrantedAuthority> authorities;

    public UserPrinciple(Long id, String name, String username, String email, String password,
            Collection<? extends GrantedAuthority> authorities, String lastname, Instant createdDate) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.lastname = lastname;
        this.createdDate = createdDate;
    }

    public static UserPrinciple build(User user) {
        List<GrantedAuthority> authorities = user.getAuthorities().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name())).collect(Collectors.toList());

        return new UserPrinciple(user.getId(), user.getFirstName(), user.getLogin(), user.getEmail(),
                user.getPassword(), authorities, user.getLastName(), user.getCreatedDate());
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        UserPrinciple user = (UserPrinciple) o;
        return Objects.equals(id, user.id);
    }
}