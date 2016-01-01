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
public interface MemberRepository extends PagingAndSortingRepository<Member, Long> {

    Page<Member> findByProject(Project project, Pageable p);

    Iterable<Member> findByProjectAndUserUsernameLike(Project project, String username);

    Iterable<Member> findByProject(Project project);

    Iterable<Member> findByProjectAndUserUsernameContains(Project project, String term);

    Member findByProjectAndUser(Project project, ApplicationUser user);

    @Query("select count(e)>0 from Member e where e.project= ?1 and e.user = ?2")
    Boolean checkExistProjectAndUser(Project project, ApplicationUser user);

}
