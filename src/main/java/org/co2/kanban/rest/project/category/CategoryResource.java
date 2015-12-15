/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.rest.project.category;

import org.co2.kanban.repository.category.Category;
import org.co2.kanban.rest.IdentifiableResourceSupport;

/**
 *
 * @author ben
 */
public class CategoryResource extends IdentifiableResourceSupport<Category> {

    public CategoryResource(Category category) {
        super(category);
    }
    
    public String getName() {
        return this.getBean().getName();
    }

    public String getBgcolor() {
        return this.getBean().getBgcolor();
    }

    public String getColor() {
        return this.getBean().getColor();
    }
    
}
