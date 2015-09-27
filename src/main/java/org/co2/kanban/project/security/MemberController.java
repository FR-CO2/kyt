/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.security;

import org.co2.kanban.project.Project;
import org.co2.kanban.project.ProjectRepository;
import org.co2.kanban.user.ApplicationUser;
import org.co2.kanban.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
@RequestMapping(value = "/api/project/{projectId}")
@PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
public class MemberController {

    @Autowired
    private MemberRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ApplicationUserRepository userRepository;

    @RequestMapping(value = "memberrole", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ProjectRole[] roles(@PathVariable("projectId") Long projectId) {
        return ProjectRole.values();
    }

    @RequestMapping(value = "member/page", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Page<Member> page(@PathVariable("projectId") Long projectId, Pageable page) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProject(project, page);
    }

    @RequestMapping(value = "member/find/{username}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Member> findByUsername(@PathVariable("projectId") Long projectId, @PathVariable("username") String username) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProjectAndUserUsernameLike(project, username);
    }

    @RequestMapping(value = "member", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Member> list(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return repository.findByProject(project);
    }

    @RequestMapping(value = "member", method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Member> create(@PathVariable("projectId") Long projectId, @RequestBody MemberForm memberForm) {
        Project project = projectRepository.findOne(projectId);
        ApplicationUser user = userRepository.findOne(memberForm.getApplicationUserId());
        Member member = repository.findByProjectIdAndUserUsername(projectId, user.getUsername());
        if (member != null) {
            return new ResponseEntity<>(member, HttpStatus.CONFLICT);
        }
        member = new Member();
        member.setProjectRole(memberForm.getProjectRole());
        member.setProject(project);
        member.setUser(user);
        Member result = repository.save(member);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @RequestMapping(value = "member/{memberId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("memberId") Long memberId) {
        repository.delete(memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
