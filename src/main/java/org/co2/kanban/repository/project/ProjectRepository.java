/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.project;

import org.co2.kanban.repository.user.ApplicationUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface ProjectRepository extends PagingAndSortingRepository<Project, Long> {

    Page<Project> findByMembersUser(ApplicationUser user, Pageable p);

    Iterable<Project> findByMembersUser(ApplicationUser user);
    
    @Query("select count(e)>0 from Project e where UPPER(e.name)= UPPER(?1)")
    Boolean checkExistProject(String name);
}
