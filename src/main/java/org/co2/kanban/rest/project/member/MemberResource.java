/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;

import java.io.File;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.member.ProjectRole;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class MemberResource extends IdentifiableResourceSupport<ProjectMember> {

    public MemberResource(ProjectMember member) {
        super(member);
    }

    public String getUsername() {
        return this.getBean().getUser().getUsername();
    }

    public ProjectRole getProjectRole() {
        return this.getBean().getProjectRole();
    }

}
