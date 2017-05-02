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
    INSERT(1, "ajout"), UPDATE(2,"modification"), DELETED(3,"suppression"), IMPUTATION(4,"imputation");

    private final int value;
    private final String name;

    //Constructeur
    EnumAction(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public int getValue() {
        return this.value;
    }

    public String getName() {
        return name;
    }

    public EnumAction getActionFromVal(int value){
        EnumAction[] tabEnum = EnumAction.values();
        for (int i = 0; i < tabEnum.length; i++) {
            if (tabEnum[i].getValue()== value) {
                return tabEnum[i];
            }
        }
        return null;
    }

    public EnumAction getActionFromName(String name){
        EnumAction[] tabEnum = EnumAction.values();
        for (int i = 0; i < tabEnum.length; i++) {
            if (tabEnum[i].getName().equals(name)) {
                return tabEnum[i];
            }
        }
        return null;
    }
}
