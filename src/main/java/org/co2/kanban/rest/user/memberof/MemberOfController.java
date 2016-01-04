/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.user.memberof;

import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/user/{userId}/memberof")
public class MemberOfController {

    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private MemberOfAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<MemberOfResource> list(@PathVariable("userId") Long userId) {
        ApplicationUser appUser = repository.findOne(userId);
        return assembler.toResources(appUser.getMembers());
    }

    @RequestMapping(params={"projectId"}, method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public MemberOfResource list(@PathVariable("userId") Long userId, @RequestParam("projectId") Long projectId) {
        ApplicationUser appUser = repository.findOne(userId);
        Project project = projectRepository.findOne(projectId);
        return assembler.toResource(memberRepository.findByProjectAndUser(project, appUser));
    }
}
