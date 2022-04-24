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
    //adding a node post request
    @PostMapping("/+node/{name}")
    public boolean add_node(@PathVariable("name") String name){
        try{
            this.SFG.addVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //adding an edge post request
    //for example: "/+edge/y1/y2/40" adds an edge from (y1) to (y2) with weight 40
    @PostMapping("/+edge/{from}/{to}/{weight}")
    public boolean add_edge(
        @PathVariable("from") String from,
        @PathVariable("to") String to,
        @PathVariable("weight") String weight)

    {
        try{
            if(isNumeric(weight)){ //Numeric weights
                this.SFG.addEdge(from, to, Double.valueOf(weight));
            }
            else{ //variable weights
                // this.SFG.addEdge(from, to, weight);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //clear the whole graph to draw another one - delete request
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
        // this.SFG.getPaths();
        // this.SFG.loops = this.SFG.detector.getNonTouchingLoops();
        // this.SFG.calculatePathFactors();
        // this.SFG.calculateDeterminant();
        // this.SFG.calculateGain();
    }

    //forward paths get request
    @GetMapping("/solve/forward-paths")
    public String get_forward_paths(){
        try{
            return this.SFG.getPaths();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //loops get request
    @GetMapping("/solve/loops")
    public String get_loops(){
        try{
            return this.SFG.getAllLoops();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //Non touching loops get request
    @GetMapping("/solve/non-touching-loops")
    public String get_non_touching_loops(){
        try{
            return this.SFG.getLoopsClassified();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //determinants get request
    @GetMapping("/solve/determinants(path-factors)")
    public String get_determinants(){
        try{
            return this.SFG.calculatePathFactors();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //determinant get request
    @GetMapping("/solve/determinants")
    public String get_determinant(){
        try{
            return this.SFG.calculateDeterminant();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }

    //Overall gain (the result) get request
    @GetMapping("/solve/overall-gain")
    public String get_overall_gain(){
        try{
            return /* this.SFG.getOverallGain() */ null;
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
