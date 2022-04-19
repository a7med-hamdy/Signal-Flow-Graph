package com.prodcons.server.graph;
import org.jgrapht.graph.DefaultWeightedEdge;

public class Edge extends DefaultWeightedEdge{
    private String weight = "";
    public Edge(String weight)
    {
        super();
        this.weight = weight;
    }
    protected String getStringWeight()
    {
        return this.weight;
    }
}
