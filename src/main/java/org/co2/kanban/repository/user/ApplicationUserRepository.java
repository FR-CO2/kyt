/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.user;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface ApplicationUserRepository extends PagingAndSortingRepository<ApplicationUser, Long> {

    ApplicationUser findByUsername(String username);

    Iterable<ApplicationUser> findByUsernameContains(String search);

    @Query("select count(e)>0 from ApplicationUser e where UPPER(e.username)= UPPER(?1)")
    Boolean checkExistUsername(String username);
}
