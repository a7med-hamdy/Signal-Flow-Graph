package com.prodcons.server.graph;
import org.jgrapht.GraphPath;
import org.jgrapht.graph.DefaultWeightedEdge;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jgrapht.graph.DefaultDirectedWeightedGraph;
import org.jgrapht.alg.connectivity.ConnectivityInspector;
import  org.jgrapht.alg.shortestpath.*;
import java.util.ArrayList;

public class Graph {
    private DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph = new DefaultDirectedWeightedGraph<>(DefaultWeightedEdge.class);
    private loopDetector detector = new loopDetector(this.graph);
    private AllDirectedPaths<String, DefaultWeightedEdge> paths = new AllDirectedPaths<>(this.graph);
    private List<GraphPath<String,DefaultWeightedEdge>> forwardPaths;
    private List<Double> pathsGain = new ArrayList<>();
    private List<Double> pathFactor = new ArrayList<>();
    private List<List<List<String>>> loops;
    private String startVertex = "";
    private String endVertex = "";
    private double determinant = 1;
    public Graph (){}


    public void addVertex(String v)
    {
        this.graph.addVertex(v);
    }
    public boolean isValid()
    {
        ConnectivityInspector<String, DefaultWeightedEdge>inspector = new ConnectivityInspector<>(this.graph);
        System.out.println(inspector.isConnected());
        return inspector.isConnected();
    }

    public void setStartVertex(String v){ this.startVertex = v; }
    public void setEndVertex(String v)  { this.endVertex = v;   }

    public void addEdge(String source, String destination, double weight) throws Exception
    {
        try{
            DefaultWeightedEdge e = this.graph.addEdge(source, destination);
            if(e == null)
            {
                throw new Exception();
            }
            this.graph.setEdgeWeight(this.graph.getEdge(source, destination), weight);
        }
        catch(IllegalArgumentException e)
        {
            System.out.println("error adding edge");
            throw new Exception();
        }
    }
    public void addEdge(String source, String destination) throws Exception
    {
        try{
            DefaultWeightedEdge e =  this.graph.addEdge(source, destination);
            if(e == null)
            {
                throw new Exception();
            }
        }
        catch(IllegalArgumentException e)
        {
            System.out.println("error adding edge");
            throw new Exception();
        }
    }

    public void resetGraphCalculations()
    {
        this.paths = new AllDirectedPaths<>(this.graph);
        this.detector = new loopDetector(this.graph);
        this.pathFactor = new ArrayList<>();
        this.pathsGain = new ArrayList<>();
        this.determinant = 1;
    }

    public void setEdgeWeight(String source, String destination, double weight)
    {
        this.graph.setEdgeWeight(this.graph.getEdge(source, destination), weight);
    }

    public String getPaths(){
        System.out.println("called");
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
        List<List<String>> list = this.detector.getLoops();
        for(List<String> li: list)
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
        // System.out.println("d = " + determinant);
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
        if(determinant == 0)
        {
            return "infinity";
        }
        double answer = sum / determinant;
        return Double.toString(answer);
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
