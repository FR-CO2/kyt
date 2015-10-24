/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;

import org.co2.kanban.repository.member.ProjectRole;

/**
 *
 * @author ben
 */
public class MemberForm {

    private ProjectRole projectRole;

    private Long applicationUserId;

    public ProjectRole getProjectRole() {
        return projectRole;
    }

    public void setProjectRole(ProjectRole projectRole) {
        this.projectRole = projectRole;
    }

    public Long getApplicationUserId() {
        return applicationUserId;
    }

    public void setApplicationUserId(Long applicationUserId) {
        this.applicationUserId = applicationUserId;
    }
    
    
}
