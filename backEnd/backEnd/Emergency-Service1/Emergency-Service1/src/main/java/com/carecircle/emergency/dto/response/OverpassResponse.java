package com.carecircle.emergency.dto.response;

import java.util.List;

import com.carecircle.emergency.dto.Element;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OverpassResponse {

    private List<Element> elements;

    public OverpassResponse() {
    }

    public List<Element> getElements() {
        return elements;
    }

    public void setElements(List<Element> elements) {
        this.elements = elements;
    }
}