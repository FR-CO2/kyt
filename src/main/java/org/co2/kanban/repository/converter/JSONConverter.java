/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.co2.kanban.repository.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.persistence.AttributeConverter;
import org.slf4j.LoggerFactory;

/**
 *
 * @author courtib
 */
public abstract class JSONConverter<E> implements AttributeConverter<E, String> {

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(JSONConverter.class);

    @Override
    public String convertToDatabaseColumn(E obj) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.writeValueAsString(obj);
        } catch (JsonProcessingException ex) {
            LOGGER.warn("Erreur lors de la conversion en JSON ", ex);;
        }
        return null;
    }

    @Override
    public abstract E convertToEntityAttribute(String y);
}
