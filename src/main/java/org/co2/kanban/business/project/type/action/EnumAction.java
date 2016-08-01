/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.business.project.type.action;

/**
 *
 * @author granels
 */
public enum EnumAction {
    INSERT(1), UPDATE(2), DELETED(3);

    private final int value;

    //Constructeur
    EnumAction(int value) {

        this.value = value;

    }

    public int getValue() {
        return this.value;
    }
}
