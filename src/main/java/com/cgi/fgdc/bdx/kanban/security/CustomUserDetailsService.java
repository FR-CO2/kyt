/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.security;

import com.cgi.fgdc.bdx.kanban.user.ApplicationUser;
import com.cgi.fgdc.bdx.kanban.user.ApplicationUserRepository;
import java.util.ArrayList;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author ben
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ApplicationUserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(ApplicationUserRepository repository) {
        this.userRepository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String string) throws UsernameNotFoundException {
        ApplicationUser user = userRepository.findByUsername(string);
        if (user == null) {
            throw new UsernameNotFoundException("user not found");
        }
        return new CustomUserDetails(user);
    }

    private static class CustomGrantedAuthority implements GrantedAuthority {
        private static final long serialVersionUID = -5595653660597034665L;

        private final String roleName;
        
        public CustomGrantedAuthority(String roleName) {
            this.roleName = roleName;
        }
        
        @Override
        public String getAuthority() {
            return roleName;
        }
        
    }
    
    private static class CustomUserDetails extends ApplicationUser implements UserDetails {

        private static final long serialVersionUID = 542255685996973266L;

        private final Collection<CustomGrantedAuthority> authorities = new ArrayList<>();

        public CustomUserDetails(ApplicationUser user) {
            this.setUsername(user.getUsername());
            this.setPassword(user.getPassword());
            authorities.add(new CustomGrantedAuthority(user.getApplicationRole().name()));
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }

    }

}
