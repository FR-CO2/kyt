/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.allocation;

import java.sql.Timestamp;
import org.co2.kanban.repository.member.ProjectMember;
import org.co2.kanban.repository.task.Task;
import org.co2.kanban.repository.user.ApplicationUser;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 *
 * @author ben
 */
public interface AllocationRepository extends PagingAndSortingRepository<Allocation, Long> {

    Iterable<Allocation> findByUserAndAllocationDateBetween(ApplicationUser user, Timestamp start, Timestamp end);

    Iterable<Allocation> findByTaskOrderByAllocationDateAscUserUsernameAsc(Task task);
    
    Iterable<Allocation> findByUserAndAllocationDate(ApplicationUser user, Timestamp date);
    
    Allocation findByUserAndAllocationDateAndTask(ApplicationUser user, Timestamp date, Task task);

    Allocation findTopByUserAndTaskOrderByAllocationDateDesc(ApplicationUser user, Task task);
}
