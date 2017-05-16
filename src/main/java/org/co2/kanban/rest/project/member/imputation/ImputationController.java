/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.security.Principal;
import java.sql.Timestamp;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.allocation.AllocationRepository;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.member.ProjectMemberRepository;
import org.co2.kanban.repository.user.ApplicationUser;
import org.co2.kanban.repository.user.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping(value = "/api/project/{projectId}/member/{memberId}/imputation")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class ImputationController {

    @Autowired
    private ApplicationUserRepository repository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private ImputationAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ImputationResource list(@AuthenticationPrincipal Principal user,
       @PathVariable("projectId") Long projectId,
       @PathVariable("memberId") Long memberId,
       @RequestParam("start") Long start,
       @RequestParam("end") Long end) {
        ProjectMember member = projectMemberRepository.findOne(memberId);
        Timestamp startTime = new Timestamp(start);
        Timestamp endTime = new Timestamp(end);
        Iterable<Allocation> allocationsMember = allocationRepository.findByUserAndAllocationDateBetween(member.getUser(), startTime, endTime);
        return assembler.toResources(startTime, endTime, allocationsMember);
    }

}
