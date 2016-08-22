/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.member;

import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.user.ApplicationUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface ProjectMemberRepository extends PagingAndSortingRepository<ProjectMember, Long> {

    Page<ProjectMember> findByProject(Project project, Pageable p);

    Iterable<ProjectMember> findByProjectAndUserUsernameLike(Project project, String username);

    Iterable<ProjectMember> findByProject(Project project);

    Iterable<ProjectMember> findByProjectAndUserUsernameContains(Project project, String term);
    
    ProjectMember findByProjectAndUser(Project project, ApplicationUser user);
    
    @Query("select count(e)>0 from ProjectMember e where e.project= ?1 and e.user = ?2")
    Boolean checkExistProjectAndUser(Project project, ApplicationUser user);

}
