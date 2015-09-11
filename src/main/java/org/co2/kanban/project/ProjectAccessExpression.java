/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project;

import org.co2.kanban.project.security.Member;
import org.co2.kanban.project.security.MemberRepository;
import org.co2.kanban.project.security.ProjectRole;
import org.co2.kanban.user.ApplicationUser;
import org.co2.kanban.user.ApplicationUserRepository;
import org.co2.kanban.user.ApplicationUserRole;
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

    private boolean isAdmin(String username) {
        ApplicationUser user = userRepository.findByUsername(username);
        return user.hasRole(ApplicationUserRole.ADMIN);
    }

    public boolean hasManagerAccess(Long projectId, String username) {
        if (isAdmin(username)) {
            return true;
        }
        Member member = repository.findByProjectIdAndUserUsername(projectId, username);
        if (member != null) {
            return member.hasRole(ProjectRole.MANAGER);
        }
        return false;
    }

    public boolean hasContributorAccess(Long projectId, String username) {
        if (isAdmin(username)) {
            return true;
        }
        Member member = repository.findByProjectIdAndUserUsername(projectId, username);
        if (member != null) {
            return member.hasRole(ProjectRole.MANAGER)
                    || member.hasRole(ProjectRole.CONTRIBUTOR);
        }
        return false;
    }

    public boolean hasMemberAccess(Long projectId, String username) {
        if (isAdmin(username)) {
            return true;
        }
        return repository.findByProjectIdAndUserUsername(projectId, username) != null;
    }
}
