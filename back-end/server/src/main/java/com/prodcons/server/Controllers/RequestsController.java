package com.prodcons.server.Controllers;
import java.util.regex.Pattern;

import com.prodcons.server.graph.*;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class RequestsController {
    Graph SFG = new Graph();

    //using Regex to check if the weights of the edges are numbers or not
    /*the numbers grammar "-?\\d+(\\.\\d+)?":
        "-?"         -> negative sign is optional
        "\\d+"       -> one or more digits
        "(\\.\\d+)?" -> fraction part is optional
    */
    private Pattern pattern = Pattern.compile("-?\\d+(\\.\\d+)?");
    //checks if the given string is a number or not
    public boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false; 
        }
        return pattern.matcher(strNum).matches();
    }
    /**************************************************
     * Craeation Graph requests                       *
     **************************************************/
    //adding a node request
    @PostMapping("/+node/{name}")
    public boolean add_node(@PathVariable("name") String name){
        try{
            // this.SFG.graph.addVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //adding an edge request
    //for example: "/+edge/y1/y2/40" adds an edge from (y1) to (y2) with weight 40
    @PostMapping("/+edge/{from}/{to}/{weight}")
    public boolean add_edge(
        @PathVariable("from") String from,
        @PathVariable("to") String to,
        @PathVariable("weight") String weight)

    {
        try{
            // this.SFG.graph.addEdge(from, to);
            if(isNumeric(weight)){ //Numeric weights
                // this.SFG.graph.setEdgeWeight(this.SFG.graph.getEdge(from, to), Double.valueOf(weight));
            }
            else{ //variable weights
                // this.SFG.graph.setEdgeWeight(from, to, weight);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //clear the whole graph to draw another one
    @DeleteMapping("/clear")
    public boolean clearGraph(){
        try{
            this.SFG = new Graph();
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }


    /**************************************************
     * Solution requests                              *
     **************************************************/
    //checks if it's a valid Signal-Flow-Graph or not 
    @PostMapping("/validate")
    public boolean validate(){
        return /* this.SFG.valdiateGraph() */ true;
    }
    
    //solves & stores the solution
    @PostMapping("/solve")
    public void solve(){
            //solving the signal flow graph
        // this.SFG.getPaths("", "");
        // this.SFG.loops = this.SFG.detector.getNonTouchingLoops();
        // this.SFG.calculatePathFactors();
        // this.SFG.calculateDeterminant();
        // this.SFG.calculateGain();
    }

    @GetMapping("/solve/forward-paths")
    public String[] get_forward_paths(){
        String[] forward_paths = {};
        // forward_paths = this.SFG.getForwardPaths();
        return forward_paths;
    }

    @GetMapping("/solve/loops")
    public String[] get_loops(){
        String[] loops = {};
        // loops = this.SFG.getLoops();
        return loops;
    }

    @GetMapping("/solve/non-touching-loops")
    public String[] get_non_touching_loops(){
        String[] non_touching_loops = {};
        // non_touching_loops = this.SFG.getNonTouchingLoops();
        return non_touching_loops;
    }

    @GetMapping("/solve/determinants")
    public Double[] get_determinants(){
        Double[] determinants = {};
        // determinants = this.SFG.getDeterminants();
        return determinants;
    }

    @GetMapping("/solve/overall-gain")
    public Double get_overall_gain(){
        double overall_gain = 0;
        // overall_gain = this.SFG.getOverallGain();
        return overall_gain;
    }
}
