/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban;

/**
 *
 * @author ben
 */
public interface ControllerViews {

    public interface ProjectList extends Project{
    };

    public interface Project {
    };

    public interface TaskList extends Project{
    };

    public interface Task extends TaskList{
    };

    public interface UserTask extends Project, TaskList {
    };
}
