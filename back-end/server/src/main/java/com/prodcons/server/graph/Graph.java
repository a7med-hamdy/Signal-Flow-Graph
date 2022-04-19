package com.prodcons.server.graph;
import org.jgrapht.GraphPath;
import org.jgrapht.graph.DefaultWeightedEdge;
import org.jgrapht.graph.DefaultDirectedWeightedGraph;
import  org.jgrapht.alg.shortestpath.*;
import java.util.ArrayList;
import java.util.List;
public class Graph {
    private DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph = new DefaultDirectedWeightedGraph<>(DefaultWeightedEdge.class);
    private AllDirectedPaths<String, DefaultWeightedEdge> paths = new AllDirectedPaths<>(this.graph);
    List<GraphPath<String,DefaultWeightedEdge>> forwardPaths;
    List<Double> pathsGain = new ArrayList<>();
    public Graph (){
        /*
        this.graph.addVertex("y1");
        this.graph.addVertex("y2");
        this.graph.addVertex("y3");
        this.graph.addVertex("y4");
        this.graph.addVertex("y5");
        this.graph.addVertex("y6");
        this.graph.addVertex("y7");
        DefaultWeightedEdge edge1 = this.graph.addEdge("y1", "y2");
        this.graph.setEdgeWeight(edge1, 1);
        DefaultWeightedEdge edge2 = this.graph.addEdge("y2", "y3");
        this.graph.setEdgeWeight(edge2, 5);
        DefaultWeightedEdge edge3 = this.graph.addEdge("y3", "y4");
        this.graph.setEdgeWeight(edge3, 10);
        DefaultWeightedEdge edge4 = this.graph.addEdge("y4", "y5");
        this.graph.setEdgeWeight(edge4, 2);
        DefaultWeightedEdge edge5 = this.graph.addEdge("y5", "y7");
        this.graph.setEdgeWeight(edge5, 1);
        DefaultWeightedEdge edge6 = this.graph.addEdge("y2", "y6");
        this.graph.setEdgeWeight(edge6, 10);
        DefaultWeightedEdge edge7 = this.graph.addEdge("y6", "y5");
        this.graph.setEdgeWeight(edge7, 2);

         */
    }
    public void getPaths(String startVertex, String endVertex){
        this.forwardPaths= this.paths.getAllPaths(startVertex, endVertex, true, null);
        for(int i = 0; i < this.forwardPaths.size(); i++){
            List<DefaultWeightedEdge> edges = this.forwardPaths.get(i).getEdgeList();
            double gain = 1.0;
            for(DefaultWeightedEdge e : edges){
                gain *=  this.graph.getEdgeWeight(e);
            }
            pathsGain.add(gain);
            //System.out.println("P" + (i+1) +": " + this.forwardPaths.get(i).getVertexList() + " gain: " + gain);
        }
    }

}
