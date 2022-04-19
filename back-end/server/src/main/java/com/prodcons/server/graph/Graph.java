package com.prodcons.server.graph;
import org.jgrapht.GraphPath;
import org.jgrapht.graph.DefaultWeightedEdge;
import java.util.List;

import org.jgrapht.graph.DefaultDirectedWeightedGraph;
import  org.jgrapht.alg.shortestpath.*;
import java.util.ArrayList;
public class Graph {
    private DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph = new DefaultDirectedWeightedGraph<>(DefaultWeightedEdge.class);
    loopDetector detector;
    private AllDirectedPaths<String, DefaultWeightedEdge> paths = new AllDirectedPaths<>(this.graph);
    List<GraphPath<String,DefaultWeightedEdge>> forwardPaths;
    List<Double> pathsGain = new ArrayList<>();
    public Graph (){
        this.detector = new loopDetector(this.graph);
        this.graph.addVertex("v1");
        this.graph.addVertex("v2");
        this.graph.addVertex("v3");
        this.graph.addVertex("v4");
        this.graph.addVertex("v5");
        this.graph.addVertex("v6");
        this.graph.addVertex("v7");
        this.graph.addVertex("v8");
        this.graph.addEdge("v1", "v2");
        this.graph.addEdge("v2", "v3");
        this.graph.addEdge("v3", "v4");
        this.graph.addEdge("v4", "v1");
        this.graph.addEdge("v4", "v5");
        this.graph.addEdge("v5", "v6");
        this.graph.addEdge("v6", "v5");
        this.graph.addEdge("v3", "v1");
        this.graph.addEdge("v6", "v7");
        this.graph.addEdge("v7", "v8");
        this.graph.addEdge("v8", "v7");
        this.graph.setEdgeWeight(this.graph.getEdge("v7", "v8"), 5);
        this.graph.setEdgeWeight(this.graph.getEdge("v1", "v2"), 2);
        this.graph.setEdgeWeight(this.graph.getEdge("v4", "v1"), 3);
        List<List<List<String>>> list = this.detector.getNonTouchingLoops();
        int i = 1;
        for(List<List<String>> l: list)
        {
            if(i == 1)
            {
                System.out.println("all loops : ");
            }
            else
            {
                System.out.println(l.size() + " Non touching loops : ");
            }
            for(List<String> li: l)
            {
                for(String s : li)
                {
                    System.out.print(s + " ");
                }
                System.out.println("gain = " + this.getGain(li));
            }
            i++;
        }
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

    private double getGain(List<String> path)
    {
        double gain = 1;
        for(int i = 0; i < path.size(); i++)
        {
            gain *= this.graph.getEdgeWeight(this.graph.getEdge(path.get(i), path.get((i+1)%path.size())));
        }
        return gain;
    }

}
