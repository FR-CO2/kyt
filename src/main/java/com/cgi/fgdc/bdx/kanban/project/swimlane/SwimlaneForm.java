/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.cgi.fgdc.bdx.kanban.project.swimlane;

/**
 *
 * @author ben
 */
public class SwimlaneForm extends Swimlane {
    
    private static final long serialVersionUID = -2937788096460482380L;
    
    private Long responsableId;

    public Long getResponsableId() {
        return responsableId;
    }

    public void setResponsableId(Long responsableId) {
        this.responsableId = responsableId;
    }
    
    
}
