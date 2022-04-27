package com.prodcons.server.graph;
import org.jgrapht.GraphPath;
import org.jgrapht.graph.DefaultWeightedEdge;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jgrapht.graph.DirectedWeightedPseudograph;
import org.jgrapht.alg.connectivity.ConnectivityInspector;
import  org.jgrapht.alg.shortestpath.*;

public class Graph {
    private DirectedWeightedPseudograph<String, DefaultWeightedEdge> graph = new DirectedWeightedPseudograph<>(DefaultWeightedEdge.class);
    private loopDetector detector = new loopDetector(this.graph);
    private AllDirectedPaths<String, DefaultWeightedEdge> paths = new AllDirectedPaths<>(this.graph);
    private List<GraphPath<String,DefaultWeightedEdge>> forwardPaths;
    private List<Double> pathsGain = new ArrayList<>();
    private List<List<String>> Looplist;
    private List<Double> loopGains = new ArrayList<>();
    private ArrayList<Set<DefaultWeightedEdge>> buffer = new ArrayList<>();
    private List<Double> pathFactor = new ArrayList<>();
    private List<List<List<String>>> loops;
    private String startVertex = "";
    private String endVertex = "";
    private double determinant = 1;
    public Graph (){}

    // add vertex to the graph
    public void addVertex(String v)
    {
        this.graph.addVertex(v);
    }
    // check whether the graph is connected(valid) or not
    // if invalid don't do operations on it
    public boolean isValid()
    {
        ConnectivityInspector<String, DefaultWeightedEdge>inspector = new ConnectivityInspector<>(this.graph);
        System.out.println(inspector.isConnected());
        return inspector.isConnected();
    }
    //set the start vertex
    public void setStartVertex(String v){ this.startVertex = v; }
    //set the end vertex
    public void setEndVertex(String v)  { this.endVertex = v;   }

    // add edge with a weight
    public void addEdge(String source, String destination, double weight)
    {
        try{
            DefaultWeightedEdge e = this.graph.addEdge(source, destination);
            this.graph.setEdgeWeight(e, weight);
            System.out.println("edge added");
            Set<DefaultWeightedEdge> s = this.graph.getAllEdges(source, destination);
            for(DefaultWeightedEdge edge : s)
            {
                System.out.println("new weight : " + this.graph.getEdgeWeight(edge));
            }
        }
        catch(IllegalArgumentException e)
        {
            System.out.println("error adding edge");
        }
    }
    // add edge with default weight (1)
    public void addEdge(String source, String destination) 
    {
        try{
            this.graph.addEdge(source, destination);
            System.out.println("edge added");
            Set<DefaultWeightedEdge> s = this.graph.getAllEdges(source, destination);
            for(DefaultWeightedEdge edge : s)
            {
                System.out.println("new weight : " + this.graph.getEdgeWeight(edge));
            }
        }
        catch(IllegalArgumentException e)
        {
            System.out.println("error adding edge");
        }
    }
    // reset the values stored by graph in case or requiring to do operations again 
    public void resetGraphCalculations()
    {
        this.paths = new AllDirectedPaths<>(this.graph);
        this.detector = new loopDetector(this.graph);
        this.pathFactor = new ArrayList<>();
        this.pathsGain = new ArrayList<>();
        this.buffer = new ArrayList<>();
        this.loopGains = new ArrayList<>();
        this.determinant = 1;
    }

    public synchronized void setEdgeWeight(String source, String destination, double new_weight, double old_weight)
    {
        if(new_weight == old_weight)
        {
            return;
        }
        Set<DefaultWeightedEdge> s = this.graph.getAllEdges(source, destination);
        System.out.println("new weight: " + new_weight + " old_weight: " + old_weight);
        System.out.println(source + "  -->  " + destination);
        for(DefaultWeightedEdge edge : s)
        {
            if(this.graph.getEdgeWeight(edge) == old_weight)
            {
                System.out.println("found");
                this.graph.setEdgeWeight(edge, new_weight);
                break;
            }
        }
        for(DefaultWeightedEdge edge : s)
        {
            System.out.println("new weight : " + this.graph.getEdgeWeight(edge));
        }
        System.out.println("********************************************");
    }

    public String getPaths(){
        
        JSONArray arr = new JSONArray();
        this.forwardPaths= this.paths.getAllPaths(this.startVertex, this.endVertex, true, null);
        for(int i = 0; i < this.forwardPaths.size(); i++){
            List<DefaultWeightedEdge> edges = this.forwardPaths.get(i).getEdgeList();
            double gain = 1.0;
            for(DefaultWeightedEdge e : edges){
                gain *=  this.graph.getEdgeWeight(e);
            }
            pathsGain.add(gain);
            // System.out.println("P" + (i+1) +": " + this.forwardPaths.get(i).getVertexList() + " gain: " + gain);
            JSONObject obj = new JSONObject();
            obj.putOpt("path", this.forwardPaths.get(i).getVertexList());
            obj.putOpt("gain", gain);
            arr.put(obj);
        }
        System.out.println(arr.toString());
        return arr.toString();
    }

    public String getAllLoops()
    {
        JSONArray arr = new JSONArray();
        this.Looplist = this.detector.getLoops();
        for(List<String> li: Looplist)
        {
            JSONObject o = new JSONObject();
            o.putOpt("loop", new JSONArray());
            JSONArray array = (JSONArray)o.get("loop");
            for(String s : li)
            {
                array.put(s);
            }
            array.put(li.get(0));
            o.putOpt("gain", this.getGain(li));
            arr.put(o);
        }
        System.out.println(arr.toString());
        return arr.toString();
    }

    public String getLoopsClassified()
    {
        JSONArray arr = new JSONArray();
        boolean found = false;
        this.loops = this.detector.getNonTouchingLoops();
        ArrayList<JSONObject> objects = new ArrayList<>();
        for(List<List<String>> l: this.loops)
        {
            JSONObject obj = new JSONObject();
            found = false;
            for(JSONObject o : objects)
            {
                if(o.has(Integer.toString(l.size())))
                {
                    obj = o;
                    found = true;
                    break;
                }
            }
            if(!found)
            {
                obj.putOpt(Integer.toString(l.size()), new JSONArray());
                objects.add(obj);
            }
            JSONArray a = (JSONArray)obj.get(Integer.toString(l.size()));
            for(List<String> li: l)
            {
                JSONObject o = new JSONObject();
                o.putOpt("loop", new JSONArray());
                JSONArray array = (JSONArray)o.get("loop");
                for(String s : li)
                {
                    array.put(s);
                }
                array.put(li.get(0));
                o.putOpt("gain", this.getGain(li));
                a.put(o);
            }
            if(!found)
            {
                arr.put(obj);
            }
        }
        System.out.println(arr.toString());
        return arr.toString();
    }

    public String calculatePathFactors(){
        JSONArray arr = new JSONArray();
        for(int i = 0; i < forwardPaths.size(); i++){
            JSONObject obj = new JSONObject();
            List<String> path = forwardPaths.get(i).getVertexList();
            double factor = 1.0;
            for(List<List<String>> loopsList: loops){
                double loopGain = 1.0;
                boolean isolated = true;
                for(List<String> loop : loopsList){
                    isolated = isolated & Collections.disjoint(path, loop);
                    loopGain *= getGain(loop);
                }
                if(isolated) {
                    if (loopsList.size()%2 == 1) {
                        factor -= loopGain;
                    } else {
                        factor += loopGain;
                    }
                }
            }
            obj.putOpt("path", path);
            obj.putOpt("factor", factor);
            arr.put(obj);
            pathFactor.add(factor);
        }
        System.out.println(arr.toString());
        return arr.toString();
    }
    public String calculateDeterminant(){
        for(List<List<String>> loopsList : loops) {
            double loopGain = 1.0;
            for (List<String> loop : loopsList) {
                loopGain *= getGain(loop);
            }
            if (loopsList.size() % 2 == 1) {
                // System.out.println(-loopGain);
                this.determinant -= loopGain;
            } else {
                // System.out.println(loopGain);
                this.determinant += loopGain;
            }
        }
        System.out.println("d = " + determinant);
        return Double.toString(determinant);
    }
    public String getOverallGain()
    {
        double sum = 0;
        int i = 0;
        for(double gain : this.pathsGain)
        {
            sum += gain*this.pathFactor.get(i);
            i++;
        }
        double answer = sum / determinant;
        System.out.println(answer);
        JSONObject ans = new JSONObject();
        ans.putOpt("answer", Double.toString(answer));
        return ans.toString();
    }


   
    private double getGain(List<String> path)
    {
        double gain = 1;
        for(int i = 0; i < path.size(); i++)
        {
            Set<DefaultWeightedEdge> s = this.graph.getAllEdges(path.get(i), path.get((i+1)%path.size()));
            DefaultWeightedEdge e = this.graph.getEdge(path.get(i), path.get((i+1)%path.size()));
            if(s.size() == 1)
            {
                gain *= this.graph.getEdgeWeight(e);
                continue;
            }
            else
            {
                //search for the edge 
                boolean found = false;
                boolean setFound = false;
                Set<DefaultWeightedEdge> setTemp = new HashSet<>();
                for(Set<DefaultWeightedEdge> set : buffer)
                {
                    //check only the first element of each set because they are all the same
                    DefaultWeightedEdge temp = e;
                    for(DefaultWeightedEdge edge: set)
                    {
                        // if found take the gain from the stored value and remove it
                        if(this.graph.getEdgeSource(edge) == this.graph.getEdgeSource(edge)
                            && this.graph.getEdgeTarget(edge) == this.graph.getEdgeTarget(edge)
                        ){found = true; temp = edge;gain *= this.graph.getEdgeWeight(edge);}
                        break;
                    }
                    if(found){set.remove(temp);}
                    // remove the set it it's empty
                    if(set.size() == 0){setFound = true;setTemp = set;}
                }
                if(setFound){buffer.remove(setTemp);}
                if(!found)
                {
                    DefaultWeightedEdge edge = s.iterator().next();
                    gain *= this.graph.getEdgeWeight(edge);
                    s.remove(edge);
                    buffer.add(s);
                }
            }
        }
        return gain;
    }

}
