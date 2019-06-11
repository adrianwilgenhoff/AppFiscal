package com.aew.ManagmentAccount.payload;

import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import com.aew.ManagmentAccount.domain.Authority;
import lombok.Getter;
import lombok.Setter;

/**
 * Define the request payloads that the APIs will use for singup a user.
 */
@Getter
@Setter
public class UserUpdateRole {

    @NotBlank
    @Size(min = 3, max = 50)
    private String login;

    private Set<Authority> authorities = new HashSet<>();

}