/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.security;

import org.co2.kanban.project.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface MemberRepository extends PagingAndSortingRepository<Member, Long> {

    Page<Member> findByProject(Project project, Pageable p);

    Iterable<Member> findByProjectAndUserUsernameLike(Project project, String username);

    Iterable<Member> findByProject(Project project);

    Member findByProjectIdAndUserUsername(Long projectId, String username);

}
