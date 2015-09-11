/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.user;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface ApplicationUserRepository extends PagingAndSortingRepository<ApplicationUser, Long> {
    
    ApplicationUser findByUsername(String username);
}
