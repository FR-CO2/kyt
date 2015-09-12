/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.project.reporting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ben
 */
@RestController
@RequestMapping(value = "/api/project/{projectId}/report")
@PreAuthorize("@projectAccessExpression.hasMemberAccess(#projectId, principal.username)")
public class ReportingController {

    @Autowired
    private ReportingRepository repository;

    @RequestMapping(value = "assignee", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<AssigneeReport> assigneeReport(@PathVariable("projectId") Long projectId) {
        return repository.getAssigneeReporting(projectId);
    }

    @RequestMapping(value = "state", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<StateReport> stateReport(@PathVariable("projectId") Long projectId) {
        return repository.getStateReporting(projectId);
    }

    @RequestMapping(value = "swimlane", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<SwimlaneReport> swimlaneReport(@PathVariable("projectId") Long projectId) {
        return repository.getSwimlaneReporting(projectId);
    }

    @RequestMapping(value = "category", method = RequestMethod.GET, produces = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Iterable<CategoryReport> categoryReport(@PathVariable("projectId") Long projectId) {
        return repository.getCategoryReporting(projectId);
    }

}