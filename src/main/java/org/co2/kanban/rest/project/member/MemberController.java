/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;

import java.util.List;
import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/member")
@PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
public class MemberController {

    @Autowired
    private MemberRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ApplicationUserRepository userRepository;

    @Autowired
    private MemberAssembler assembler;

    @Autowired
    private PagedResourcesAssembler<Member> pagedAssembler;

    @RequestMapping(value = "/page", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<MemberResource> page(@PathVariable("projectId") Long projectId, Pageable page) {
        Project project = projectRepository.findOne(projectId);
        return pagedAssembler.toResource(repository.findByProject(project, page), assembler);
    }

    @RequestMapping(value = "/find/{username}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<MemberResource> findByUsername(@PathVariable("projectId") Long projectId, @PathVariable("username") String username) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProjectAndUserUsernameLike(project, username));
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public List<MemberResource> list(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProject(project));
    }

    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MemberResource> create(@PathVariable("projectId") Long projectId, @RequestBody MemberForm memberForm) {
        Project project = projectRepository.findOne(projectId);
        ApplicationUser user = userRepository.findOne(memberForm.getApplicationUserId());
        Member member = repository.findByProjectAndUser(project, user);
        if (member != null) {
            return new ResponseEntity<>(assembler.toResource(member), HttpStatus.CONFLICT);
        }
        member = new Member();
        member.setProjectRole(memberForm.getProjectRole());
        member.setProject(project);
        member.setUser(user);
        Member result = repository.save(member);
        return new ResponseEntity<>(assembler.toResource(result), HttpStatus.CREATED);
    }

    @RequestMapping(value = "{memberId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public MemberResource get(@PathVariable("memberId") Long memberId) {
        Member member = repository.findOne(memberId);
        return assembler.toResource(member);
    }

    @RequestMapping(value = "{memberId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("memberId") Long memberId) {
        repository.delete(memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
