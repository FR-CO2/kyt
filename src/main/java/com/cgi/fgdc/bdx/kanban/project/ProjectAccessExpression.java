/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project;

import com.cgi.fgdc.bdx.kanban.project.security.Member;
import com.cgi.fgdc.bdx.kanban.project.security.MemberRepository;
import com.cgi.fgdc.bdx.kanban.project.security.ProjectRole;
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

    public boolean hasManagerAccess(Long projectId, String username) {
        Member member = repository.findByProjectIdAndUserUsername(projectId, username);
        if (member != null) {
            return ProjectRole.MANAGER.equals(member.getProjectRole());
        }
        return false;
    }

    public boolean hasContributorAccess(Long projectId, String username) {
        Member member = repository.findByProjectIdAndUserUsername(projectId, username);
        if (member != null) {
            return ProjectRole.MANAGER.equals(member.getProjectRole())
                    || ProjectRole.CONTRIBUTOR.equals(member.getProjectRole());
        }
        return false;
    }

    public boolean hasMemberAccess(Long projectId, String username) {
        return repository.findByProjectIdAndUserUsername(projectId, username) != null;
    }
}
