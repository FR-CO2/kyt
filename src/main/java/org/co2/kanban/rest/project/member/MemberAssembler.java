/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;


import org.co2.kanban.repository.member.Member;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author ben
 */
@Component
public class MemberAssembler extends ResourceAssemblerSupport<Member, MemberResource> {

    public MemberAssembler() {
        super(MemberController.class, MemberResource.class);
    }

    @Override
    public MemberResource toResource(Member member) {
        MemberResource resource = createResourceWithId(member.getId(), member, member.getProject().getId());
        resource.setUsername(member.getUser().getUsername());
        resource.setProjectRole(member.getProjectRole());
        return resource;
    }

}
