package com.prodcons.server.graph;



import org.jgrapht.graph.DefaultWeightedEdge;
import java.util.List;

import org.jgrapht.graph.DefaultDirectedWeightedGraph;


public class Graph {
    private DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph = new DefaultDirectedWeightedGraph<>(DefaultWeightedEdge.class);
    loopDetector detector;
    public Graph (){
        this.detector = new loopDetector(this.graph);
        this.graph.addVertex("v1");
        this.graph.addVertex("v2");
        this.graph.addVertex("v3");
        this.graph.addVertex("v4");
        this.graph.addVertex("v5");
        this.graph.addVertex("v6");
        this.graph.addVertex("v7");
        this.graph.addEdge("v1", "v2");
        this.graph.addEdge("v2", "v3");
        this.graph.addEdge("v3", "v7");
        this.graph.addEdge("v7", "v4");
        this.graph.addEdge("v4", "v5");
        this.graph.addEdge("v5", "v6");
        this.graph.addEdge("v6", "v7");
        this.graph.addEdge("v7", "v2");
        List<List<String>> list = this.detector.getLoops();
        for(List<String> l: list)
        {
            for(String s: l)
            {
                System.out.print(s + " ");
            }
            System.out.print("\n");
        }
    } 
}
