/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.converter;

import com.fasterxml.jackson.databind.ObjectMapper;
import javax.persistence.AttributeConverter;

/**
 *
 * @author courtib
 */
public abstract class JSONConverter<E> implements AttributeConverter<E, String> {

    @Override
    public String convertToDatabaseColumn(E obj) {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.convertValue(obj, String.class);
    }

    @Override
    public abstract E convertToEntityAttribute(String y);
}
