/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member;

import org.co2.kanban.repository.member.MemberRepository;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.project.Project;
import org.co2.kanban.repository.project.ProjectRepository;
import org.co2.kanban.repository.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/member")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class MemberController {

    @Autowired
    private MemberRepository repository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private MemberAssembler assembler;

    @Autowired
    private PagedResourcesAssembler<Member> pagedAssembler;

    @RequestMapping(params = {"page", "size"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public PagedResources<MemberResource> page(@PathVariable("projectId") Long projectId,
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "size", required = false) Integer size) {
        Project project = projectRepository.findOne(projectId);
        Pageable pageable = new PageRequest(page, size);
        return pagedAssembler.toResource(repository.findByProject(project, pageable), assembler);
    }

    @RequestMapping(params = {"search"}, method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<MemberResource> search(@PathVariable("projectId") Long projectId,
            @RequestParam("search") String term) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProjectAndUserUsernameContains(project, term));
    }

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<MemberResource> list(@PathVariable("projectId") Long projectId) {
        Project project = projectRepository.findOne(projectId);
        return assembler.toResources(repository.findByProject(project));
    }

    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    @RequestMapping(method = RequestMethod.POST, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity create(@PathVariable("projectId") Long projectId, @RequestBody Member member) {
        Project project = projectRepository.findOne(projectId);
        member.setProject(project);
        Member result = repository.save(member);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(linkTo(methodOn(this.getClass()).get(projectId, result.getId())).toUri());
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{memberId}", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public MemberResource get(@PathVariable("projectId") Long projectId, @PathVariable("memberId") Long memberId) {
        Member member = repository.findOne(memberId);
        return assembler.toResource(member);
    }

    @PreAuthorize("@projectAccessExpression.hasManagerAccess(#projectId, principal.username)")
    @RequestMapping(value = "{memberId}", method = RequestMethod.DELETE, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity delete(@PathVariable("projectId") Long projectId, @PathVariable("memberId") Long memberId) {
        Member member = repository.findOne(memberId);
        for (Task task : member.getTasksAssignee()) {
            task.setAssignee(null);
        }
        for (Task task : member.getTasksBackup()) {
            task.setBackup(null);
        }
        repository.delete(member);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
