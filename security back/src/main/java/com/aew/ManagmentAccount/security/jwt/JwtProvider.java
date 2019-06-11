package com.aew.ManagmentAccount.security.jwt;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

import com.aew.ManagmentAccount.security.UserPrinciple;

/**
 * Utility class will be used for generating a JWT after a user logs in
 * successfully, and validating the JWT sent in the Authorization header of the
 * requests
 */
@Component
public class JwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    // Reads the JWT secret from properties.
    @Value("${aew.app.jwtSecret}")
    private String jwtSecret = "jwtAewSecretKey";

    // Read the JWT expiration time from properties.
    // @Value("${aew.app.jwtExpiration}")
    private long tokenValidityInMilliseconds = 864000;

    private long tokenValidityInMillisecondsForRememberMe = 8640000;

    public String generateJwtToken(Authentication authentication, boolean rememberMe) {

        UserPrinciple userPrincipal = (UserPrinciple) authentication.getPrincipal();

        long now = (new Date()).getTime();
        Date validity;
        if (rememberMe) {
            validity = new Date(now + this.tokenValidityInMillisecondsForRememberMe);
        } else {
            validity = new Date(now + this.tokenValidityInMilliseconds);
        }
        return Jwts.builder().setSubject((userPrincipal.getUsername())).setIssuedAt(new Date()).setExpiration(validity)
                .signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature -> Message: {} ", e);
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token -> Message: {}", e);
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token -> Message: {}", e);
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token -> Message: {}", e);
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty -> Message: {}", e);
        }
        return false;
    }
}