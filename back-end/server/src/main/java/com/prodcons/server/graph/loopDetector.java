package com.prodcons.server.graph;

import java.util.List;
import org.jgrapht.alg.cycle.HawickJamesSimpleCycles;
import org.jgrapht.graph.DefaultDirectedWeightedGraph;
import org.jgrapht.graph.DefaultWeightedEdge;

public class loopDetector {
    private DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph;
    HawickJamesSimpleCycles<String, DefaultWeightedEdge> detector;
    public loopDetector(DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph)
    {
        this.graph = graph;
        this.detector = new HawickJamesSimpleCycles<>(graph);
    }
    public List<List<String>> getLoops()
    {
        return this.detector.findSimpleCycles();
    }

    
}
