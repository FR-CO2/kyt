/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.security.project;

import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.member.ProjectRole;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.co2.kanban.repository.user.ApplicationUserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class ProjectAccessExpression {

    @Autowired
    private MemberRepository repository;

    @Autowired
    private ApplicationUserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public boolean hasManagerAccess(Long projectId, String username) {
        ApplicationUser user = userRepository.findByUsername(username);
        if (user.hasRole(ApplicationUserRole.ADMIN)) {
            return true;
        }
        Project project = projectRepository.findOne(projectId);
        Member member = repository.findByProjectAndUser(project, user);
        if (member != null) {
            return member.hasRole(ProjectRole.MANAGER);
        }
        return false;
    }

    public boolean hasContributorAccess(Long projectId, String username) {
        ApplicationUser user = userRepository.findByUsername(username);
        if (user.hasRole(ApplicationUserRole.ADMIN)) {
            return true;
        }
        Project project = projectRepository.findOne(projectId);
        Member member = repository.findByProjectAndUser(project, user);
        if (member != null) {
            return member.hasRole(ProjectRole.MANAGER)
                    || member.hasRole(ProjectRole.CONTRIBUTOR);
        }
        return false;
    }

    public boolean hasMemberAccess(Long projectId, String username) {
        ApplicationUser user = userRepository.findByUsername(username);
        if (user.hasRole(ApplicationUserRole.ADMIN)) {
            return true;
        }
        Project project = projectRepository.findOne(projectId);
        return repository.findByProjectAndUser(project, user) != null;
    }
}
