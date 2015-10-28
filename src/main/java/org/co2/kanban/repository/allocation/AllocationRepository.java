/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.allocation;

import java.sql.Timestamp;
import org.co2.kanban.repository.member.Member;
import org.co2.kanban.repository.task.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface AllocationRepository extends PagingAndSortingRepository<Allocation, Long> {


    @Query(value = "select a from Allocation a WHERE a.member = ?1")
    Iterable<Allocation> getListAllocationBeetweenPlannedStartAndPlannedEnding(Member member);

    Allocation findByTaskAndAllocationDateAndMember(Task task, Timestamp date, Member member);

    Iterable<Allocation> findByTask(Task task);
}