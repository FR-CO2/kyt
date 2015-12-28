/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.member.imputation;

import java.sql.Timestamp;
import org.co2.kanban.repository.allocation.Allocation;
import org.co2.kanban.repository.allocation.AllocationRepository;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.member.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
public class ImputationController {

    @Autowired
    private MemberRepository repository;

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private ImputationAssembler assembler;

    @RequestMapping(method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<ImputationResource> list(@PathVariable("memberId") Long memberId,
            @RequestParam("start") Long start,
            @RequestParam("end") Long end) {
        Timestamp startDate = new Timestamp(start);
        Timestamp endDate = new Timestamp(end);
        Member member = repository.findOne(memberId);
        Iterable<Allocation> allocationsMember = allocationRepository.findByMemberAndAllocationDateBetween(member, startDate, endDate);
        return assembler.toResources(allocationsMember);
    }

}
